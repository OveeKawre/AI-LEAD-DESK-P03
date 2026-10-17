import React from 'react';
import { X, GitMerge, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Lead } from '../types';
import { db } from '../services/db';

interface DuplicateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onMergedSuccess: (primaryLead: Lead) => void;
}

export const DuplicateReviewModal: React.FC<DuplicateReviewModalProps> = ({
  isOpen,
  onClose,
  lead,
  onMergedSuccess
}) => {
  if (!isOpen || !lead.duplicateWarning) return null;

  const duplicateCandidate = db.getLeadById(lead.duplicateWarning.matchedLeadId);

  const handleMerge = () => {
    if (!duplicateCandidate) return;
    const merged = db.mergeLeads(lead.id, duplicateCandidate.id);
    if (merged) {
      onMergedSuccess(merged);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Unified Identity & Duplicate Review</h3>
              <p className="text-xs text-slate-400">Multi-channel cross-matching resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lead.duplicateWarning.matchReason} (Similarity: {lead.duplicateWarning.similarityScore}%)
            </span>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Primary Record (Current) */}
            <div className="p-4 rounded-xl border-2 border-teal-500/60 bg-teal-50/30 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-teal-200">
                <span className="font-bold text-teal-900 uppercase">Primary Lead (Preserved)</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-semibold">
                  #{lead.id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Normalized Phone</span>
                <span className="font-mono font-semibold text-slate-800">{lead.normalizedPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Enquiry Source</span>
                <span className="font-medium text-slate-700">{lead.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Stage & Score</span>
                <span className="font-medium text-slate-700">{lead.stage} ({lead.score}/100)</span>
              </div>
            </div>

            {/* Secondary Candidate to be Merged */}
            {duplicateCandidate ? (
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700 uppercase">Incoming Duplicate</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                    #{duplicateCandidate.id}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{duplicateCandidate.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Normalized Phone</span>
                  <span className="font-mono font-semibold text-slate-800">{duplicateCandidate.normalizedPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Enquiry Source</span>
                  <span className="font-medium text-slate-700">{duplicateCandidate.source}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Stage & Score</span>
                  <span className="font-medium text-slate-700">{duplicateCandidate.stage} ({duplicateCandidate.score}/100)</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 text-slate-400 text-xs flex items-center justify-center">
                Candidate record not found or already archived.
              </div>
            )}

          </div>

          {/* Merge Guarantee & Safety Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Unified Identity Audit Safeguards</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
              <li>All chat messages from both channels will be consolidated under primary lead #{lead.id}.</li>
              <li>Detected objections, notes, and timeline interactions are strictly preserved.</li>
              <li>A formal audit log entry will document the counsellor confirmation.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Keep Separate Records
            </button>
            <button
              onClick={handleMerge}
              className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-1.5"
            >
              <GitMerge className="w-4 h-4" />
              Authorise Unified Merge into #{lead.id}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
