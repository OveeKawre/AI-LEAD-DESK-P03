import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  Sparkles,
  Menu,
  X,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { StaffProfile, UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: StaffProfile;
  allStaff: StaffProfile[];
  onSwitchUser: (staff: StaffProfile) => void;
  onResetData: () => void;
  hotLeadsCount: number;
  pendingTasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allStaff,
  onSwitchUser,
  onResetData,
  hotLeadsCount,
  pendingTasksCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users, badge: hotLeadsCount ? `${hotLeadsCount} Hot` : undefined, badgeColor: 'bg-rose-500' },
    { id: 'counsellor', label: 'AI Counsellor', icon: MessageSquare, badge: 'AI Live', badgeColor: 'bg-teal-500' },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'followups', label: 'Follow-ups', icon: CheckSquare, badge: pendingTasksCount ? `${pendingTasksCount}` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'courses', label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-900 border-b border-navy-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">AI LEAD DESK</span>
                <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  India EdCRM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Multilingual Admissions Counselling & Lead Desk</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher & Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Demo Data Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>DEMO DATA</span>
              <button 
                onClick={onResetData} 
                title="Reset Database to Fresh Demo Records"
                className="ml-1 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Portal Switch */}
            {currentUser.role === 'Prospective Student' ? (
              <button
                onClick={() => {
                  const staffUser = allStaff.find(s => s.role === 'Admissions Counsellor') || allStaff[0];
                  onSwitchUser(staffUser);
                  setActiveTab('dashboard');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-800 text-teal-300 border border-teal-500/30 hover:bg-navy-700 transition"
              >
                Switch to Counsellor CRM
              </button>
            ) : (
              <button
                onClick={() => {
                  const studentProfile: StaffProfile = {
                    id: 'student-demo',
                    name: 'Pooja Deshmukh (Student)',
                    email: 'pooja.student@gmail.com',
                    role: 'Prospective Student' as UserRole,
                    phone: '+91 98234 12345',
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    assignedLeadsCount: 0,
                    activeStatus: 'Online'
                  };
                  onSwitchUser(studentProfile);
                  setActiveTab('counsellor');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                Student Experience
              </button>
            )}

            {/* Active User / Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 transition text-left"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-teal-500/50"
                />
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-teal-300 font-medium">{currentUser.role}</p>
                </div>
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Switch Role Persona</p>
                  </div>
                  {allStaff.map(staff => (
                    <button
                      key={staff.id}
                      onClick={() => {
                        onSwitchUser(staff);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-800 transition ${
                        currentUser.id === staff.id ? 'bg-teal-950/60 text-teal-300' : ''
                      }`}
                    >
                      <img src={staff.avatarUrl} alt={staff.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-semibold">{staff.name}</p>
                        <p className="text-[11px] text-slate-400">{staff.role}</p>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      const studentProfile: StaffProfile = {
                        id: 'student-demo',
                        name: 'Pooja Deshmukh (Student)',
                        email: 'pooja.student@gmail.com',
                        role: 'Prospective Student' as UserRole,
                        phone: '+91 98234 12345',
                        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        assignedLeadsCount: 0,
                        activeStatus: 'Online'
                      };
                      onSwitchUser(studentProfile);
                      setActiveTab('counsellor');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-800 transition text-teal-400 font-medium text-xs"
                  >
                    <GraduationCap className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-xs font-semibold">Prospective Student Persona</p>
                      <p className="text-[11px] text-slate-400">Chat & Book Demo as Student</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-navy-800 bg-navy-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400 px-3">
            <span>DEMO DATA ENABLED</span>
            <button onClick={onResetData} className="text-teal-400 hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Reset Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
