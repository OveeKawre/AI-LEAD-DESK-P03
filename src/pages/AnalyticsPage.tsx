import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Flame, 
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';
import { db } from '../services/db';

export const AnalyticsPage: React.FC = () => {
  const leads = db.getLeads();
  const appointments = db.getAppointments();
  const followUps = db.getFollowUps();
  const staff = db.getStaff();

  // Metrics Calculations
  const totalLeads = leads.length;
  const bookedDemos = appointments.filter(a => a.status === 'Booked' || a.status === 'Completed').length;
  const confirmedAdmissions = leads.filter(l => l.stage === 'Admission Confirmed').length;
  const completedTasks = followUps.filter(t => t.status === 'Completed').length;
  const totalTasks = followUps.length;

  const demoBookingRate = totalLeads > 0 ? ((bookedDemos / totalLeads) * 100).toFixed(1) : '0';
  const admissionRate = totalLeads > 0 ? ((confirmedAdmissions / totalLeads) * 100).toFixed(1) : '0';
  const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0';

  const avgLeadScore = totalLeads > 0 
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / totalLeads) 
    : 0;

  // Source Attribution
  const sources = ['WhatsApp', 'Instagram', 'Website', 'Phone Call', 'Walk-in', 'Referral'];
  const sourceStats = sources.map(src => {
    const srcLeads = leads.filter(l => l.source === src);
    const admits = srcLeads.filter(l => l.stage === 'Admission Confirmed').length;
    return {
      source: src,
      count: srcLeads.length,
      admits,
      conversionPct: srcLeads.length > 0 ? ((admits / srcLeads.length) * 100).toFixed(1) : '0'
    };
  }).sort((a, b) => b.count - a.count);

  // Leads by Course
  const courseMap: Record<string, number> = {};
  leads.forEach(l => {
    const cName = l.courseInterest || 'Unspecified';
    courseMap[cName] = (courseMap[cName] || 0) + 1;
  });
  const courseStats = Object.entries(courseMap).sort((a, b) => b[1] - a[1]);

  // Counsellor Performance
  const counsellors = staff.filter(s => s.role === 'Admissions Counsellor');
  const counsellorStats = counsellors.map(c => {
    const assigned = leads.filter(l => l.assignedCounsellor === c.name);
    const converted = assigned.filter(l => l.stage === 'Admission Confirmed').length;
    const tasks = followUps.filter(t => t.assignedTo === c.name);
    const doneTasks = tasks.filter(t => t.status === 'Completed').length;
    return {
      name: c.name,
      assignedCount: assigned.length,
      convertedCount: converted,
      tasksTotal: tasks.length,
      tasksCompleted: doneTasks
    };
  });

  // Score Bracket Distribution
  const coldCount = leads.filter(l => l.temperature === 'Cold').length;
  const warmCount = leads.filter(l => l.temperature === 'Warm').length;
  const hotCount = leads.filter(l => l.temperature === 'Hot').length;

  // Objections breakdown
  const objectionMap: Record<string, number> = {};
  leads.forEach(l => {
    l.detectedObjections.forEach(obj => {
      objectionMap[obj.category] = (objectionMap[obj.category] || 0) + 1;
    });
  });
  const objectionStats = Object.entries(objectionMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Admissions Performance & Conversion Analytics</h1>
          <p className="text-xs text-slate-500">
            Formally defined conversion metrics, audited source attribution, and objection frequency diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200">
          <Info className="w-4 h-4 text-teal-600" />
          <span>Reporting Period: All Records (Real Database Queries)</span>
        </div>
      </div>

      {/* Conversion Metric Cards with Explicit Mathematical Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Demo Booking Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Demo Booking Rate</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-700">{demoBookingRate}%</div>
          <p className="text-[11px] text-slate-500">
            Formula: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Demos ({bookedDemos}) / Total Leads ({totalLeads})</code>
          </p>
        </div>

        {/* Admission Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Admission Conversion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{admissionRate}%</div>
          <p className="text-[11px] text-slate-500">
            Formula: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Admitted ({confirmedAdmissions}) / Total Leads ({totalLeads})</code>
          </p>
        </div>

        {/* Counsellor Follow-up Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Follow-up Completion</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-sky-600">{taskCompletionRate}%</div>
          <p className="text-[11px] text-slate-500">
            Formula: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Completed ({completedTasks}) / Total Tasks ({totalTasks})</code>
          </p>
        </div>

        {/* Average Lead Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Mean Lead Score</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{avgLeadScore} / 100</div>
          <p className="text-[11px] text-slate-500">
            {hotCount} Hot, {warmCount} Warm, {coldCount} Cold profiles
          </p>
        </div>

      </div>

      {/* Grid: Source Attribution Table & Lead Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Source Attribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Enquiries & Admissions by Acquisition Channel</h3>
            <span className="text-[11px] text-slate-400">First-touch attribution rule</span>
          </div>

          <div className="space-y-3">
            {sourceStats.map(s => {
              const sharePct = totalLeads > 0 ? Math.round((s.count / totalLeads) * 100) : 0;
              return (
                <div key={s.source} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{s.source}</span>
                    <span className="text-slate-500">
                      <strong>{s.count}</strong> enquiries ({sharePct}% share) • <strong>{s.admits}</strong> admissions ({s.conversionPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${sharePct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Score Bracket Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Lead Score Temperature Distribution</h3>

          <div className="space-y-4 pt-2">
            {/* Hot */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-rose-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Hot Leads (Score 70-100)
                </span>
                <span className="font-bold text-slate-800">{hotCount} leads ({totalLeads > 0 ? Math.round((hotCount / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-3 rounded-full" style={{ width: `${totalLeads > 0 ? (hotCount / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Warm */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-amber-700">Warm Leads (Score 40-69)</span>
                <span className="font-bold text-slate-800">{warmCount} leads ({totalLeads > 0 ? Math.round((warmCount / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: `${totalLeads > 0 ? (warmCount / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Cold */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-600">Cold Leads (Score 0-39)</span>
                <span className="font-bold text-slate-800">{coldCount} leads ({totalLeads > 0 ? Math.round((coldCount / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-3 rounded-full" style={{ width: `${totalLeads > 0 ? (coldCount / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 mt-4">
            <strong>Observation:</strong> {hotCount + warmCount} out of {totalLeads} total leads ({totalLeads > 0 ? Math.round(((hotCount + warmCount) / totalLeads) * 100) : 0}%) demonstrate qualified counselling readiness.
          </div>
        </div>

      </div>

      {/* Grid: Course Popularity & Counsellor Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leads by Course */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Enquiry Demand by Curriculum Track</h3>

          <div className="space-y-3">
            {courseStats.map(([cName, count]) => {
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div key={cName} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 max-w-[240px] truncate">{cName}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-700">{count} enquiries</span>
                    <span className="text-[10px] text-slate-400">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Counsellor Allocation & Conversions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Admissions Counsellor Allocation & Task Flow</h3>

          <div className="space-y-3">
            {counsellorStats.map(c => (
              <div key={c.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{c.name}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {c.convertedCount} Admissions Confirmed
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Assigned Leads: <strong>{c.assignedCount}</strong></span>
                  <span>Follow-ups Completed: <strong>{c.tasksCompleted} / {c.tasksTotal}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
