import {
  Lead,
  LeadScoreBreakdown,
  LeadTemperature,
  DetectedObjection,
  ObjectionCategory,
  NextBestAction,
  PipelineStage
} from '../types';

export function calculateLeadScore(lead: Partial<Lead>, messageHistory: string[] = []): {
  score: number;
  temperature: LeadTemperature;
  breakdown: LeadScoreBreakdown;
} {
  const reasons: string[] = [];
  
  // 1. Course interest (0-25)
  let courseInterest = 15; // baseline interest by virtue of enquiry
  if (lead.courseInterest && lead.courseInterest.length > 5) {
    courseInterest += 5;
    reasons.push(`Targeted interest in specific curriculum (${lead.courseInterest})`);
  }
  if (lead.careerGoal && lead.careerGoal.length > 5) {
    courseInterest += 5;
    reasons.push(`Defined career objective: "${lead.careerGoal}"`);
  }
  courseInterest = Math.min(25, courseInterest);

  // 2. Engagement (0-20)
  let engagement = 10;
  const totalMessages = messageHistory.length;
  if (totalMessages >= 4) {
    engagement += 8;
    reasons.push(`Active two-way conversation engagement (${totalMessages} messages exchanged)`);
  } else if (totalMessages >= 2) {
    engagement += 4;
    reasons.push('Participated in interactive counselling dialogue');
  }
  if (lead.preferredLanguage && lead.preferredLanguage !== 'English') {
    engagement += 2;
    reasons.push(`Communicated comfortably in preferred language (${lead.preferredLanguage})`);
  }
  engagement = Math.min(20, engagement);

  // 3. Eligibility Alignment (0-20)
  let eligibilityAlignment = 12; // default neutral, never penalize missing info!
  if (lead.educationBackground) {
    eligibilityAlignment += 5;
    reasons.push(`Educational background volunteered: ${lead.educationBackground}`);
  }
  if (lead.studyGapYears !== undefined && lead.studyGapYears > 0) {
    // A gap is accounted for realistically with specialized bridging modules, not penalized
    reasons.push(`Acknowledged ${lead.studyGapYears}-year gap; eligible for skill-bridge curriculum`);
    eligibilityAlignment += 3;
  }
  eligibilityAlignment = Math.min(20, eligibilityAlignment);

  // 4. Demo or counselling intent (0-20)
  let demoIntent = 8;
  if (lead.stage === 'Demo Booked' || lead.stage === 'Demo Completed') {
    demoIntent = 20;
    reasons.push('High commitment: Scheduled or attended live practical demo session');
  } else if (lead.stage === 'Qualified') {
    demoIntent = 15;
    reasons.push('Counselling verified candidate with clear enrolment intent');
  } else if (lead.stage === 'Admission Confirmed') {
    demoIntent = 20;
    reasons.push('Enrolment seat confirmed');
  }
  demoIntent = Math.min(20, demoIntent);

  // 5. Follow-up responsiveness (0-15)
  let responsiveness = 8;
  if (lead.communicationConsent) {
    responsiveness += 4;
    reasons.push('Opted-in for WhatsApp and email counselling updates');
  }
  if (lead.preferredSchedule) {
    responsiveness += 3;
    reasons.push(`Specified batch preference (${lead.preferredSchedule})`);
  }
  responsiveness = Math.min(15, responsiveness);

  const total = courseInterest + engagement + eligibilityAlignment + demoIntent + responsiveness;

  let temperature: LeadTemperature = 'Warm';
  if (total >= 70) temperature = 'Hot';
  else if (total < 40) temperature = 'Cold';

  // Override if marked Not Interested
  if (lead.stage === 'Not Interested') {
    temperature = 'Cold';
  }

  return {
    score: total,
    temperature,
    breakdown: {
      courseInterest,
      engagement,
      eligibilityAlignment,
      demoIntent,
      responsiveness,
      total,
      reasons
    }
  };
}

