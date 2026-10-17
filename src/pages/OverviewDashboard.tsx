import React from 'react';
import { 
  Users, 
  Flame, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight, 
  Phone, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Lead, FollowUpTask, Appointment, ObjectionCategory } from '../types';
import { db } from '../services/db';

interface OverviewDashboardProps {
  onSelectLead: (lead: Lead) => void;
  onNavigate: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onSelectLead,
  onNavigate
}) => {
  const leads = db.getLeads();
  const followUps = db.getFollowUps();
  const appointments = db.getAppointments();

  // Metrics
  const totalLeads = leads.length;
  const newEnquiries = leads.filter(l => l.stage === 'New').length;
  const hotLeads = leads.filter(l => l.temperature === 'Hot').length;
  const demosBooked = appointments.filter(a => a.status === 'Booked' || a.status === 'Completed').length;
  const recordedAdmissions = leads.filter(l => l.stage === 'Admission Confirmed').length;

  // Conversion Rate: Admissions / Total Qualified/Enquired Leads
  const conversionRate = totalLeads > 0 ? ((recordedAdmissions / totalLeads) * 100).toFixed(1) : '0';

  // Overdue follow-ups
  const now = new Date();
  const pendingTasks = followUps.filter(t => t.status === 'Pending');
  const overdueTasks = pendingTasks.filter(t => new Date(t.dueDate) < now);

  // Pipeline stages count
  const pipelineStages = [
    'New',
    'AI Counselling',
    'Qualified',
    'Demo Booked',
    'Demo Completed',
    'Follow-up Required',
    'Admission Confirmed',
    'Not Interested'
  ];

  const stageCounts = pipelineStages.map(stage => ({
    stage,
    count: leads.filter(l => l.stage === stage).length
  }));

  // Leads by source
  const sources = ['WhatsApp', 'Instagram', 'Website', 'Phone Call', 'Walk-in', 'Referral'];
  const sourceCounts = sources.map(src => ({
    source: src,
    count: leads.filter(l => l.source === src).length
  }));

  // Objections breakdown
  const objectionMap: Record<string, number> = {};
  leads.forEach(l => {
    l.detectedObjections.forEach(obj => {
      objectionMap[obj.category] = (objectionMap[obj.category] || 0) + 1;
    });
  });

  const topObjections = Object.entries(objectionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & KPI Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-navy-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded-full">
              Admissions Control Tower
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Admissions Operations Overview</h1>
          <p className="text-xs text-slate-300 mt-1">Real-time pipeline tracking, multilingual student engagement, and next-best actions.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('counsellor')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-bold shadow-lg shadow-teal-500/20 transition"
          >
            <Sparkles className="w-4 h-4 text-navy-900" />
            Launch AI Counsellor
          </button>
          <button
            onClick={() => onNavigate('appointments')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white border border-navy-600 text-xs font-bold transition"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            Demo Slots
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Leads */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalLeads}</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-1">Centrally Stored</div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">New Enquiries</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{newEnquiries}</div>
          <div className="text-[10px] text-sky-700 font-semibold mt-1">Awaiting AI Intake</div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hot Leads</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{hotLeads}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-1">Score 70-100</div>
        </div>

        {/* Follow-ups Due */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Follow-ups Due</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingTasks.length}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-1">
            {overdueTasks.length} Overdue
          </div>
        </div>

        {/* Demo Classes Booked */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Demos Booked</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700">{demosBooked}</div>
          <div className="text-[10px] text-teal-800 font-semibold mt-1">Conflict-free Slots</div>
        </div>

        {/* Confirmed Admissions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Admissions</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{recordedAdmissions}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
            {conversionRate}% Conversion
          </div>
        </div>

      </div>

      {/* Main Grid: Pipeline Funnel & Source Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Distribution (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Admissions Pipeline Stage Distribution</h2>
              <p className="text-xs text-slate-500">Live student stage transitions from stored records</p>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View Leads <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {stageCounts.map(item => {
              const pct = totalLeads > 0 ? ((item.count / totalLeads) * 100).toFixed(0) : 0;
              const color = item.stage === 'Admission Confirmed' ? 'bg-emerald-500' :
                            item.stage === 'Demo Booked' || item.stage === 'Demo Completed' ? 'bg-teal-500' :
                            item.stage === 'Qualified' ? 'bg-sky-500' :
                            item.stage === 'Not Interested' ? 'bg-slate-300' : 'bg-navy-800';
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{item.stage}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Source Breakdown (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Leads by Channel Source</h2>
              <p className="text-xs text-slate-500">Omnichannel enquiry attribution</p>
            </div>
          </div>

          <div className="space-y-3">
            {sourceCounts.map(item => {
              const pct = totalLeads > 0 ? ((item.count / totalLeads) * 100).toFixed(0) : 0;
              return (
                <div key={item.source} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-800">{item.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-700">{item.count}</span>
                    <span className="text-[10px] text-slate-400">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attribution Note */}
          <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            <strong>Attribution Rule:</strong> First touch source preserved with cross-channel identity link.
          </div>
        </div>

      </div>

      {/* Lower Row: Hot Leads & Objections & Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Hot Leads with Recommended Actions */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">High Priority Leads & Recommended Actions</h2>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              See all {leads.length} leads
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map(lead => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50/70 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{lead.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      Score: {lead.score}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{lead.normalizedPhone}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{lead.summary}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Course: <strong>{lead.courseInterest || 'General'}</strong></span>
                    <span>•</span>
                    <span>Lang: <strong>{lead.preferredLanguage}</strong></span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded block mb-1">
                    {lead.suggestedNextAction.action}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Channel: {lead.suggestedNextAction.preferredChannel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Objections Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Most Common Student Objections</h2>
          </div>

          <div className="space-y-2.5">
            {topObjections.length === 0 ? (
              <p className="text-xs text-slate-400">No objections detected yet.</p>
            ) : (
              topObjections.map(([category, count]) => (
                <div key={category} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">{category}</span>
                    <span className="text-[10px] text-slate-400 block">AI Resolution Strategy Configured</span>
                  </div>
                  <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-xs">
                    {count} {count === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Counsellor Takeover Quick Link */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('followups')}
              className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              Manage Counsellor Follow-up Tasks ({pendingTasks.length})
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
