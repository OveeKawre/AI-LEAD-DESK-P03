import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { FollowUpTask, Lead } from '../types';
import { db } from '../services/db';

interface FollowUpsPageProps {
  onSelectLead: (lead: Lead) => void;
}

export const FollowUpsPage: React.FC<FollowUpsPageProps> = ({ onSelectLead }) => {
  const [tasks, setTasks] = useState<FollowUpTask[]>(db.getFollowUps());
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('Pending');
  const [messageModalTask, setMessageModalTask] = useState<FollowUpTask | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const refreshTasks = () => {
    setTasks(db.getFollowUps());
  };

  const now = new Date();

  const handleComplete = (taskId: string) => {
    db.completeFollowUp(taskId);
    refreshTasks();
  };

  const filteredTasks = tasks.filter(t => {
    const isOverdue = t.status === 'Pending' && new Date(t.dueDate) < now;
    if (activeFilter === 'Pending') return t.status === 'Pending';
    if (activeFilter === 'Completed') return t.status === 'Completed';
    if (activeFilter === 'Overdue') return isOverdue;
    return true;
  });

  const overdueCount = tasks.filter(t => t.status === 'Pending' && new Date(t.dueDate) < now).length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;

  const copySuggestedMessage = () => {
    if (!messageModalTask) return;
    navigator.clipboard.writeText(messageModalTask.suggestedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Admissions Counsellor Follow-up Desk</h1>
          <p className="text-xs text-slate-500">Scheduled reminders, AI next-best actions, and pre-drafted multilingual messages.</p>
        </div>

        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              {overdueCount} Overdue Follow-ups
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveFilter('Pending')}
          className={`pb-3 border-b-2 transition ${
            activeFilter === 'Pending' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-800'
          }`}
        >
          Pending Tasks ({pendingCount})
        </button>

        <button
          onClick={() => setActiveFilter('Overdue')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeFilter === 'Overdue' ? 'border-rose-600 text-rose-700' : 'border-transparent hover:text-slate-800'
          }`}
        >
          Overdue Alert ({overdueCount})
        </button>

        <button
          onClick={() => setActiveFilter('Completed')}
          className={`pb-3 border-b-2 transition ${
            activeFilter === 'Completed' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-800'
          }`}
        >
          Completed History
        </button>

        <button
          onClick={() => setActiveFilter('All')}
          className={`pb-3 border-b-2 transition ${
            activeFilter === 'All' ? 'border-teal-600 text-teal-700' : 'border-transparent hover:text-slate-800'
          }`}
        >
          All ({tasks.length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">All caught up!</p>
            <p>No follow-ups matching this filter.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isOverdue = task.status === 'Pending' && new Date(task.dueDate) < now;
            const channelIcon = task.preferredChannel === 'WhatsApp' ? MessageSquare :
                                task.preferredChannel === 'Phone Call' ? Phone : Mail;
            const ChannelIcon = channelIcon;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isOverdue ? 'bg-rose-50/40 border-rose-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{task.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority} Priority
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Context:</strong> {task.reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      Student: {task.studentName}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <ChannelIcon className="w-3.5 h-3.5 text-teal-600" />
                      Channel: {task.preferredChannel}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      Due: {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  {task.suggestedMessage && (
                    <button
                      onClick={() => setMessageModalTask(task)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      Review Message
                    </button>
                  )}

                  {task.status === 'Pending' ? (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pre-drafted Message Modal */}
      {messageModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">Pre-Drafted Counsellor Message</h3>
                <p className="text-xs text-slate-500">For {messageModalTask.studentName} via {messageModalTask.preferredChannel}</p>
              </div>
              <button onClick={() => setMessageModalTask(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed relative">
              "{messageModalTask.suggestedMessage}"
            </div>

            <div className="text-[11px] text-slate-500 bg-teal-50 p-3 rounded-xl border border-teal-200">
              <strong>Tip:</strong> In full production, this triggers the verified WhatsApp Business Cloud API webhook. In hackathon demo mode, you can copy directly to clipboard.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMessageModalTask(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={copySuggestedMessage}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copied to Clipboard' : 'Copy Message'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