// Deterministic & Natural Language Objection Detector
export function detectObjectionsInText(text: string): DetectedObjection[] {
  const lower = text.toLowerCase();
  const objections: DetectedObjection[] = [];

  // 1. Fees / Affordability
  if (
    lower.includes('fees') ||
    lower.includes('cost') ||
    lower.includes('expensive') ||
    lower.includes('mahag') ||
    lower.includes('paise') ||
    lower.includes('discount') ||
    lower.includes('emi') ||
    lower.includes('instalment') ||
    lower.includes('हप्ते') ||
    lower.includes('पैसे') ||
    lower.includes('फी') ||
    lower.includes('फीस')
  ) {
    if (lower.includes('discount') || lower.includes('emi') || lower.includes('instalment') || lower.includes('afford') || lower.includes('mahag')) {
      objections.push({
        id: `obj-${Date.now()}-fee`,
        category: 'Fees or affordability',
        supportingQuote: text.slice(0, 150),
        confidence: 90,
        suggestedResponse: 'Present verified zero-interest instalment schedules and NBFC EMI options starting from ₹4,999/month, along with approved early-bird or merit scholarships.',
        requiresHumanIntervention: false,
        detectedAt: new Date().toISOString()
      });
    }
  }

  // 2. Job / Placement concerns
  if (
    lower.includes('placement') ||
    lower.includes('job guarantee') ||
    lower.includes('100% job') ||
    lower.includes('package') ||
    lower.includes('salary') ||
    lower.includes('नोकरी') ||
    lower.includes('जॉब') ||
    lower.includes('प्लेसमेंट')
  ) {
    const isGuarReq = lower.includes('guarantee') || lower.includes('100%') || lower.includes('stamp paper');
    objections.push({
      id: `obj-${Date.now()}-job`,
      category: 'Job or placement concerns',
      supportingQuote: text.slice(0, 150),
      confidence: 92,
      suggestedResponse: 'Clearly state that we provide structured placement support, resume reviews, and 180+ hiring partner drives, but ethically do not offer false written employment guarantees.',
      requiresHumanIntervention: isGuarReq,
      detectedAt: new Date().toISOString()
    });
  }

  // 3. Family approval
  if (
    lower.includes('father') ||
    lower.includes('mother') ||
    lower.includes('parents') ||
    lower.includes('family') ||
    lower.includes('वडील') ||
    lower.includes('वडिल') ||
    lower.includes('पालक') ||
    lower.includes('आई') ||
    lower.includes('घरचे') ||
    lower.includes('माता-पिता') ||
    lower.includes('पापा')
  ) {
    objections.push({
      id: `obj-${Date.now()}-family`,
      category: 'Family approval',
      supportingQuote: text.slice(0, 150),
      confidence: 94,
      suggestedResponse: 'Offer a transparent 15-minute video or in-person session with the candidate and their family to walk through career pathways and verified batch records.',
      requiresHumanIntervention: true,
      detectedAt: new Date().toISOString()
    });
  }

  // 4. Study gap
  if (
    lower.includes('gap') ||
    lower.includes('career break') ||
    lower.includes('drop year') ||
    lower.includes('वर्ष वाया') ||
    lower.includes('गॅप')
  ) {
    objections.push({
      id: `obj-${Date.now()}-gap`,
      category: 'Study gap',
      supportingQuote: text.slice(0, 150),
      confidence: 95,
      suggestedResponse: 'Reassure that hiring companies focus on hands-on GitHub projects and demonstrable skills. Show examples of past students with 2-4 year gaps who secured developer roles.',
      requiresHumanIntervention: false,
      detectedAt: new Date().toISOString()
    });
  }

  // 5. Lack of confidence / Background mismatch
  if (
    lower.includes('b.com') ||
    lower.includes('commerce') ||
    lower.includes('arts') ||
    lower.includes('non-it') ||
    lower.includes('non tech') ||
    lower.includes('no coding') ||
    lower.includes('difficult') ||
    lower.includes('कठिन') ||
    lower.includes('इंग्रजी') ||
    lower.includes('जमेल का')
  ) {
    objections.push({
      id: `obj-${Date.now()}-conf`,
      category: 'Lack of confidence',
      supportingQuote: text.slice(0, 150),
      confidence: 91,
      suggestedResponse: 'Emphasize our beginner-friendly modular curriculum starting from basic fundamentals, with bilingual doubt clearing in Hindi and Marathi.',
      requiresHumanIntervention: false,
      detectedAt: new Date().toISOString()
    });
  }

  // 6. Time constraints
  if (
    lower.includes('working') ||
    lower.includes('job timings') ||
    lower.includes('shift') ||
    lower.includes('weekend only') ||
    lower.includes('time nahi') ||
    lower.includes('वेळ नाही')
  ) {
    objections.push({
      id: `obj-${Date.now()}-time`,
      category: 'Time constraints',
      supportingQuote: text.slice(0, 150),
      confidence: 89,
      suggestedResponse: 'Recommend our flexible Weekend Intensive or Weekday Evening batches with recorded session replays and asynchronous mentor support.',
      requiresHumanIntervention: false,
      detectedAt: new Date().toISOString()
    });
  }

  return objections;
}

