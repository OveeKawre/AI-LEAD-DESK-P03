import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Brain, Award, HelpCircle } from 'lucide-react';
import { INITIAL_APTITUDE_QUESTIONS } from '../services/db';
import { AptitudeQuestion, AptitudeResult, Lead } from '../types';
import { db } from '../services/db';

interface AptitudeAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onAssessmentCompleted?: (result: AptitudeResult) => void;
}

export const AptitudeAssessmentModal: React.FC<AptitudeAssessmentModalProps> = ({
  isOpen,
  onClose,
  lead,
  onAssessmentCompleted
}) => {
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>(
    lead.preferredLanguage === 'Marathi' ? 'mr' : lead.preferredLanguage === 'Hindi' ? 'hi' : 'en'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { optionId: string; points: number; type: string }>>({});
  const [completedResult, setCompletedResult] = useState<AptitudeResult | null>(null);

  if (!isOpen) return null;

  const questions: AptitudeQuestion[] = INITIAL_APTITUDE_QUESTIONS;
  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string, points: number, type: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: { optionId, points, type }
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate assessment result
      const answerEntries = Object.entries(selectedAnswers);
      const totalScore = answerEntries.reduce((sum, [_, val]) => sum + val.points, 0);

      // Dominant aptitude track
      const typeCounts: Record<string, number> = {};
      answerEntries.forEach(([_, val]) => {
        typeCounts[val.type] = (typeCounts[val.type] || 0) + 1;
      });

      let dominant = 'Analytical Problem Solver';
      let track = 'Full Stack Web Development (MERN & Cloud)';
      let strengths = ['Logical Breakdown', 'Debugging Curiosity', 'Systematic Thinking'];

      if ((typeCounts['analytical'] || 0) >= 2) {
        dominant = 'Algorithmic & Analytical Thinker';
        track = 'Full Stack Web Development or Data Science & AI';
        strengths = ['Step-by-step logic', 'Data pattern detection', 'Persistent error tracing'];
      } else if ((typeCounts['creative'] || 0) >= 2) {
        dominant = 'Visual & UX Designer Mindset';
        track = 'UI/UX Product Design & Frontend Fundamentals';
        strengths = ['User-centric empathy', 'Visual layout sensibility', 'Design problem solving'];
      } else if ((typeCounts['exploratory'] || 0) >= 2) {
        dominant = 'Systems & Infrastructure Explorer';
        track = 'Cloud Computing & DevOps Masterclass';
        strengths = ['System architecture intuition', 'Curiosity for automation', 'Cloud security awareness'];
      }

      const explanation = `Based on your responses, you show high aptitude for ${dominant.toLowerCase()}. You prefer practical problem-solving with concrete feedback loops rather than pure abstract theory. This diagnostic is designed to guide your learning plan and does not determine rigid boundaries.`;

      const result: AptitudeResult = {
        id: `apt-${Date.now()}`,
        leadId: lead.id,
        studentName: lead.name,
        answers: answerEntries.map(([qId, val]) => ({
          questionId: qId,
          selectedOptionId: val.optionId,
          points: val.points
        })),
        totalScore,
        dominantAptitude: dominant,
        recommendedTrack: track,
        explanation,
        strengths,
        suggestedNextStep: totalScore >= 75 ? 'Qualified for 15% MERIT15 discount code on enrollment' : 'Attend live practical demo to experience hands-on coding flow',
        completedAt: new Date().toISOString()
      };

      db.saveAptitudeResult(result);

      // Update lead score & notes
      const updatedLead = { ...lead };
      updatedLead.score = Math.min(100, updatedLead.score + 10);
      updatedLead.temperature = updatedLead.score >= 70 ? 'Hot' : 'Warm';
      db.saveLead(updatedLead);

      setCompletedResult(result);
      if (onAssessmentCompleted) onAssessmentCompleted(result);
    }
  };

  const currentSelection = selectedAnswers[currentQ?.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Adaptive Aptitude Assessment</h3>
              <p className="text-xs text-slate-400">Diagnostic career alignment for {lead.name}</p>
            </div>
          </div>
          
          {/* Language Switcher inside test */}
          <div className="flex items-center gap-2">
            <div className="flex bg-navy-800 rounded-lg p-0.5 border border-navy-700 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded ${lang === 'hi' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded ${lang === 'mr' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                मराठी
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {!completedResult ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
                  <span className="text-teal-700 font-bold uppercase tracking-wider">{currentQ.category}</span>
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question[lang] || currentQ.question.en}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map(option => {
                  const isSelected = currentSelection?.optionId === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id, option.points, option.aptitudeType)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className="text-sm font-medium">
                        {option.text[lang] || option.text.en}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Guidance Notice */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-500">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>This assessment measures natural learning style and logic, not scientific IQ. It helps match the ideal teaching pace.</span>
              </div>

              {/* Footer action */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!currentSelection}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 disabled:opacity-40 transition"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Calculate Diagnostic Result' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="py-2 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-teal-50">
                <Award className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-1">Assessment Complete!</h4>
              <p className="text-xs text-slate-500 mb-6">Diagnostic guidance report for {completedResult.studentName}</p>

              <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto text-left">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Overall Aptitude Score</span>
                  <span className="text-2xl font-black text-teal-700">{completedResult.totalScore}%</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Primary Style</span>
                  <span className="text-sm font-bold text-slate-800 block truncate">{completedResult.dominantAptitude}</span>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-4 text-left mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">Recommended Career Learning Track</span>
                </div>
                <p className="text-sm font-bold text-teal-950 mb-1">{completedResult.recommendedTrack}</p>
                <p className="text-xs text-teal-800 leading-relaxed mb-3">{completedResult.explanation}</p>

                <div className="flex flex-wrap gap-1.5">
                  {completedResult.strengths.map((s, idx) => (
                    <span key={idx} className="bg-white/80 border border-teal-300 text-teal-800 text-[11px] px-2 py-0.5 rounded-md font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
                >
                  Close & View in CRM
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply To Profile
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
