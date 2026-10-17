import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Search, 
  Award, 
  Calendar, 
  Clock, 
  Tag, 
  FileText,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { Course } from '../types';
import { db } from '../services/db';

export const KnowledgeBasePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(db.getCourses());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentUser = db.getCurrentUser();
  const isAdmin = currentUser.role === 'Administrator';

  const refreshCourses = () => {
    setCourses(db.getCourses());
  };

  const handleToggleVerification = (courseId: string) => {
    if (!isAdmin) {
      alert('Only administrators with Academic Director authorization can verify course records.');
      return;
    }
    db.toggleCourseVerification(courseId, currentUser.name);
    refreshCourses();
  };

  const filteredCourses = courses.filter(c => {
    const q = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    const syllabusMatch = c.syllabus.some(m => m.topics.some(t => t.toLowerCase().includes(q)));
    return nameMatch || syllabusMatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Verified Academic Knowledge Base</h1>
          <p className="text-xs text-slate-500">
            Authoritative course curriculum, verified fee structures, and audited placement benchmarks powering the AI RAG engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Add Course Program
            </button>
          ) : (
            <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Admin Verification Mode (Log in as Dr. Rajesh Sharma to edit)
            </span>
          )}
        </div>
      </div>

      {/* AI Grounding Policy Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-navy-900 to-navy-950 text-white p-4 px-6 rounded-2xl border border-teal-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-300">Authoritative Facts Rule</h3>
            <p className="text-xs text-slate-300">
              Only courses with <strong className="text-white">Active Verified Status</strong> are ingested by the AI admissions counsellor. Unverified draft fees are quarantined.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-teal-400">
            {courses.filter(c => c.isVerified).length} / {courses.length} Programs Authoritative
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search verified courses, fees, syllabus topics (e.g. React, Docker, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            className={`bg-white rounded-2xl border transition shadow-sm overflow-hidden flex flex-col justify-between ${
              course.isVerified ? 'border-slate-200 hover:border-teal-400' : 'border-amber-300 bg-amber-50/20'
            }`}
          >
            <div className="p-5 space-y-4">
              
              {/* Card Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold bg-navy-800 text-teal-300 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{course.deliveryMode} Mode</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{course.name}</h3>
                </div>

                {/* Verification Badge & Toggle */}
                <div className="flex flex-col items-end shrink-0">
                  {course.isVerified ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Authoritative Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      Pending Verification
                    </span>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => handleToggleVerification(course.id)}
                      className="text-[10px] font-semibold text-teal-700 hover:underline"
                    >
                      {course.isVerified ? 'Toggle Quarantine' : 'Approve & Verify'}
                    </button>
                  )}
                </div>
              </div>

              {/* Description & Eligibility */}
              <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[10px]">Eligibility Standard</span>
                <p className="text-slate-800 font-medium">{course.eligibility}</p>
              </div>

              {/* Financial & Terms Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Tuition Fee</span>
                  <span className="text-base font-black text-teal-800">₹{course.fees.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-500 block">{course.duration}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Payment Schedule</span>
                  <span className="text-[11px] font-medium text-slate-700 block leading-tight">{course.paymentTerms}</span>
                </div>
              </div>

              {/* Approved Discounts */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Authorised Discount Policies ({course.approvedDiscounts.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {course.approvedDiscounts.map(d => (
                    <span key={d.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold">
                      <Tag className="w-3 h-3 text-teal-600" />
                      <span>{d.code} ({d.percentage}% Off)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Placement Audited Stats */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[10px] flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-600" />
                  Verified Placement Support & Record
                </span>
                <p className="text-slate-800 font-medium">{course.verifiedPlacementStats}</p>
              </div>

              {/* Syllabus Modules Accordion Snapshot */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Curriculum Modules ({course.syllabus.length} Modules)
                </span>
                <div className="space-y-2">
                  {course.syllabus.map((m, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between font-bold text-slate-800 mb-1">
                        <span>Module {i + 1}: {m.moduleName}</span>
                        <span className="text-teal-700 text-[10px]">{m.durationWeeks} Weeks</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {m.topics.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Card Footer: Evidence Reference */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 px-5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Authority: {course.sourceReference}</span>
              <span>Verified: {course.lastVerifiedDate}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
