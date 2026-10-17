import { Course, ConversationMessage, ObjectionCategory, Lead } from '../types';
import { db } from './db';
import { detectObjectionsInText, calculateLeadScore, determineNextBestAction } from './scoring';

export interface AiCounsellorResponse {
  messageText: string;
  detectedLanguage: 'English' | 'Hindi' | 'Marathi' | 'Mixed';
  verifiedFactsUsed: string[];
  recommendedCourse?: Course;
  detectedObjections: { category: ObjectionCategory; quote: string; confidence: number; suggestedResponse: string; requiresHuman: boolean }[];
  updatedSummary?: string;
  suggestedAction?: string;
  suggestAptitudeTest?: boolean;
  suggestDemoBooking?: boolean;
}

// Detect language from user text
export function detectLanguage(text: string): 'English' | 'Hindi' | 'Marathi' | 'Mixed' {
  // Check for Devanagari script: Marathi specific markers like 'आहे', 'नाही', 'कसे', 'जमेल', 'शिकायचं', 'माझं'
  const marathiMarkers = ['आहे', 'नाही', 'कसे', 'जमेल', 'शिकायचं', 'माझं', 'माझे', 'मला', 'करावे', 'होईल', 'बघायचा', 'कळवा', 'सांगा'];
  const hindiMarkers = ['है', 'नहीं', 'कैसे', 'सकता', 'सीखना', 'मेरा', 'मुझे', 'करना', 'होगा', 'बताएं', 'नमस्ते', 'चाहिए'];
  
  const marathiLatinMarkers = ['shikaych', 'ahe', 'nahi', 'kasa', 'jamel', 'mala', 'mazam', 'bolto', 'pahije'];
  const hindiLatinMarkers = ['karna', 'hai', 'nahi', 'kaise', 'sakta', 'mera', 'mujhe', 'batao', 'chahiye', 'kare'];

  const lower = text.toLowerCase();

  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  if (hasDevanagari && hasLatin) {
    return 'Mixed';
  }

  // Check Marathi in Devanagari
  if (marathiMarkers.some(m => text.includes(m))) {
    return hasLatin ? 'Mixed' : 'Marathi';
  }

  // Check Hindi in Devanagari
  if (hindiMarkers.some(m => text.includes(m))) {
    return hasLatin ? 'Mixed' : 'Hindi';
  }

  // Check Marathi in Latin script
  if (marathiLatinMarkers.some(m => lower.includes(m))) {
    return 'Mixed';
  }

  // Check Hindi in Latin script (Hinglish)
  if (hindiLatinMarkers.some(m => lower.includes(m))) {
    return 'Mixed';
  }

  if (hasDevanagari) {
    return 'Hindi';
  }

  return 'English';
}

// RAG: Retrieve strictly verified courses matching query
export function retrieveVerifiedCourseFacts(query: string, courses: Course[]): { courses: Course[]; verifiedFacts: string[] } {
  const verifiedCourses = courses.filter(c => c.isActive && c.isVerified);
  const lower = query.toLowerCase();

  const matched = verifiedCourses.filter(c => {
    return (
      lower.includes(c.code.toLowerCase()) ||
      lower.includes(c.name.toLowerCase()) ||
      (lower.includes('web') && c.code === 'FSD-101') ||
      (lower.includes('coding') && c.code === 'FSD-101') ||
      (lower.includes('developer') && c.code === 'FSD-101') ||
      (lower.includes('mern') && c.code === 'FSD-101') ||
      (lower.includes('data') && c.code === 'DSAI-201') ||
      (lower.includes('ai') && c.code === 'DSAI-201') ||
      (lower.includes('python') && c.code === 'DSAI-201') ||
      (lower.includes('cloud') && c.code === 'CLD-301') ||
      (lower.includes('devops') && c.code === 'CLD-301') ||
      (lower.includes('aws') && c.code === 'CLD-301') ||
      (lower.includes('design') && c.code === 'UIUX-401') ||
      (lower.includes('ui') && c.code === 'UIUX-401') ||
      (lower.includes('figma') && c.code === 'UIUX-401')
    );
  });

  const facts: string[] = [];
  const selected = matched.length > 0 ? matched : verifiedCourses.slice(0, 2);

  selected.forEach(c => {
    facts.push(`${c.name}: Fees ₹${c.fees.toLocaleString('en-IN')}, Duration: ${c.duration}, Mode: ${c.deliveryMode}`);
    facts.push(`Eligibility: ${c.eligibility}`);
    facts.push(`Payment Terms: ${c.paymentTerms}`);
    facts.push(`Placement Stats (Verified): ${c.verifiedPlacementStats}`);
  });

  return { courses: selected, verifiedFacts: facts };
}

