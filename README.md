# 🎓 AI LEAD DESK
### AI-Powered Multilingual Admissions Counselling and Lead Management Platform for Indian Higher Ed & EdTech

Built for a 24-Hour Hackathon by a 4-Student Development Team.

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](http://localhost:3000/)
[![Tests](https://img.shields.io/badge/Tests-24%2F24%20Passed-teal)](src/test/suite.ts)
[![UI Theme](https://img.shields.io/badge/Theme-Navy%20%26%20Teal-blue)](#5-uiux-design)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Supabase%20Ready-3ecf8e)](#supabase-database-schema)
[![AI RAG](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20%2B%20Verified%20RAG-indigo)](#ai-admissions-counsellor)

---

## 🌟 Executive Summary

Educational institutes across India receive enquiries around the clock via WhatsApp, Instagram ads, website forms, walk-ins, and phone calls. Many enquiries arrive in **Hindi, Marathi, or mixed code-switching (Hinglish/Maranglish)** with anxieties regarding **career gaps, non-IT degree backgrounds (Commerce/Arts), fees, and job prospects**.

Traditional generic chatbots either hallucinate placement numbers or fail to understand non-traditional backgrounds, while human counsellors miss scheduled follow-ups and struggle with scattered leads across channels.

**AI Lead Desk** solves these problems with:
1. **Multilingual AI Admissions Counsellor** (English, Hindi, Marathi, Code-Switching) with native Web Speech STT.
2. **Verified Academic Knowledge Base (RAG)**: Zero hallucinations. AI answers strictly using institute-verified course facts, eligibility, fee structures, and audited placement data.
3. **Adaptive Aptitude Diagnostic**: 4-question adaptive assessment providing empathetic career guidance without automatic rejection.
4. **Explainable Lead Scoring Engine (0–100)**: Transparent score breakdown across 5 dimensions (Course interest, Engagement, Eligibility, Demo intent, Responsiveness) into Hot, Warm, and Cold tiers.
5. **Evidence-Based Objection Detection**: Detects concerns about fees, study gaps, placement guarantees, family approval, or time constraints with supporting quotes and suggested counsellor rebuttals.
6. **Next-Best-Action Engine**: Recommends the optimal next step, reason, channel, and pre-drafted message.
7. **Unified Identity & Duplicate Detection**: Normalizes Indian phone numbers (+91), detects multi-channel duplicate enquiries, and enables safe authorized merges with audit trails.
8. **Conflict-Free Demo Class Booking**: Database-backed slot reservation engine with capacity validation and double-booking safeguards.
9. **Instant Human Takeover**: One-click counsellor takeover that pauses AI auto-replies, documents handovers in audit logs, and allows authorized resumption.
10. **Full Analytics & Attribution**: Live conversion funnel, source attribution, counsellor productivity metrics, and objection frequency distributions.

---

## 🚀 Live Demo & Quickstart

The web application is running locally:
- **Local URL**: `http://localhost:3000/`

### 1. Prerequisites
- Node.js (v20 LTS or higher)
- npm (v10 or higher)

### 2. Installation
```bash
git clone https://github.com/your-org/ai-lead-desk.git
cd ai-lead-desk

# Install dependencies
npm install --legacy-peer-deps

# Run automated test suite (24 verification points)
npx tsx src/test/suite.ts

# Start development server
npm run dev
```

### 3. Production Build & Preview
```bash
npm run build
npm run preview -- --port 3000 --host 0.0.0.0
```

---

## 🔑 Environment Variables & Configuration

The platform works out of the box with intelligent verified local RAG in **DEMO MODE**. To connect real Google Gemini API calls:

Create a `.env` file in the root directory:
```env
# Optional Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash

# Optional Supabase Production Credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Security Note:** You can also configure and test your Gemini API Key directly inside the **Settings** page in the UI. Keys are stored in the browser session and are never exposed in production bundles.

---

## 🏛️ Application Architecture

```
ai-lead-desk/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                   # Header, role persona switcher, mobile drawer
│   │   ├── LeadDetailDrawer.tsx         # 3-line summary, full chat history, score breakdown, takeover
│   │   ├── DemoBookingModal.tsx         # Database-backed slot picker with conflict prevention
│   │   ├── AptitudeAssessmentModal.tsx  # Adaptive 4-question test with en/hi/mr language support
│   │   └── DuplicateReviewModal.tsx     # Identity resolution & merge comparison
│   ├── pages/
│   │   ├── OverviewDashboard.tsx        # KPIs, conversion rate, pipeline funnel, hot leads
│   │   ├── LeadsPage.tsx                # Lead table, filters, search, quick enquiry intake
│   │   ├── AiCounsellor.tsx             # Interactive student chat, voice notes, test prompts
│   │   ├── AppointmentsPage.tsx         # Demo calendar, slot capacity management
│   │   ├── FollowUpsPage.tsx            # Counsellor tasks, overdue alerts, pre-drafted messages
│   │   ├── KnowledgeBasePage.tsx        # Course catalog, verification toggle, syllabus, fees
│   │   ├── AnalyticsPage.tsx            # Attribution formulas, conversion rates, charts
│   │   └── SettingsPage.tsx             # Gemini API config, integration status, audit logs
│   ├── services/
│   │   ├── db.ts                        # Persistent storage service with 12+ realistic Indian leads
│   │   ├── ai.ts                        # Multilingual RAG engine, Gemini API caller, safety filter
│   │   ├── scoring.ts                   # 0-100 scoring engine, objection detector, next-best action
│   │   ├── identity.ts                  # Indian phone normalization (+91) & deduplication
│   │   └── voice.ts                     # Web Speech API recognition (en-IN, hi-IN, mr-IN)
│   ├── test/
│   │   └── suite.ts                     # 24-point automated test suite
│   ├── types/
│   │   └── index.ts                     # Strongly-typed TypeScript interfaces
│   ├── App.tsx                          # Router, global modal coordinators
│   └── main.tsx                         # Entry point
├── supabase/
│   └── schema.sql                       # Full PostgreSQL schema with RLS policies & constraints
├── tailwind.config.js                   # Navy blue & teal theme configuration
├── tsconfig.json                        # TypeScript configuration
└── package.json
```

---

## 🧑‍💻 Three Role Personas

Switch between personas in 1-click via the top navigation dropdown:

1. **Prospective Student** (e.g. *Pooja Deshmukh*)
   - Chat with the AI Counsellor in English, Hindi, or Marathi.
   - Ask about career transitions, eligibility, fees, and EMI schedules.
   - Take the 3-minute Adaptive Aptitude Assessment.
   - View available demo slots and book a free live class.

2. **Admissions Counsellor** (e.g. *Priya Joshi* or *Vikram Mehta*)
   - Inspect assigned leads with explainable 0–100 scores and 3-line summaries.
   - Review detected objections and evidence quotes.
   - Review pre-drafted suggested follow-up messages.
   - Click **Take Over Conversation** to pause AI auto-replies and chat directly with student.
   - Complete follow-up tasks and resolve duplicate leads.

3. **Administrator** (e.g. *Dr. Rajesh Sharma, Academic Director*)
   - Toggle **Verified Authoritative** status on course curricula and fee structures.
   - View institute-wide analytics and conversion funnel attribution.
   - Inspect immutable audit logs of all human takeovers and record merges.
   - Configure Gemini API keys and integration settings.

---

## 🛡️ AI Safety & Anti-Hallucination Rules

The AI Admissions Counsellor strictly enforces four ethical safeguards:
1. **Zero Hallucinated Fees or Discounts**: The model only states fees and discounts explicitly present in verified knowledge base records.
2. **No Guaranteed Placement or Stamp-Paper Promises**: When students ask for "100% job guarantee on stamp paper", the model politely clarifies that reputable institutes provide audited placement assistance, resume workshops, and campus drives, but do not provide false guarantees.
3. **Empathetic Study-Gap Support**: Acknowledges non-IT backgrounds (B.Com, B.A., Mechanical) and study gaps with portfolio-driven reassurance.
4. **One-Question-at-a-Time**: Avoids overwhelming students with large questionnaires.

---

## 🧪 Automated Test Suite (24 Verification Points)

Run the automated test suite anytime with:
```bash
npx tsx src/test/suite.ts
```

### Verified Points:
- [x] **Indian Phone Normalization**: Normalizes 10-digit, 11-digit (leading 0), and +91 formats to `+91 XXXXX XXXXX`.
- [x] **Multi-Channel Identity Resolution**: Detects exact phone matches (95% confidence) and email matches (90% confidence) while flagging similar names for counsellor review.
- [x] **Multilingual Language Detection**: Accurately classifies pure English, Hindi (Devanagari), Marathi (Devanagari), and natural code-switching (Hinglish/Maranglish).
- [x] **Evidence-Based Objection Detection**: Identifies fees/discounts, placement guarantee demands, study gaps, lack of confidence, and family approval concerns.
- [x] **Lead Scoring Breakdown**: Tests 0–100 range, Hot (70-100), Warm (40-69), Cold (0-39) thresholds, and itemized rationale generation.
- [x] **Next-Best-Action Prediction**: Validates action recommendations for demo bookings, qualified leads, and confirmed admissions.
- [x] **RAG Knowledge Base Grounding**: Asserts factual retrieval of course fees, schedules, and verified placement statistics.

---

## 💾 Supabase Database Schema

A production-grade PostgreSQL migration file is included at [`supabase/schema.sql`](supabase/schema.sql) featuring:
- Tables: `staff_profiles`, `courses`, `leads`, `lead_objections`, `conversations`, `messages`, `appointment_slots`, `appointments`, `follow_up_tasks`, `aptitude_assessments`, `audit_logs`.
- Foreign keys, UUID primary keys, and composite indexes.
- Database constraint `unique_lead_slot_booking` preventing duplicate demo bookings.
- Row Level Security (RLS) policies ensuring unauthenticated users cannot read staff records or private student data.

---

## 📋 Hackathon Verification Checklist

| Requirement | Status | Implementation Details |
|---|---|---|
| **Overview Dashboard** | ✅ Complete | Live KPI cards, pipeline funnel, conversion metrics, hot leads list |
| **Lead Management Desk** | ✅ Complete | Search, stage/score/source filters, pagination, lead drawer |
| **Multilingual AI Counsellor** | ✅ Complete | English, Hindi, Marathi, Hinglish, voice notes, sample test prompts |
| **Verified Knowledge Base** | ✅ Complete | Administrator verification toggle, syllabus, fees, discounts |
| **Lead Scoring Engine** | ✅ Complete | 0–100 score, itemized 5-dimension breakdown, Hot/Warm/Cold tiers |
| **Objection Detection** | ✅ Complete | Supporting quotes, confidence scores, suggested rebuttals |
| **Adaptive Aptitude Test** | ✅ Complete | 4 adaptive questions, multilingual (en/hi/mr), instant course match |
| **Demo Class Booking** | ✅ Complete | Conflict-free database slots, capacity validation, cancellation |
| **Human Takeover** | ✅ Complete | Pauses AI replies, enables counsellor messaging, audit logged |
| **Attribution Analytics** | ✅ Complete | Explicit mathematical formulas, channel conversions, counsellor stats |
| **Identity Resolution** | ✅ Complete | Indian +91 normalization, duplicate match modal, authorized merge |
| **Speech-to-Text Voice Notes** | ✅ Complete | Browser Web Speech API (`en-IN`, `hi-IN`, `mr-IN`) with transcript edit |
| **Demo Data Seed** | ✅ Complete | 12+ rich realistic Indian student leads, courses, slots, and tasks |
| **Tested Build** | ✅ Complete | 24/24 automated tests passing, clean Vite production bundle |

---

## 👥 Hackathon Team & Credits
- **Built for**: 24-Hour Hackathon
- **Team**: 4 Beginner Student Developers
- **Target Audience**: Indian Colleges, Bootcamps, Vocational Institutes, and EdTech Platforms
- **License**: MIT
