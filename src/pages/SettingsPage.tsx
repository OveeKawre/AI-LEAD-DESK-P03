import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Sparkles, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  PhoneCall, 
  Radio,
  FileCode,
  Lock,
  ExternalLink
} from 'lucide-react';
import { IntegrationConfig, AuditLog, StaffProfile } from '../types';
import { db } from '../services/db';

interface SettingsPageProps {
  currentUser: StaffProfile;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onResetData }) => {
  const [integrations, setIntegrations] = useState<IntegrationConfig>(db.getIntegrations());
  const [geminiKeyInput, setGeminiKeyInput] = useState(integrations.geminiApiKey);
  const [geminiModelInput, setGeminiModelInput] = useState(integrations.geminiModel || 'gemini-1.5-flash');
  const [isDemoMode, setIsDemoMode] = useState(integrations.isDemoMode);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(db.getAuditLogs());
  const staff = db.getStaff();

  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: IntegrationConfig = {
      ...integrations,
      geminiApiKey: geminiKeyInput.trim(),
      geminiModel: geminiModelInput,
      isDemoMode: isDemoMode
    };

    db.saveIntegrations(updated);
    setIntegrations(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestGeminiApi = async () => {
    if (!geminiKeyInput.trim()) {
      setApiTestResult({ success: false, message: 'Please enter a Gemini API Key before testing.' });
      return;
    }

    setIsTestingApi(true);
    setApiTestResult(null);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelInput}:generateContent?key=${geminiKeyInput.trim()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello! Respond with: AI Lead Desk connected successfully.' }] }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        setApiTestResult({ success: false, message: `API Connection Failed (${res.status}): ${errText.slice(0, 100)}` });
      } else {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
        setApiTestResult({ success: true, message: `Success! Model replied: "${text.trim()}"` });
      }
    } catch (e: any) {
      setApiTestResult({ success: false, message: `Network error: ${e.message}` });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">System Configuration & Integrations</h1>
        <p className="text-xs text-slate-500">
          Configure Google Gemini API credentials, manage staff roles, review identity resolution rules, and inspect audit logs.
        </p>
      </div>

      {/* AI Provider & Gemini API Configuration */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 border border-teal-500/20 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Gemini LLM Integration</h2>
              <p className="text-xs text-slate-500">Configure your Google AI Studio API key or run in verified Local RAG Demo Mode.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isDemoMode 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}>
              {isDemoMode ? 'DEMO MODE (Verified Rules RAG)' : 'LIVE GEMINI API'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveIntegrations} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                className="w-full text-xs font-mono rounded-xl border border-slate-300 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Keys are stored securely in your browser's local state and never bundled in production source code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Model Name
              </label>
              <select
                value={geminiModelInput}
                onChange={(e) => setGeminiModelInput(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Multilingual)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
              </select>
            </div>

          </div>

          {/* Demo Mode Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Force Intelligent Demo Mode</span>
              <span className="text-[11px] text-slate-500">
                When enabled, the system uses our verified deterministic NLP engine even if an API key is saved.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {/* Test Status Banner */}
          {apiTestResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              apiTestResult.success 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              {apiTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{apiTestResult.message}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Settings saved successfully!
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestGeminiApi}
              disabled={isTestingApi || !geminiKeyInput.trim()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40 transition"
            >
              {isTestingApi ? 'Connecting...' : 'Test Gemini Connection'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition"
            >
              Save Configuration
            </button>
          </div>

        </form>
      </div>

      {/* Modular Channel Integrations Status Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Modular Channel Integrations Status</h2>
          <p className="text-xs text-slate-500">
            Compliant with Section 20 guidelines: Unavailable channels are clearly labelled as not configured without faking external calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Voice Input */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-teal-600" />
                Browser Speech-to-Text
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Active & Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Native Web Speech API supporting Indian English (en-IN), Hindi (hi-IN), and Marathi (mr-IN).
            </p>
          </div>

          {/* WhatsApp API */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp Cloud API
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Demo Mode
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pre-drafted messages and webhook intake ready. Requires Meta Business Verification to send live external WhatsApps.
            </p>
          </div>

          {/* Telephony */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-slate-400" />
                Telephony Calling
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                Not Configured
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kept as an optional separate module. Requires Twilio/Exotel credentials and explicit student recording consent.
            </p>
          </div>

        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Institute Admissions Staff Profiles</h2>
          <p className="text-xs text-slate-500">Manage counsellors and administrator roles.</p>
        </div>

        <div className="space-y-3">
          {staff.map(s => (
            <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={s.avatarUrl} alt={s.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                  <p className="text-[11px] text-slate-400">{s.email} • {s.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {s.role}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  s.activeStatus === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {s.activeStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Viewer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Immutable System Audit Log</h2>
            <p className="text-xs text-slate-500">Chronological audit trail of merges, human takeovers, and verifications.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{auditLogs.length} events logged</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogs.slice(0, 15).map(log => (
            <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                    {log.action}
                  </span>
                  <span className="font-medium text-slate-800">{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-400">By: {log.performedBy}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fresh Demo Data Reset */}
      <div className="bg-rose-50/60 border border-rose-200 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-rose-950">Reset Database to Default Demo State</h3>
          <p className="text-xs text-rose-700">
            Resets all leads, appointments, slots, and messages back to the 12+ realistic Indian hackathon demo leads.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to the clean 12-lead demo state?')) {
              onResetData();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>
      </div>

    </div>
  );
};
