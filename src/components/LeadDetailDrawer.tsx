import React, { useState } from 'react';
import { 
  X, 
  Send, 
  UserCheck, 
  Bot, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Copy,
  Check,
  Phone,
  Mail,
  BookOpen,
  MessageSquareText,
  Lock
} from 'lucide-react';
import { Lead, ConversationMessage, Conversation } from '../types';
import { db } from '../services/db';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onLeadUpdated: (lead: Lead) => void;
  onOpenDemoBooking: (lead: Lead) => void;
  onOpenAptitude: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onLeadUpdated,
  onOpenDemoBooking,
  onOpenAptitude
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'conversation' | 'objections' | 'score' | 'history'>('overview');
  const [counsellorReply, setCounsellorReply] = useState('');
  const [takeoverReason, setTakeoverReason] = useState('Personalized counsellor follow-up');
  const [isCopied, setIsCopied] = useState(false);

  if (!lead) return null;

  const messages = db.getMessagesForLead(lead.id);
  const conversations = db.getConversations();
  const currentConv = conversations.find(c => c.leadId === lead.id);
  const isHumanTakeover = currentConv?.status === 'human_takeover';
  const currentUser = db.getCurrentUser();

  const handleTakeover = () => {
    db.takeOverConversation(lead.id, currentUser.name, takeoverReason);
    onLeadUpdated(db.getLeadById(lead.id)!);
  };

  const handleResumeAi = () => {
    db.resumeAiConversation(lead.id, currentUser.name);
    onLeadUpdated(db.getLeadById(lead.id)!);
  };

  const handleSendCounsellorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counsellorReply.trim()) return;

    const newMessage: ConversationMessage = {
      id: `m-couns-${Date.now()}`,
      conversationId: `conv-${lead.id}`,
      leadId: lead.id,
      sender: 'counsellor',
      content: counsellorReply.trim(),
      language: lead.preferredLanguage === 'Marathi' ? 'Marathi' : lead.preferredLanguage === 'Hindi' ? 'Hindi' : 'English',
      timestamp: new Date().toISOString()
    };

    db.addMessage(lead.id, newMessage);
    setCounsellorReply('');
    onLeadUpdated(db.getLeadById(lead.id)!);
  };

  const copySuggestedMessage = () => {
    navigator.clipboard.writeText(lead.suggestedNextAction.suggestedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const tempBadge = {
    Hot: 'bg-rose-100 text-rose-800 border-rose-200',
    Warm: 'bg-amber-100 text-amber-800 border-amber-200',
    Cold: 'bg-slate-100 text-slate-700 border-slate-200'
  }[lead.temperature];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Top Header */}
          <div className="bg-navy-900 text-white p-5 border-b border-navy-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-white tracking-tight">{lead.name}</h2>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${tempBadge}`}>
                    {lead.temperature} ({lead.score}/100)
                  </span>
                  <span className="text-[10px] bg-navy-800 border border-navy-700 text-slate-300 px-2 py-0.5 rounded">
                    {lead.stage}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Phone className="w-3 h-3 text-teal-400" />
                    {lead.normalizedPhone}
                  </span>
                  {lead.email && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Mail className="w-3 h-3 text-teal-400" />
                      {lead.email}
                    </span>
                  )}
                  <span className="bg-teal-950 text-teal-300 border border-teal-800/40 px-1.5 py-0.2 rounded text-[10px]">
                    {lead.source}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Pills */}
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-navy-800/60">
              <button
                onClick={() => onOpenDemoBooking(lead)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Demo Slot
              </button>

              <button
                onClick={() => onOpenAptitude(lead)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-semibold transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                Launch Aptitude Test
              </button>

              {isHumanTakeover ? (
                <button
                  onClick={handleResumeAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 text-xs font-semibold hover:bg-emerald-800/60 transition ml-auto"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Resume AI Auto-Reply
                </button>
              ) : (
                <button
                  onClick={handleTakeover}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition ml-auto"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  Take Over Conversation
                </button>
              )}
            </div>

            {/* Status indicator bar for takeover */}
            {isHumanTakeover && (
              <div className="mt-3 p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Counsellor Takeover Active: <strong>{currentConv?.takenOverBy || 'Human Counsellor'}</strong> (AI auto-replies paused)
                </span>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-4 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition ${
                activeTab === 'overview' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Overview & Next Action
            </button>
            <button
              onClick={() => setActiveTab('conversation')}
              className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'conversation' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Conversation History
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full">
                {messages.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('objections')}
              className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'objections' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Objections
              {lead.detectedObjections.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {lead.detectedObjections.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('score')}
              className={`py-3 border-b-2 transition ${
                activeTab === 'score' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Score Breakdown
            </button>
          </div>

          {/* Drawer Body Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 3-Line Summary Card */}
                <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                    <MessageSquareText className="w-4 h-4 text-teal-600" />
                    <span>Three-Line AI Executive Summary</span>
                  </div>
                  <p className="text-sm text-teal-950 font-medium leading-relaxed">
                    {lead.summary}
                  </p>
                </div>

                {/* Suggested Next Best Action */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Best Action Recommended</span>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      Via {lead.suggestedNextAction.preferredChannel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {lead.suggestedNextAction.action}
                  </h3>

                  <p className="text-xs text-slate-600">
                    <strong>Reasoning:</strong> {lead.suggestedNextAction.reason}
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 relative">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Suggested Message Template:</span>
                    <p className="text-xs text-slate-800 italic pr-8">
                      "{lead.suggestedNextAction.suggestedMessage}"
                    </p>
                    <button
                      onClick={copySuggestedMessage}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                      title="Copy to clipboard"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Candidate Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium block">Education</span>
                    <span className="font-bold text-slate-800 text-sm">{lead.educationBackground}</span>
                    {lead.studyGapYears ? (
                      <span className="text-amber-700 font-semibold block text-[11px] mt-0.5">
                        {lead.studyGapYears}-Year Study Gap
                      </span>
                    ) : null}
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium block">Course Interest</span>
                    <span className="font-bold text-slate-800 text-sm">{lead.courseInterest || 'General Enquiry'}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium block">Preferred Language</span>
                    <span className="font-bold text-slate-800">{lead.preferredLanguage}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium block">Preferred Schedule</span>
                    <span className="font-bold text-slate-800">{lead.preferredSchedule || 'Not specified'}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium block">Budget Range</span>
                    <span className="font-bold text-slate-800">{lead.budgetRange || 'Volunteered in chat'}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium block">Assigned Counsellor</span>
                    <span className="font-bold text-slate-800">{lead.assignedCounsellor}</span>
                  </div>
                </div>

                {/* Duplicate Lead Warning Alert */}
                {lead.duplicateWarning && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Duplicate Lead Match Detected ({lead.duplicateWarning.similarityScore}% match)</span>
                    </div>
                    <p>{lead.duplicateWarning.matchReason}</p>
                    <p className="text-slate-600">
                      Matched candidate: <strong>{lead.duplicateWarning.matchedLeadName} (#{lead.duplicateWarning.matchedLeadId})</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CONVERSATION HISTORY */}
            {activeTab === 'conversation' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b">
                  <span>Multilingual Thread ({lead.preferredLanguage})</span>
                  <span>Channel: {lead.source}</span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                  {messages.map((m) => {
                    const isStudent = m.sender === 'student';
                    const isSystem = m.sender === 'system';
                    const isCounsellor = m.sender === 'counsellor';

                    if (isSystem) {
                      return (
                        <div key={m.id} className="text-center my-3">
                          <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full font-medium">
                            {m.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-600">
                            {isStudent ? lead.name : isCounsellor ? 'Admissions Counsellor' : 'AI Counsellor'}
                          </span>
                          <span>•</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-normal leading-relaxed ${
                            isStudent
                              ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                              : isCounsellor
                              ? 'bg-amber-600 text-white rounded-tr-sm shadow-sm'
                              : 'bg-navy-900 text-white rounded-tr-sm shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.content}</p>
                          {m.metadata?.verifiedFactsUsed && (
                            <div className="mt-2 pt-2 border-t border-navy-800 text-[10px] text-teal-300">
                              <span className="font-semibold">Authoritative Knowledge Base Facts Used: </span>
                              {m.metadata.verifiedFactsUsed.join('; ')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Counsellor Reply Input Area */}
                <form onSubmit={handleSendCounsellorMessage} className="pt-3 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isHumanTakeover ? "Reply to student as human counsellor..." : "Takeover required to send counsellor message..."}
                      value={counsellorReply}
                      onChange={(e) => setCounsellorReply(e.target.value)}
                      disabled={!isHumanTakeover}
                      className="flex-1 text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100"
                    />
                    <button
                      type="submit"
                      disabled={!isHumanTakeover || !counsellorReply.trim()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </button>
                  </div>
                  {!isHumanTakeover && (
                    <p className="text-[11px] text-amber-700 mt-1.5">
                      Click <strong>"Take Over Conversation"</strong> above to pause AI replies and chat directly.
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* TAB 3: OBJECTIONS */}
            {activeTab === 'objections' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b">
                  <span>Detected Objections with Supporting Evidence ({lead.detectedObjections.length})</span>
                </div>

                {lead.detectedObjections.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    <CheckCircle className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No Objections Detected</p>
                    <p className="text-[11px] text-slate-400">Student is progressing smoothly without major concerns expressed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lead.detectedObjections.map((obj) => (
                      <div key={obj.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            {obj.category}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Confidence: {obj.confidence}%
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 italic">
                          "{obj.supportingQuote}"
                        </div>

                        <div className="text-xs text-slate-700 pt-1">
                          <span className="font-bold text-teal-800">Suggested Resolution Strategy: </span>
                          <span>{obj.suggestedResponse}</span>
                        </div>

                        {obj.requiresHumanIntervention && (
                          <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5 pt-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Requires Human Counsellor Consultation</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SCORE EXPLANATION */}
            {activeTab === 'score' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block uppercase">Explainable Lead Score</span>
                    <span className="text-3xl font-black text-slate-900">{lead.score} / 100</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tempBadge}`}>
                    {lead.temperature} Lead
                  </span>
                </div>

                {/* Breakdown by 5 Configurable Dimensions */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Score Breakdown Matrix</span>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Course Interest (Max 25)</span>
                      <span className="font-bold text-teal-700">{lead.scoreBreakdown.courseInterest} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(lead.scoreBreakdown.courseInterest / 25) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Engagement & Dialogue (Max 20)</span>
                      <span className="font-bold text-teal-700">{lead.scoreBreakdown.engagement} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(lead.scoreBreakdown.engagement / 20) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Eligibility Alignment (Max 20)</span>
                      <span className="font-bold text-teal-700">{lead.scoreBreakdown.eligibilityAlignment} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(lead.scoreBreakdown.eligibilityAlignment / 20) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Demo Intent & Action (Max 20)</span>
                      <span className="font-bold text-teal-700">{lead.scoreBreakdown.demoIntent} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(lead.scoreBreakdown.demoIntent / 20) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Follow-up Responsiveness (Max 15)</span>
                      <span className="font-bold text-teal-700">{lead.scoreBreakdown.responsiveness} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(lead.scoreBreakdown.responsiveness / 15) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Score Reasons */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">Itemized Scoring Factors</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {lead.scoreBreakdown.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