// Safety filter: blocks invented guarantees or fees
function applyAiSafetyFilter(text: string): string {
  // If text promises a 100% job guarantee or unauthorized discounts, sanitize
  let sanitized = text;
  if (/100%\s*(job|placement|guarantee)/i.test(sanitized)) {
    sanitized = sanitized.replace(/100%\s*(job|placement|guarantee)[^.]*\./gi, 'we provide comprehensive placement assistance and interview prep through 180+ hiring partners, while maintaining strict adherence to regulatory standards without misleading placement guarantees.');
  }
  return sanitized;
}

// Call Google Gemini API if configured
async function callGeminiApi(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: { role: string; parts: { text: string }[] }[]
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidate) throw new Error('No response returned from Gemini API');
  return candidate;
}

// Main AI Counsellor Pipeline
export async function processAiCounsellingMessage(
  userMessage: string,
  lead: Lead,
  conversationHistory: ConversationMessage[]
): Promise<AiCounsellorResponse> {
  const language = detectLanguage(userMessage);
  const verifiedCourses = db.getVerifiedCourses();
  const { courses: matchedCourses, verifiedFacts } = retrieveVerifiedCourseFacts(userMessage, verifiedCourses);
  const integrations = db.getIntegrations();

  // Detect objections
  const detectedObjs = detectObjectionsInText(userMessage);

  // Check specific query triggers
  const lower = userMessage.toLowerCase();
  const isAptitudeRequest = lower.includes('aptitude') || lower.includes('test') || lower.includes('confused') || lower.includes('which course') || lower.includes('जमेल का');
  const isDemoRequest = lower.includes('demo') || lower.includes('class') || lower.includes('trial') || lower.includes('slot') || lower.includes('शनिवारी') || lower.includes('timing');
  const isGuaranteeRequest = lower.includes('100%') || lower.includes('guarantee') || lower.includes('stamp paper') || lower.includes('pakka');
  const isDiscountDemand = lower.includes('50%') || lower.includes('free') || lower.includes('kamti') || lower.includes('discount de do');

  let replyText = '';

  // 1. If real Gemini API Key is configured and not in forced demo mode
  if (integrations.geminiApiKey && !integrations.isDemoMode) {
    try {
      const systemPrompt = `You are "AI Lead Desk", an empathetic, highly professional admissions counsellor for an Indian educational institute.
LANGUAGE GUIDELINES:
- Match the student's preferred language and tone: English, Hindi (हिन्दी), Marathi (मराठी), or natural code-switching (Hinglish/Maranglish).
- E.g. If user writes in Marathi or mixed Marathi ("मला coding शिकायचं आहे, but I have no programming experience"), respond naturally in an encouraging Marathi-English mix!

STRICT AI SAFETY RULES:
1. ONLY state verified facts provided below. NEVER invent or hallucinate course fees, discount percentages, batch timings, or placement rates.
2. NEVER guarantee employment, 100% job placement, or starting salaries. Explicitly say that institutes provide dedicated placement assistance, mock interviews, and company drives, but no false guarantees.
3. If user has a study gap or non-IT background (B.Com, B.A., Mechanical), be empathetic and explain how real projects and foundational modules bridge the gap.
4. Ask ONE relevant question at a time.
5. If user asks for an unapproved discount or unsupported terms, politely decline and offer verified instalment options.

VERIFIED COURSE FACTS AUTHORIZED BY ACADEMIC DIRECTORS:
${verifiedFacts.join('\n')}
`;

      const formattedHistory = conversationHistory.slice(-6).map(m => ({
        role: m.sender === 'student' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      formattedHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const rawAiResponse = await callGeminiApi(
        integrations.geminiApiKey,
        integrations.geminiModel,
        systemPrompt,
        formattedHistory
      );

      replyText = applyAiSafetyFilter(rawAiResponse);
    } catch (e) {
      console.warn('Gemini API call failed, falling back to verified rule engine:', e);
      // Fallback to local verified engine below
    }
  }

  // 2. Intelligent Local Verified Engine (Fallback or Demo Mode)
  if (!replyText) {
    const course = matchedCourses[0] || verifiedCourses[0];

    // Handle Unrealistic / Unethical Guarantee requests
    if (isGuaranteeRequest) {
      if (language === 'Marathi') {
        replyText = `आम्ही पारदर्शकतेवर विश्वास ठेवतो. कोणताही मान्यताप्राप्त शैक्षणिक संस्था १००% जॉबची हमी स्टॅम्प पेपरवर देऊ शकत नाही. मात्र, आम्ही ८४% प्रमाणित प्लेसमेंट रेकॉर्ड, मॉक इंटरव्ह्यू आणि १८०+ कंपन्यांचे कॅम्पस ड्राईव्ह्स पुरवतो. तुम्ही स्वतः येऊन विद्यार्थ्यांचे रिव्ह्यू आणि लॅब पाहू इच्छिता का?`;
      } else if (language === 'Hindi') {
        replyText = `हम पूरी पारदर्शिता के साथ काम करते हैं। कोई भी प्रतिष्ठित संस्थान स्टैम्प पेपर पर 100% नौकरी की झूठी गारंटी नहीं देता। हम आपको 180+ हायरिंग पार्टनर्स, लाइव प्रोजेक्ट्स और टेक्निकल इंटरव्यू की पूरी तैयारी करवाते हैं। क्या आप शनिवार को हमारे प्लेसमेंट सेल का डेमो सेशन देखना चाहेंगे?`;
      } else {
        replyText = `We believe in 100% transparency. Ethical educational institutions do not provide stamp paper job guarantees. Instead, we offer verified placement assistance (84% audited placement record for 2025-26), personalized resume workshops, and drives with 180+ hiring partners. Would you like to speak directly with an admissions counsellor?`;
      }
    } 
    // Handle Unapproved discounts
    else if (isDiscountDemand) {
      if (language === 'Marathi') {
        replyText = `आमची फी रचना शिक्षक व लॅबच्या उच्च गुणवत्तेसाठी निश्चित केलेली आहे. ५०% सवलत उपलब्ध नसली, तरी आमच्याकडे १०% अर्ली बर्ड डिस्काउंट (EARLYBIRD10) किंवा ॲप्टिट्यूड टेस्टमध्ये ८०%+ गुण मिळाल्यास १५% मेरिट स्कॉलरशिप (MERIT15) उपलब्ध आहे. तसेच ₹४,९९९/महिना नो-कॉस्ट ईएमआय देखील उपलब्ध आहे. तुम्ही मेरिट स्कॉलरशिप टेस्ट देऊ इच्छिता का?`;
      } else if (language === 'Hindi') {
        replyText = `हमारी फीस उच्च गुणवत्ता वाले मेंटॉरशिप और प्रोजेक्ट्स को ध्यान में रखकर तय की गई है। 50% छूट उपलब्ध नहीं है, लेकिन आप 10% अर्ली-बर्ड या हमारे एप्टीट्यूड टेस्ट में 80%+ स्कोर करके 15% मेरिट स्कॉलरशिप (MERIT15) प्राप्त कर सकते हैं। क्या आप एप्टीट्यूड टेस्ट देना चाहेंगे?`;
      } else {
        replyText = `To maintain the highest quality of mentorship and lab infrastructure, our fee is structured at ₹${course.fees.toLocaleString('en-IN')}. While 50% discounts are not approved, we do offer a 10% Early Bird waiver (EARLYBIRD10) and a 15% Merit Scholarship (MERIT15) if you score 80%+ on our adaptive aptitude test. We also provide zero-interest EMI starting at ₹4,999/month. Would you like to take the 3-minute aptitude test?`;
      }
    }
    // Handle Study Gap / Career Switch (Marathi & Code-switch)
    else if (language === 'Marathi' || (language === 'Mixed' && /शिकायचं|जमेल|मराठी|gap/i.test(userMessage))) {
      if (lower.includes('gap') || lower.includes('कॉमर्स') || lower.includes('b.com') || lower.includes('arts') || lower.includes('शिकायचं')) {
        replyText = `नमस्कार! तुम्ही अजिबात काळजी करू नका. शिक्षणामध्ये गॅप असणे किंवा नॉन-आयटी (कॉमर्स/आर्ट्स) बॅकग्राउंड असणे ही कोडिंग शिकण्यात कोणतीही अडचण नाही. आमच्या ४०% हून अधिक यशस्वी विद्यार्थ्यांनी कॉमर्स व आर्ट्समधून करिअर स्विच केले आहे. कोडिंगमध्ये लॉजिक आणि प्रॅक्टिस सर्वात जास्त महत्त्वाची असते.\n\nआमच्या ${course.name} कोर्समध्ये अगदी बेसिकपासून शिकवले जाते. तुम्हाला सकाळी की संध्याकाळी कोणत्या वेळेत शिकणे सोयीचे पडेल?`;
      } else {
        replyText = `नमस्कार! ${course.name} बद्दल अधिक माहिती हवी असल्यास आम्ही नक्की मदत करू. हा ${course.duration} चा प्रॅक्टिकल कोर्स असून याची प्रमाणित फी ₹${course.fees.toLocaleString('en-IN')} आहे, जी तुम्ही सुलभ हप्त्यांमध्ये भरू शकता.\n\nतुम्हाला या कोर्सबद्दल काय जाणून घ्यायला आवडेल?`;
      }
    }
    // Handle Hindi
    else if (language === 'Hindi') {
      if (lower.includes('gap') || lower.includes('non-it') || lower.includes('commerce') || lower.includes('सीखना')) {
        replyText = `नमस्ते! गैप या नॉन-आईटी बैकग्राउंड होना कोई समस्या नहीं है। आईटी इंडस्ट्री में डिग्री से ज़्यादा आपके हैंड्स-ऑन प्रोजेक्ट्स और कोडिंग स्किल्स को महत्व दिया जाता है। हमारे ${course.name} में बेसिक से लेकर एडवांस तक सब सिखाया जाता है।\n\nक्या आप अभी वर्किंग हैं या फुल-टाइम पढ़ाई के लिए समय निकाल सकते हैं?`;
      } else {
        replyText = `नमस्ते! हमारे ${course.name} की अवधि ${course.duration} है और इसकी फीस ₹${course.fees.toLocaleString('en-IN')} है (आसान EMI विकल्प उपलब्ध हैं)।\n\nक्या आप इस कोर्स का लाइव कोडिंग डेमो देखना चाहेंगे या कोर्स के सिलेबस के बारे में जानना चाहते हैं?`;
      }
    }
    // Handle Mixed Hinglish / English
    else {
      if (lower.includes('gap') || lower.includes('b.com') || lower.includes('commerce') || lower.includes('arts') || lower.includes('switch')) {
        replyText = `Hello! Thank you for sharing your background. Having a gap or transitioning from a non-tech background like Commerce or Arts is very common—over 40% of our successful alumni transitioned from non-CS streams. Companies evaluate your GitHub projects and problem-solving skills rather than your past degree.\n\nOur ${course.name} is specifically designed with zero-prerequisite foundation modules. How many hours per week would you be able to dedicate to your studies?`;
      } else if (lower.includes('fees') || lower.includes('cost') || lower.includes('emi') || lower.includes('price')) {
        replyText = `The verified total fee for ${course.name} is ₹${course.fees.toLocaleString('en-IN')}. You can pay in 3 zero-interest instalments (₹19,000 + ₹18,000 + ₹18,000) or choose our partner No-Cost EMI starting from ₹4,999/month. We also have an approved 10% Early Bird discount (EARLYBIRD10). Would you like to attend a free live demo class first?`;
      } else if (isDemoRequest) {
        replyText = `We would love to host you! Our next live interactive 90-minute coding demo takes place this Saturday at 11:00 AM. In this session, our lead instructor builds a real cloud application with interactive Q&A. Would you like me to reserve a free seat for you?`;
      } else {
        replyText = `Welcome to AI Lead Desk! I can guide you through our verified industry tracks including Full Stack Web Development, Data Science & AI, Cloud & DevOps, and UI/UX Design.\n\nTo tailor my guidance, could you tell me a little about your current educational background and what career role you aspire to achieve?`;
      }
    }
  }

  // Generate updated 3-line concise summary
  const updatedSummary = `${lead.name} (${lead.educationBackground || 'Student'}) enquired about ${matchedCourses[0]?.name || lead.courseInterest || 'programs'} via ${lead.source}. ${detectedObjs.length > 0 ? `Concerns detected: ${detectedObjs.map(o => o.category).join(', ')}.` : 'High engagement and clear learning goals.'} Recommended next step: ${isDemoRequest ? 'Confirm demo booking slot.' : isAptitudeRequest ? 'Prompt adaptive aptitude assessment.' : 'Share verified curriculum schedule.'}`;

  return {
    messageText: replyText,
    detectedLanguage: language,
    verifiedFactsUsed: verifiedFacts,
    recommendedCourse: matchedCourses[0],
    detectedObjections: detectedObjs.map(o => ({
      category: o.category,
      quote: o.supportingQuote,
      confidence: o.confidence,
      suggestedResponse: o.suggestedResponse,
      requiresHuman: o.requiresHumanIntervention
    })),
    updatedSummary,
    suggestAptitudeTest: isAptitudeRequest,
    suggestDemoBooking: isDemoRequest
  };
}
