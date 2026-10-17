import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Bot, 
  User, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Flame, 
  MessageSquare,
  Globe2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { Lead, Course, ConversationMessage } from '../types';
import { db } from '../services/db';
import { processAiCounsellingMessage, detectLanguage } from '../services/ai';
import { voiceService, SupportedVoiceLanguage } from '../services/voice';

interface AiCounsellorProps {
  currentLead: Lead;
  onOpenDemoBooking: (lead: Lead) => void;
  onOpenAptitude: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
}

export const AiCounsellor: React.FC<AiCounsellorProps> = ({
  currentLead,
  onOpenDemoBooking,
  onOpenAptitude,
  onLeadUpdated
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>(db.getMessagesForLead(currentLead.id));
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLead.preferredLanguage);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<SupportedVoiceLanguage>('en-IN');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const verifiedCourses = db.getVerifiedCourses();

  useEffect(() => {
    setMessages(db.getMessagesForLead(currentLead.id));
    setSelectedLanguage(currentLead.preferredLanguage);
  }, [currentLead.id, currentLead.preferredLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Voice Recognition Handler
  const toggleVoiceRecording = () => {
    if (isRecording) {
      voiceService.stopListening();
      setIsRecording(false);
    } else {
      setVoiceNotice(null);
      const started = voiceService.startListening(
        voiceLanguage,
        (res) => {
          setInputMessage(res.transcript);
        },
        (err) => {
          setVoiceNotice(err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
      if (started) {
        setIsRecording(true);
      }
    }
  };

  // Submit message to AI Counsellor
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isProcessing) return;

    if (isRecording) {
      voiceService.stopListening();
      setIsRecording(false);
    }

    // 1. Add student message
    const studentMsg: ConversationMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${currentLead.id}`,
      leadId: currentLead.id,
      sender: 'student',
      content: text,
      language: detectLanguage(text),
      timestamp: new Date().toISOString()
    };

    db.addMessage(currentLead.id, studentMsg);
    setMessages(prev => [...prev, studentMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // 2. Process via AI Counsellor Engine (Gemini API or Verified Knowledge Base RAG)
      const aiResponse = await processAiCounsellingMessage(text, currentLead, [...messages, studentMsg]);

      // 3. Add AI Message
      const aiMsg: ConversationMessage = {
        id: `msg-ai-${Date.now()}`,
        conversationId: `conv-${currentLead.id}`,
        leadId: currentLead.id,
        sender: 'ai',
        content: aiResponse.messageText,
        language: aiResponse.detectedLanguage,
        timestamp: new Date().toISOString(),
        metadata: {
          verifiedFactsUsed: aiResponse.verifiedFactsUsed,
          courseId: aiResponse.recommendedCourse?.id
        }
      };

      db.addMessage(currentLead.id, aiMsg);
      setMessages(prev => [...prev, aiMsg]);

      // 4. Update Lead record with new objections and summary
      const updatedLead = { ...currentLead };
      if (aiResponse.detectedObjections.length > 0) {
        aiResponse.detectedObjections.forEach(obj => {
          if (!updatedLead.detectedObjections.some(o => o.category === obj.category)) {
            updatedLead.detectedObjections.push({
              id: `obj-${Date.now()}-${obj.category}`,
              category: obj.category,
              supportingQuote: obj.quote,
              confidence: obj.confidence,
              suggestedResponse: obj.suggestedResponse,
              requiresHumanIntervention: obj.requiresHuman,
              detectedAt: new Date().toISOString()
            });
          }
        });
      }

      if (aiResponse.updatedSummary) {
        updatedLead.summary = aiResponse.updatedSummary;
      }

      // Update lead score
      updatedLead.score = Math.min(100, updatedLead.score + 3);
      updatedLead.temperature = updatedLead.score >= 70 ? 'Hot' : 'Warm';
      db.saveLead(updatedLead);
      onLeadUpdated(updatedLead);

    } catch (e) {
      console.error('Failed to process counselling response:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Preset hackathon demonstration test prompts
  const samplePrompts = [
    {
      label: 'Commerce Graduate with 2-year Gap',
      text: 'I am a commerce graduate with a two-year gap. Can I become a developer? Mujhe coding ka koi experience nahi hai.'
    },
    {
      label: 'मराठी चौकशी (Marathi Query)',
      text: 'मला coding शिकायचं आहे, but I have no programming experience. मला मराठीत समजून सांगाल का?'
    },
    {
      label: 'Test Stamp Paper Job Guarantee',
      text: 'Will you give me 100% job guarantee on stamp paper with ₹10 LPA salary?'
    },
    {
      label: 'Test Unauthorised 50% Discount',
      text: 'Can I get 50% discount on the course fees? Otherwise it is too expensive.'
    },
    {
      label: 'Enquire Weekend Schedule for Working Professional',
      text: 'I am working on weekdays. Do you have a weekend batch for Data Science & AI?'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Left Column: Student Context & Verified Facts Card (1 Col) */}
      <div className="hidden lg:flex flex-col space-y-4 overflow-y-auto pr-1">
        
        {/* Student Profile Snapshot */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Student Profile</span>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
              {currentLead.stage}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{currentLead.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{currentLead.normalizedPhone}</p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Background:</span>
              <span className="font-semibold text-slate-800">{currentLead.educationBackground}</span>
            </div>
            {currentLead.studyGapYears ? (
              <div className="flex justify-between">
                <span className="text-slate-400">Study Gap:</span>
                <span className="font-semibold text-amber-700">{currentLead.studyGapYears} Years</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-slate-400">Target Track:</span>
              <span className="font-semibold text-teal-800 text-right truncate max-w-[130px]">{currentLead.courseInterest}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lead Score:</span>
              <span className="font-bold text-teal-700">{currentLead.score}/100 ({currentLead.temperature})</span>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => onOpenAptitude(currentLead)}
              className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Award className="w-4 h-4 text-teal-600" />
              Launch Adaptive Aptitude Test
            </button>

            <button
              onClick={() => onOpenDemoBooking(currentLead)}
              className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              Book Live Demo Slot
            </button>
          </div>
        </div>

        {/* Verified Knowledge Base Safety Shield */}
        <div className="bg-gradient-to-br from-teal-900 to-navy-900 text-white p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>AI Safety & Verified Facts Grounding</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All AI responses strictly retrieved from verified academic director records. Zero hallucinations on fees, discounts, or placement guarantees.
          </p>
          <div className="text-[10px] text-teal-300 font-semibold pt-1">
            ✓ Audited 2025-26 Placement Records Grounded
          </div>
        </div>

        {/* Verified Course Catalog Cards */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Authoritative Programs</span>
          {verifiedCourses.map(c => (
            <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 leading-tight">{c.name}</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                  ₹{c.fees.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Duration: {c.duration} | Mode: {c.deliveryMode}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Main Chat Interface (3 Cols) */}
      <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-navy-900 text-white p-4 px-6 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-navy-950 font-bold shadow-md shadow-teal-500/20">
                <Bot className="w-6 h-6 text-navy-950" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-navy-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">AI Admissions Counsellor</h3>
                <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  Multilingual RAG Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Guiding {currentLead.name} • Empathetic Career Counselling</p>
            </div>
          </div>

          {/* Language Indicator */}
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="text-xs font-semibold rounded-lg bg-navy-800 border border-navy-700 text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Mixed/Hinglish">Mixed / Hinglish</option>
            </select>
          </div>
        </div>

        {/* Preset Sample Prompts Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 px-4 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Test Prompts:
          </span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sp.text)}
              className="text-xs font-medium bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 hover:border-teal-300 px-3 py-1 rounded-full shrink-0 transition shadow-2xs"
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isStudent = m.sender === 'student';
            const isSystem = m.sender === 'system';

            if (isSystem) {
              return (
                <div key={m.id} className="text-center my-2">
                  <span className="text-[11px] bg-slate-200/80 text-slate-700 px-3 py-1 rounded-full font-medium">
                    {m.content}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-bold ${
                  isStudent ? 'bg-navy-800 text-white' : 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                }`}>
                  {isStudent ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl p-4 text-xs font-normal leading-relaxed shadow-sm ${
                  isStudent
                    ? 'bg-navy-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap font-sans">{m.content}</p>

                  {/* Grounded facts badge */}
                  {m.metadata?.verifiedFactsUsed && m.metadata.verifiedFactsUsed.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-teal-800 bg-teal-50/60 p-2 rounded-lg">
                      <span className="font-bold flex items-center gap-1 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        Authoritative Knowledge Base Facts Checked:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {m.metadata.verifiedFactsUsed.slice(0, 3).map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end mt-1.5 text-[10px] text-slate-400">
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isProcessing && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-500 ml-1">Verifying knowledge base facts & counselling...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Notice if Mic denied */}
        {voiceNotice && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex items-center justify-between">
            <span>{voiceNotice}</span>
            <button onClick={() => setVoiceNotice(null)} className="text-amber-600 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Chat Input Bar with Speech Recognition & Language Selector */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Language Selector */}
            <select
              value={voiceLanguage}
              onChange={(e) => setVoiceLanguage(e.target.value as SupportedVoiceLanguage)}
              className="text-[11px] font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 text-slate-700 hidden sm:block focus:outline-none"
              title="Speech-to-text recognition language"
            >
              <option value="en-IN">Voice: English (IN)</option>
              <option value="hi-IN">Voice: हिन्दी (Hindi)</option>
              <option value="mr-IN">Voice: मराठी (Marathi)</option>
            </select>

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-3 rounded-xl transition ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isRecording ? "Stop voice listening" : "Click to speak voice note (English, Hindi, Marathi)"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={isRecording ? "Listening to your voice note... speak now" : "Ask about courses, career switch, study gaps, fees, demo classes..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-slate-300 p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Powered by Gemini & Verified Knowledge Base RAG</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>English • हिन्दी • मराठी Natural Code-Switching</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
