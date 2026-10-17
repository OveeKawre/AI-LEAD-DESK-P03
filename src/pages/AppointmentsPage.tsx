import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Video
} from 'lucide-react';
import { Appointment, AppointmentSlot, Lead } from '../types';
import { db } from '../services/db';

interface AppointmentsPageProps {
  onOpenDemoBooking: (lead: Lead) => void;
  leads: Lead[];
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  onOpenDemoBooking,
  leads
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(db.getAppointments());
  const [slots, setSlots] = useState<AppointmentSlot[]>(db.getSlots());
  const [filterMode, setFilterMode] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [cancelModalApp, setCancelModalApp] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Student requested reschedule');

  const refreshData = () => {
    setAppointments(db.getAppointments());
    setSlots(db.getSlots());
  };

  const handleCancelAppointment = () => {
    if (!cancelModalApp) return;
    db.cancelAppointment(cancelModalApp.id, cancelReason);
    setCancelModalApp(null);
    refreshData();
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesMode = filterMode === 'All' || a.mode === filterMode;
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchesMode && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Demo Class Bookings & Slot Calendar</h1>
          <p className="text-xs text-slate-500">Database-backed reservation engine with capacity validation and double-booking conflict safeguards.</p>
        </div>

        <button
          onClick={() => {
            const firstEligibleLead = leads.find(l => l.stage !== 'Not Interested') || leads[0];
            if (firstEligibleLead) onOpenDemoBooking(firstEligibleLead);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          Book Student for Demo
        </button>
      </div>

      {/* Available Slots Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Verified Slots & Real-Time Capacity
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {slots.filter(s => s.status === 'Available').length} Available Slots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map(slot => {
            const isFull = slot.status === 'Full' || slot.bookedCount >= slot.capacity;
            const remaining = slot.capacity - slot.bookedCount;
            const pct = Math.round((slot.bookedCount / slot.capacity) * 100);

            return (
              <div 
                key={slot.id} 
                className={`p-4 rounded-2xl border transition shadow-xs ${
                  isFull ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-xs text-slate-900 leading-tight line-clamp-2">
                    {slot.courseName}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isFull ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {isFull ? 'Full' : `${remaining} left`}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-semibold text-slate-800">{slot.date}</span>
                    <span className="text-slate-400">•</span>
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{slot.venueOrLink}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Capacity</span>
                    <span className="font-semibold text-slate-700">{slot.bookedCount} / {slot.capacity} Booked</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${isFull ? 'bg-rose-500' : 'bg-teal-500'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Lead Instructor: <strong>{slot.counsellorName}</strong></span>
                  <span className="bg-slate-100 px-1.5 py-0.2 rounded font-medium">{slot.mode}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booked Appointments Table */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Confirmed Demo Appointments ({filteredAppointments.length})
          </span>

          <div className="flex items-center gap-2">
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="text-xs rounded-xl border border-slate-300 p-2 bg-white text-slate-700 font-medium"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online Demo</option>
              <option value="Offline Campus">Offline Campus</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs rounded-xl border border-slate-300 p-2 bg-white text-slate-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Student</th>
                  <th scope="col" className="px-4 py-3.5">Course Program</th>
                  <th scope="col" className="px-4 py-3.5">Date & Slot</th>
                  <th scope="col" className="px-4 py-3.5">Mode / Meeting Details</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5">Counsellor</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No appointments matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 block">{app.studentName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{app.studentPhone}</span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {app.courseName}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 block">{app.date}</span>
                        <span className="text-[11px] text-slate-500">{app.time}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mb-1 ${
                          app.mode === 'Online' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {app.mode}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{app.venueOrLink}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Booked' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                          app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        {app.counsellorName}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {app.status === 'Booked' && (
                          <button
                            onClick={() => setCancelModalApp(app)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 rounded hover:bg-rose-50 transition"
                          >
                            Cancel / Free Slot
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Cancel Demo Booking #{cancelModalApp.id}?</h3>
            <p className="text-xs text-slate-600">
              Cancelling will automatically restore 1 seat of capacity to the slot on <strong>{cancelModalApp.date}</strong> and update the appointment record.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason for Cancellation</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalApp(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
