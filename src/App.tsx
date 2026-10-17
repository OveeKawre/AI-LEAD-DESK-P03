import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { Lead, StaffProfile, Course, AptitudeResult, Appointment } from './types';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { LeadsPage } from './pages/LeadsPage';
import { AiCounsellor } from './pages/AiCounsellor';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { DemoBookingModal } from './components/DemoBookingModal';
import { AptitudeAssessmentModal } from './components/AptitudeAssessmentModal';
import { DuplicateReviewModal } from './components/DuplicateReviewModal';

export const App: React.FC = () => {
  // Ensure DB is initialized
  useEffect(() => {
    db.init();
  }, []);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<StaffProfile>(db.getCurrentUser());
  const [staffList, setStaffList] = useState<StaffProfile[]>(db.getStaff());
  const [leads, setLeads] = useState<Lead[]>(db.getLeads());
  const [courses, setCourses] = useState<Course[]>(db.getCourses());

  // Modal / Drawer states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [demoBookingLead, setDemoBookingLead] = useState<Lead | null>(null);
  const [aptitudeLead, setAptitudeLead] = useState<Lead | null>(null);
  const [duplicateReviewLead, setDuplicateReviewLead] = useState<Lead | null>(null);

  // Default active lead for the AI Counsellor tab (e.g. Pooja Deshmukh or first lead)
  const [counsellorLead, setCounsellorLead] = useState<Lead>(
    leads.find(l => l.id === 'lead-101') || leads[0]
  );

  const refreshAllState = () => {
    const freshLeads = db.getLeads();
    setLeads(freshLeads);
    setCourses(db.getCourses());
    setStaffList(db.getStaff());
    setCurrentUser(db.getCurrentUser());
    if (selectedLead) {
      const updated = freshLeads.find(l => l.id === selectedLead.id);
      setSelectedLead(updated || null);
    }
    if (counsellorLead) {
      const updated = freshLeads.find(l => l.id === counsellorLead.id);
      if (updated) setCounsellorLead(updated);
    }
  };

  const handleResetData = () => {
    db.resetToDefaults();
    refreshAllState();
    setActiveTab('dashboard');
  };

  const handleSwitchUser = (staff: StaffProfile) => {
    db.setCurrentUser(staff);
    setCurrentUser(staff);
    refreshAllState();
  };

  const handleLeadSelected = (lead: Lead) => {
    setSelectedLead(lead);
    setCounsellorLead(lead);
  };

  const hotLeadsCount = leads.filter(l => l.temperature === 'Hot').length;
  const pendingTasksCount = db.getFollowUps().filter(t => t.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allStaff={staffList}
        onSwitchUser={handleSwitchUser}
        onResetData={handleResetData}
        hotLeadsCount={hotLeadsCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            onSelectLead={handleLeadSelected}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsPage
            onSelectLead={handleLeadSelected}
            onOpenDuplicateReview={(lead) => setDuplicateReviewLead(lead)}
          />
        )}

        {activeTab === 'counsellor' && (
          <AiCounsellor
            currentLead={counsellorLead}
            onOpenDemoBooking={(lead) => setDemoBookingLead(lead)}
            onOpenAptitude={(lead) => setAptitudeLead(lead)}
            onLeadUpdated={(lead) => {
              setCounsellorLead(lead);
              refreshAllState();
            }}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsPage
            onOpenDemoBooking={(lead) => setDemoBookingLead(lead)}
            leads={leads}
          />
        )}

        {activeTab === 'followups' && (
          <FollowUpsPage
            onSelectLead={handleLeadSelected}
          />
        )}

        {activeTab === 'courses' && (
          <KnowledgeBasePage />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            currentUser={currentUser}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Lead Desk © 2026 • AI-Powered Multilingual Admissions Platform</span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Supabase & PostgreSQL Architecture</span>
            <span>•</span>
            <span>Google Gemini AI</span>
            <span>•</span>
            <span>English • हिन्दी • मराठी</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      
      {/* 1. Lead Detail Drawer (Counsellor Inspection & Human Takeover) */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onLeadUpdated={(updated) => {
            setSelectedLead(updated);
            refreshAllState();
          }}
          onOpenDemoBooking={(lead) => setDemoBookingLead(lead)}
          onOpenAptitude={(lead) => setAptitudeLead(lead)}
        />
      )}

      {/* 2. Demo Class Booking Modal */}
      {demoBookingLead && (
        <DemoBookingModal
          isOpen={true}
          onClose={() => setDemoBookingLead(null)}
          lead={demoBookingLead}
          courses={courses}
          onBookingSuccess={(app) => {
            refreshAllState();
          }}
        />
      )}

      {/* 3. Adaptive Aptitude Assessment Modal */}
      {aptitudeLead && (
        <AptitudeAssessmentModal
          isOpen={true}
          onClose={() => setAptitudeLead(null)}
          lead={aptitudeLead}
          onAssessmentCompleted={(res) => {
            refreshAllState();
          }}
        />
      )}

      {/* 4. Unified Identity Duplicate Review & Merge Modal */}
      {duplicateReviewLead && (
        <DuplicateReviewModal
          isOpen={true}
          onClose={() => setDuplicateReviewLead(null)}
          lead={duplicateReviewLead}
          onMergedSuccess={(primaryLead) => {
            refreshAllState();
            setSelectedLead(primaryLead);
          }}
        />
      )}

    </div>
  );
};

export default App;
