import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { AppointmentSlot, Lead, Course, Appointment } from '../types';
import { db } from '../services/db';

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  courses: Course[];
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({
  isOpen,
  onClose,
  lead,
  courses,
  onBookingSuccess
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses.find(c => c.name === lead.courseInterest)?.id || courses[0]?.id || ''
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedApp, setConfirmedApp] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const allSlots = db.getSlots();
  // Filter available slots for chosen course or all
  const filteredSlots = allSlots.filter(s => !selectedCourseId || s.courseId === selectedCourseId);

  const handleBook = () => {
    setErrorMsg('');
    if (!selectedSlotId) {
      setErrorMsg('Please select an available demo time slot.');
      return;
    }

    const res = db.bookAppointment({
      leadId: lead.id,
      studentName: lead.name,
      studentPhone: lead.normalizedPhone,
      studentEmail: lead.email,
      slotId: selectedSlotId,
      notes
    });

    if (!res.success || !res.appointment) {
      setErrorMsg(res.message);
    } else {
      setConfirmedApp(res.appointment);
      if (onBookingSuccess) onBookingSuccess(res.appointment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Book Live Demo Class</h3>
              <p className="text-xs text-slate-400">Database-backed conflict-free reservation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!confirmedApp ? (
            <div className="space-y-4">
              
              {/* Student Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-900">{lead.name}</span>
                  <span className="text-slate-400 mx-2">|</span>
                  <span>{lead.normalizedPhone}</span>
                </div>
                <span className="bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                  {lead.preferredLanguage}
                </span>
              </div>

              {/* Course Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Course Track
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedSlotId('');
                  }}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="">All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Fees: ₹{c.fees.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Grid with Real-time Capacity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Available Verified Slots ({filteredSlots.length})
                </label>

                {filteredSlots.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs">
                    No open demo slots currently scheduled for this course. Please contact counsellor or check back tomorrow.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {filteredSlots.map(slot => {
                      const isFull = slot.status === 'Full' || slot.bookedCount >= slot.capacity;
                      const isSelected = selectedSlotId === slot.id;
                      const seatsLeft = slot.capacity - slot.bookedCount;

                      return (
                        <button
                          key={slot.id}
                          disabled={isFull}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                            isFull 
                              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed text-slate-400' 
                              : isSelected
                              ? 'border-teal-500 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500/20 shadow-sm'
                              : 'border-slate-200 hover:border-teal-400 bg-white text-slate-800'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{slot.courseName}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                slot.mode === 'Online' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {slot.mode}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                                {slot.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-teal-600" />
                                {slot.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {slot.venueOrLink}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            {isFull ? (
                              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                Slot Full
                              </span>
                            ) : (
                              <div>
                                <span className="text-xs font-bold text-teal-700 block">
                                  {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {slot.counsellorName}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Special Requests or Language Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Request or Language Preference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need bilingual explanation in Marathi/Hindi, or evening reminder"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBook}
                  disabled={!selectedSlotId}
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 disabled:opacity-40 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Demo Booking
                </button>
              </div>

            </div>
          ) : (
            /* Booking Confirmation View */
            <div className="text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-teal-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-1">Demo Class Confirmed!</h4>
              <p className="text-xs text-slate-500 mb-6">Database record #{confirmedApp.id} created with conflict safeguard.</p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Student Name:</span>
                  <span className="font-bold text-slate-800">{confirmedApp.studentName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Course:</span>
                  <span className="font-bold text-slate-800">{confirmedApp.courseName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Date & Time:</span>
                  <span className="font-bold text-teal-700">{confirmedApp.date} ({confirmedApp.time})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Mode:</span>
                  <span className="font-bold text-slate-800">{confirmedApp.mode}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Meeting / Venue:</span>
                  <span className="font-medium text-slate-700 text-[11px] truncate max-w-[220px]">{confirmedApp.venueOrLink}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-left mb-6 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Next Automated Step: </span>
                  <span>A reminder task has been created for counsellor {confirmedApp.counsellorName} to dispatch attendance instructions prior to the session.</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