// Next-Best-Action Engine
export function determineNextBestAction(lead: Lead): NextBestAction {
  // 1. Admission Confirmed
  if (lead.stage === 'Admission Confirmed') {
    return {
      action: 'Assign a human counsellor',
      reason: 'Student has completed enrollment; initiate onboarding LMS credentials and cohort orientation.',
      preferredChannel: 'Email',
      suggestedMessage: `Dear ${lead.name}, Welcome to AI Lead Desk! Your LMS credentials and orientation batch schedule are attached.`,
      recommendedDate: new Date(Date.now() + 86400000).toISOString(),
      requiresApproval: false
    };
  }

  // 2. Demo Completed -> Ready for Enrollment
  if (lead.stage === 'Demo Completed') {
    return {
      action: 'Share verified course information',
      reason: 'Student experienced the demo class; share formal admission fee structure and available merit scholarship link.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: `Hi ${lead.name}! We hope you enjoyed the live demo class. We have reserved your seat for the upcoming batch starting this Monday. Would you like to review the enrollment steps?`,
      recommendedDate: new Date(Date.now() + 43200000).toISOString(),
      requiresApproval: false
    };
  }

  // 3. Demo Booked -> Pre-demo briefing
  if (lead.stage === 'Demo Booked') {
    return {
      action: 'Schedule a follow-up',
      reason: 'Student booked demo; send reminder and pre-demo preparation checklist 2 hours before the session.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: `Hi ${lead.name}! Friendly reminder for your upcoming live demo session. Please ensure you have a laptop and stable internet connection ready.`,
      recommendedDate: lead.followUpDueDate || new Date(Date.now() + 86400000).toISOString(),
      requiresApproval: false
    };
  }

  // 4. Objections requiring human takeover
  const humanObj = lead.detectedObjections.find(o => o.requiresHumanIntervention);
  if (humanObj) {
    return {
      action: 'Assign a human counsellor',
      reason: `High sensitivity objection detected (${humanObj.category}): "${humanObj.supportingQuote.slice(0, 60)}..."`,
      preferredChannel: 'Phone Call',
      suggestedMessage: `Schedule a 1-on-1 counsellor consultation call to address ${humanObj.category} with verified evidence.`,
      recommendedDate: new Date(Date.now() + 3600000 * 4).toISOString(),
      requiresApproval: true
    };
  }

  // 5. Qualified -> Offer Demo
  if (lead.stage === 'Qualified' || lead.score >= 70) {
    return {
      action: 'Offer an available demo slot',
      reason: 'Candidate is qualified and has clear course interest; practical demo booking will convert interest into commitment.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: `Hi ${lead.name}! We have 2 available seats in our upcoming interactive coding demo session. Would you like us to reserve a free pass for you?`,
      recommendedDate: new Date(Date.now() + 3600000 * 6).toISOString(),
      requiresApproval: false
    };
  }

  // 6. Cold / Demanding impossible terms
  if (lead.stage === 'Not Interested' || lead.score < 35) {
    return {
      action: 'Mark the lead as not interested',
      reason: 'Lead expectations conflict with institutional ethics and course prerequisites.',
      preferredChannel: 'In-App',
      suggestedMessage: 'Archive lead record or stop automated outbound contact as requested.',
      recommendedDate: new Date().toISOString(),
      requiresApproval: true
    };
  }

  // 7. General AI Counselling
  return {
    action: 'Ask a relevant counselling question',
    reason: 'Deepen discovery of educational background, career goals, and time commitment.',
    preferredChannel: 'WhatsApp',
    suggestedMessage: `Hi ${lead.name}! To guide you towards the most suitable learning path, could you share what daily schedule works best for your study hours?`,
    recommendedDate: new Date(Date.now() + 3600000 * 8).toISOString(),
    requiresApproval: false
  };
}
