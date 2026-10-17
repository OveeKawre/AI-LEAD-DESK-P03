import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Flame, 
  Phone, 
  Mail, 
  Calendar, 
  GitMerge, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  UserCheck, 
  Sparkles,
  Download,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { Lead, PipelineStage, LeadTemperature, LeadSource } from '../types';
import { db } from '../services/db';
import { normalizeIndianPhoneNumber, detectDuplicateLead } from '../services/identity';
import { calculateLeadScore, determineNextBestAction } from '../services/scoring';

interface LeadsPageProps {
  onSelectLead: (lead: Lead) => void;
  onOpenDuplicateReview: (lead: Lead) => void;
}

export const LeadsPage: React.FC<LeadsPageProps> = ({
  onSelectLead,
  onOpenDuplicateReview
}) => {
  const [leads, setLeads] = useState<Lead[]>(db.getLeads());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedTemperature, setSelectedTemperature] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredLanguage: 'English' as Lead['preferredLanguage'],
    educationBackground: '',
    careerGoal: '',
    courseInterest: 'Full Stack Web Development (MERN & Cloud)',
    preferredSchedule: 'Weekday Evening: 6:30 PM - 9:00 PM' as Lead['preferredSchedule'],
    source: 'Website' as LeadSource
  });

  const [formDuplicateNotice, setFormDuplicateNotice] = useState<string | null>(null);

  const refreshLeads = () => {
    setLeads(db.getLeads());
  };

  // Filter & Search Logic
  const filteredLeads = leads.filter(lead => {
    if (lead.isArchived) return false;

    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.normalizedPhone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.courseInterest && lead.courseInterest.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'All' || lead.stage === selectedStage;
    const matchesTemp = selectedTemperature === 'All' || lead.temperature === selectedTemperature;
    const matchesSource = selectedSource === 'All' || lead.source === selectedSource;

    return matchesSearch && matchesStage && matchesTemp && matchesSource;
  });

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Quick Duplicate Check in Form
  const handlePhoneChange = (val: string) => {
    setNewLeadForm(prev => ({ ...prev, phone: val }));
    if (val.length >= 8) {
      const dup = detectDuplicateLead({ phone: val, name: newLeadForm.name, courseInterest: newLeadForm.courseInterest }, leads);
      if (dup.isDuplicate && dup.matchedLead) {
        setFormDuplicateNotice(`Match alert: ${dup.reason}`);
      } else {
        setFormDuplicateNotice(null);
      }
    } else {
      setFormDuplicateNotice(null);
    }
  };

  // Create New Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    const norm = normalizeIndianPhoneNumber(newLeadForm.phone);
    const existingCheck = detectDuplicateLead({ phone: newLeadForm.phone, email: newLeadForm.email, name: newLeadForm.name, courseInterest: newLeadForm.courseInterest }, leads);

    const partialLead: Partial<Lead> = {
      courseInterest: newLeadForm.courseInterest,
      careerGoal: newLeadForm.careerGoal,
      educationBackground: newLeadForm.educationBackground,
      preferredSchedule: newLeadForm.preferredSchedule,
      communicationConsent: true,
      stage: 'New'
    };

    const scoreResult = calculateLeadScore(partialLead, []);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadForm.name,
      rawPhone: newLeadForm.phone,
      normalizedPhone: norm.normalized,
      email: newLeadForm.email,
      preferredLanguage: newLeadForm.preferredLanguage,
      educationBackground: newLeadForm.educationBackground || 'Graduate',
      careerGoal: newLeadForm.careerGoal || 'Software Engineer',
      courseInterest: newLeadForm.courseInterest,
      preferredSchedule: newLeadForm.preferredSchedule,
      source: newLeadForm.source,
      stage: 'New',
      score: scoreResult.score,
      temperature: scoreResult.temperature,
      scoreBreakdown: scoreResult.breakdown,
      detectedObjections: [],
      summary: `${newLeadForm.name} submitted fresh enquiry for ${newLeadForm.courseInterest} via ${newLeadForm.source}. Seeking batch details.`,
      lastInteraction: new Date().toISOString(),
      suggestedNextAction: {
        action: 'Ask a relevant counselling question',
        reason: 'New enquiry; begin discovery of educational background and career expectations.',
        preferredChannel: newLeadForm.source === 'WhatsApp' ? 'WhatsApp' : 'Phone Call',
        suggestedMessage: `Hi ${newLeadForm.name}! Thanks for reaching out regarding our ${newLeadForm.courseInterest}. Would you like to connect with a mentor today?`,
        recommendedDate: new Date().toISOString(),
        requiresApproval: false
      },
      followUpDueDate: new Date(Date.now() + 86400000).toISOString(),
      assignedCounsellor: 'Priya Joshi',
      communicationConsent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      duplicateWarning: existingCheck.isDuplicate && existingCheck.matchedLead ? {
        matchedLeadId: existingCheck.matchedLead.id,
        matchedLeadName: existingCheck.matchedLead.name,
        matchReason: existingCheck.reason || 'Phone match',
        similarityScore: existingCheck.confidence
      } : undefined
    };

    db.saveLead(newLead);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      preferredLanguage: 'English',
      educationBackground: '',
      careerGoal: '',
      courseInterest: 'Full Stack Web Development (MERN & Cloud)',
      preferredSchedule: 'Weekday Evening: 6:30 PM - 9:00 PM',
      source: 'Website'
    });
    setFormDuplicateNotice(null);
    refreshLeads();
    onSelectLead(newLead);
  };

  const getTemperatureBadge = (temp: LeadTemperature, score: number) => {
    if (temp === 'Hot') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-600" /> Hot ({score})
        </span>
      );
    }
    if (temp === 'Warm') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          Warm ({score})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
        Cold ({score})
      </span>
    );
  };

  return (
    <div className="space-y-5">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Central Lead Management Desk</h1>
          <p className="text-xs text-slate-500">Search, filter, assign counsellors, and track explainable lead scores.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Enquiry
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, course..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => {
              setSelectedStage(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="AI Counselling">AI Counselling</option>
            <option value="Qualified">Qualified</option>
            <option value="Demo Booked">Demo Booked</option>
            <option value="Demo Completed">Demo Completed</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Admission Confirmed">Admission Confirmed</option>
            <option value="Not Interested">Not Interested</option>
          </select>

          {/* Temperature Filter */}
          <select
            value={selectedTemperature}
            onChange={(e) => {
              setSelectedTemperature(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Scores</option>
            <option value="Hot">Hot (70-100)</option>
            <option value="Warm">Warm (40-69)</option>
            <option value="Cold">Cold (0-39)</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Channels</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="Website">Website</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Referral">Referral</option>
          </select>

          <span className="text-xs text-slate-400 font-medium ml-2">
            Showing {filteredLeads.length} leads
          </span>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th scope="col" className="px-4 py-3.5">Student Lead</th>
                <th scope="col" className="px-4 py-3.5">Score / Temp</th>
                <th scope="col" className="px-4 py-3.5">Course Interest</th>
                <th scope="col" className="px-4 py-3.5">Pipeline Stage</th>
                <th scope="col" className="px-4 py-3.5">Source & Lang</th>
                <th scope="col" className="px-4 py-3.5">Next Recommended Action</th>
                <th scope="col" className="px-4 py-3.5">Counsellor</th>
                <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No leads matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-teal-50/40 transition cursor-pointer"
                    onClick={() => onSelectLead(lead)}
                  >
                    
                    {/* Student Identity */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                            {lead.duplicateWarning && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDuplicateReview(lead);
                                }}
                                title="Duplicate detected - click to review and merge"
                                className="p-0.5 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                              >
                                <GitMerge className="w-3.5 h-3.5 text-amber-600" />
                              </button>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {lead.normalizedPhone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Score / Temperature */}
                    <td className="px-4 py-3.5">
                      {getTemperatureBadge(lead.temperature, lead.score)}
                    </td>

                    {/* Course Interest */}
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-800 line-clamp-1 max-w-[180px]">
                        {lead.courseInterest || 'General Enquiry'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{lead.educationBackground}</span>
                    </td>

                    {/* Pipeline Stage */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        lead.stage === 'Admission Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        lead.stage === 'Demo Booked' || lead.stage === 'Demo Completed' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                        lead.stage === 'Qualified' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        lead.stage === 'Not Interested' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                        'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {lead.stage}
                      </span>
                    </td>

                    {/* Source & Language */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-700 block">{lead.source}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {lead.preferredLanguage}
                        </span>
                      </div>
                    </td>

                    {/* Next Action */}
                    <td className="px-4 py-3.5">
                      <div className="max-w-[200px]">
                        <span className="font-semibold text-teal-800 block text-[11px] line-clamp-1">
                          {lead.suggestedNextAction.action}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Channel: {lead.suggestedNextAction.preferredChannel}
                        </span>
                      </div>
                    </td>

                    {/* Counsellor */}
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {lead.assignedCounsellor}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-semibold transition"
                      >
                        Inspect
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add New Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-navy-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Student Enquiry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Kulkarni"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09823412345"
                    value={newLeadForm.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Duplicate alert if triggered */}
              {formDuplicateNotice && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{formDuplicateNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Language</label>
                  <select
                    value={newLeadForm.preferredLanguage}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredLanguage: e.target.value as any })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Mixed/Hinglish">Mixed / Hinglish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enquiry Channel</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as any })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Website">Website</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Interest</label>
                <select
                  value={newLeadForm.courseInterest}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, courseInterest: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="Full Stack Web Development (MERN & Cloud)">Full Stack Web Development (MERN & Cloud)</option>
                  <option value="Data Science & AI Engineering with Python">Data Science & AI Engineering with Python</option>
                  <option value="Cloud Computing & DevOps Masterclass (AWS & Docker)">Cloud Computing & DevOps Masterclass</option>
                  <option value="UI/UX Product Design & Frontend Fundamentals">UI/UX Product Design & Frontend Fundamentals</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  Save & Launch Counselling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
