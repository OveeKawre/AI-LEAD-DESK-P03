import {
  Lead,
  Course,
  Conversation,
  ConversationMessage,
  AppointmentSlot,
  Appointment,
  FollowUpTask,
  AuditLog,
  StaffProfile,
  IntegrationConfig,
  AptitudeQuestion,
  AptitudeResult
} from '../types';

const STORAGE_KEYS = {
  LEADS: 'ai_lead_desk_leads_v2',
  COURSES: 'ai_lead_desk_courses_v2',
  CONVERSATIONS: 'ai_lead_desk_conversations_v2',
  MESSAGES: 'ai_lead_desk_messages_v2',
  SLOTS: 'ai_lead_desk_slots_v2',
  APPOINTMENTS: 'ai_lead_desk_appointments_v2',
  FOLLOW_UPS: 'ai_lead_desk_followups_v2',
  AUDIT_LOGS: 'ai_lead_desk_audit_v2',
  STAFF: 'ai_lead_desk_staff_v2',
  INTEGRATIONS: 'ai_lead_desk_integrations_v2',
  APTITUDE_RESULTS: 'ai_lead_desk_aptitude_v2',
  CURRENT_USER: 'ai_lead_desk_current_user_v2'
};

export const INITIAL_STAFF: StaffProfile[] = [
  {
    id: 'staff-1',
    name: 'Priya Joshi',
    email: 'priya.joshi@aileaddesk.edu',
    role: 'Admissions Counsellor',
    phone: '+91 98220 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    assignedLeadsCount: 6,
    activeStatus: 'Online'
  },
  {
    id: 'staff-2',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@aileaddesk.edu',
    role: 'Admissions Counsellor',
    phone: '+91 98220 54321',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    assignedLeadsCount: 5,
    activeStatus: 'In Counselling'
  },
  {
    id: 'staff-admin',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@aileaddesk.edu',
    role: 'Administrator',
    phone: '+91 98220 99999',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    assignedLeadsCount: 0,
    activeStatus: 'Online'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-1',
    code: 'FSD-101',
    name: 'Full Stack Web Development (MERN & Cloud)',
    description: 'Comprehensive, industry-aligned bootcamp covering React, Node.js, Express, MongoDB, TypeScript, Git, and AWS deployment with hands-on capstone projects.',
    eligibility: 'Any graduate (B.E., B.Com, B.Sc., B.A.) or final year student. No prior coding background strictly required.',
    duration: '6 Months (24 Weeks, 360 Hours)',
    fees: 55000,
    currency: 'INR',
    paymentTerms: 'Pay in 3 zero-interest instalments (₹19,000 + ₹18,000 + ₹18,000) or No-Cost EMI starting from ₹4,999/month via partner NBFCs.',
    approvedDiscounts: [
      { code: 'EARLYBIRD10', description: 'Early Enrollment Discount', percentage: 10, conditions: 'Valid when booking 14 days prior to batch start date' },
      { code: 'MERIT15', description: 'Aptitude Test Merit Discount', percentage: 15, conditions: 'Requires scoring 80%+ on adaptive aptitude assessment' }
    ],
    schedules: ['Weekday Morning: 8:00 AM - 10:30 AM', 'Weekday Evening: 6:30 PM - 9:00 PM', 'Weekend Intensive: Sat-Sun 10:00 AM - 3:00 PM'],
    deliveryMode: 'Hybrid',
    syllabus: [
      { moduleName: 'Frontend Architecture', topics: ['HTML5, Modern CSS, Tailwind', 'JavaScript ES6+, TypeScript', 'React 18 & State Management'], durationWeeks: 8 },
      { moduleName: 'Backend & Databases', topics: ['Node.js & Express REST APIs', 'MongoDB & PostgreSQL Essentials', 'Authentication (JWT, OAuth)'], durationWeeks: 8 },
      { moduleName: 'DevOps & Capstone Projects', topics: ['Docker Basics, CI/CD', 'AWS S3 & EC2 Deployment', 'Full Production Capstone Project'], durationWeeks: 8 }
    ],
    demoDetails: 'Live 90-minute interactive coding session building a real-time web application with instructor Q&A.',
    placementSupport: 'Dedicated placement cell offering 1-on-1 resume reviews, mock technical interviews, and access to 180+ hiring partner drives.',
    verifiedPlacementStats: '84% placement rate in 2025-26 batches; median CTC ₹4.8 LPA, highest CTC ₹12.4 LPA (Verified by Audited Placement Records).',
    sourceReference: 'Academic Senate Circular Ref #ACA-2026-FSD-01',
    lastVerifiedDate: '2026-09-15',
    verifiedBy: 'Dr. Rajesh Sharma (Director of Academics)',
    isActive: true,
    isVerified: true
  },
  {
    id: 'crs-2',
    code: 'DSAI-201',
    name: 'Data Science & AI Engineering with Python',
    description: 'Practical data science program covering Python for analytics, SQL, pandas, statistical modeling, machine learning, and Generative AI foundations.',
    eligibility: 'Graduate in Science, Engineering, Mathematics, Economics, or Commerce with basic numeracy skills.',
    duration: '7 Months (28 Weeks, 420 Hours)',
    fees: 68000,
    currency: 'INR',
    paymentTerms: 'Initial registration ₹15,000 followed by 4 monthly instalments of ₹13,250 each.',
    approvedDiscounts: [
      { code: 'WOMENINTECH15', description: 'Women in Tech Scholarship', percentage: 15, conditions: 'Applicable for eligible female applicants' },
      { code: 'EARLYBIRD10', description: 'Early Enrollment', percentage: 10, conditions: 'Valid when enrolling 14 days before batch launch' }
    ],
    schedules: ['Weekday Evening: 7:00 PM - 9:30 PM', 'Weekend Intensive: Sat-Sun 9:30 AM - 2:30 PM'],
    deliveryMode: 'Hybrid',
    syllabus: [
      { moduleName: 'Python & Data Wrangling', topics: ['Advanced Python, NumPy, Pandas', 'Data Cleaning & Exploratory Analysis', 'Interactive Dashboards (Streamlit)'], durationWeeks: 8 },
      { moduleName: 'Machine Learning & SQL', topics: ['Supervised & Unsupervised ML', 'Scikit-learn, Feature Engineering', 'Relational SQL & Database Analytics'], durationWeeks: 10 },
      { moduleName: 'Deep Learning & GenAI', topics: ['Neural Networks (PyTorch)', 'LLMs, Prompt Engineering, RAG Systems', 'End-to-end ML Pipeline Deployment'], durationWeeks: 10 }
    ],
    demoDetails: 'Hands-on session on building an AI data predictor from scratch using Python notebooks.',
    placementSupport: 'Portfolio development on GitHub/Kaggle, mock domain interviews, and priority hiring partner referrals.',
    verifiedPlacementStats: '79% placement within 180 days; median CTC ₹5.6 LPA (Placement Audit Report Q2 2026).',
    sourceReference: 'Faculty Board Resolution #FBR-DS-2026',
    lastVerifiedDate: '2026-09-20',
    verifiedBy: 'Dr. Rajesh Sharma (Director of Academics)',
    isActive: true,
    isVerified: true
  },
  {
    id: 'crs-3',
    code: 'CLD-301',
    name: 'Cloud Computing & DevOps Masterclass (AWS & Docker)',
    description: 'Hands-on cloud engineering track focusing on Linux, AWS Core Services, Containerisation with Docker, Kubernetes orchestration, and CI/CD automation.',
    eligibility: 'IT/Computer Science diploma/degree holders or working IT professionals with basic networking/command-line familiarity.',
    duration: '5 Months (20 Weeks, 300 Hours)',
    fees: 48000,
    currency: 'INR',
    paymentTerms: 'Down payment of ₹12,000 + 3 instalments of ₹12,000.',
    approvedDiscounts: [
      { code: 'CORP10', description: 'Alumni & Referral Discount', percentage: 10, conditions: 'Requires referral code from enrolled student' }
    ],
    schedules: ['Weekend Masterclass: Sat-Sun 10:00 AM - 3:00 PM', 'Weekday Early Morning: 7:00 AM - 9:00 AM'],
    deliveryMode: 'Online',
    syllabus: [
      { moduleName: 'Linux & Cloud Fundamentals', topics: ['Linux Administration & Bash Scripting', 'Networking & Security Foundations', 'AWS Core (EC2, VPC, S3, IAM)'], durationWeeks: 7 },
      { moduleName: 'Containers & Orchestration', topics: ['Docker Packaging & Multi-container Apps', 'Kubernetes Cluster Architecture', 'Helm Charts & Configuration'], durationWeeks: 7 },
      { moduleName: 'CI/CD & Infrastructure as Code', topics: ['GitHub Actions, Jenkins Pipelines', 'Terraform Fundamentals', 'Monitoring with Prometheus & Grafana'], durationWeeks: 6 }
    ],
    demoDetails: 'Live cloud deployment demo: launching and load-balancing a containerized microservice on AWS.',
    placementSupport: 'AWS certification exam guidance vouchers, DevOps scenario interview prep, and corporate introductions.',
    verifiedPlacementStats: '87% placement for eligible students; median CTC ₹6.2 LPA.',
    sourceReference: 'DevOps Council Accreditation DOC-2026',
    lastVerifiedDate: '2026-08-30',
    verifiedBy: 'Dr. Rajesh Sharma (Director of Academics)',
    isActive: true,
    isVerified: true
  },
  {
    id: 'crs-4',
    code: 'UIUX-401',
    name: 'UI/UX Product Design & Frontend Fundamentals',
    description: 'Learn modern user research, wireframing, Figma design systems, usability testing, and foundational HTML/CSS/Tailwind for interactive prototyping.',
    eligibility: 'Open to creative thinkers from any educational background (Arts, Design, Commerce, Tech).',
    duration: '4 Months (16 Weeks, 240 Hours)',
    fees: 38000,
    currency: 'INR',
    paymentTerms: 'Pay in 2 instalments of ₹19,000 each or easy EMI.',
    approvedDiscounts: [
      { code: 'CREATIVE10', description: 'Creative Portfolio Discount', percentage: 10, conditions: 'Awarded on review of candidate design samples' }
    ],
    schedules: ['Weekday Evening: 6:00 PM - 8:30 PM', 'Weekend Batch: Sat-Sun 2:00 PM - 7:00 PM'],
    deliveryMode: 'Hybrid',
    syllabus: [
      { moduleName: 'Design Thinking & Research', topics: ['User Personas & Journey Mapping', 'Information Architecture', 'Competitor Analysis'], durationWeeks: 5 },
      { moduleName: 'Figma Mastery & Prototyping', topics: ['Auto-layout & Component Libraries', 'Interactive Micro-animations', 'Design Systems & Tokens'], durationWeeks: 6 },
      { moduleName: 'Usability Testing & Design Handoff', topics: ['Heuristic Evaluation', 'Design Handoff to Developers', 'Live Portfolio Case Studies'], durationWeeks: 5 }
    ],
    demoDetails: 'Interactive workshop: redesigning a popular mobile banking app flow in Figma in 60 minutes.',
    placementSupport: 'Behance/Dribbble portfolio review by senior UX leads, mock design presentations.',
    verifiedPlacementStats: '76% placement within 4 months; median CTC ₹4.2 LPA.',
    sourceReference: 'Design Advisory Board #DAB-2026',
    lastVerifiedDate: '2026-09-10',
    verifiedBy: 'Dr. Rajesh Sharma (Director of Academics)',
    isActive: true,
    isVerified: true
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Pooja Deshmukh',
    rawPhone: '09823412345',
    normalizedPhone: '+91 98234 12345',
    email: 'pooja.deshmukh99@gmail.com',
    preferredLanguage: 'Mixed/Hinglish',
    educationBackground: 'B.Com (Commerce)',
    graduationYear: 2022,
    studyGapYears: 2,
    careerGoal: 'Transition into software development / Web developer',
    courseInterest: 'Full Stack Web Development (MERN & Cloud)',
    budgetRange: '₹40,000 - ₹55,000 with EMI option',
    preferredSchedule: 'Weekday Evening: 6:30 PM - 9:00 PM',
    source: 'WhatsApp',
    stage: 'Qualified',
    score: 82,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 23,
      engagement: 18,
      eligibilityAlignment: 17,
      demoIntent: 14,
      responsiveness: 10,
      total: 82,
      reasons: [
        'Expressed high motivation for coding transition despite commerce background',
        'Responsive to 3 WhatsApp follow-ups within 20 minutes',
        'Wants evening batch schedule to balance current family commitments',
        'Shared budget range and requested EMI details'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-1',
        category: 'Study gap',
        supportingQuote: 'I have a 2-year gap after B.Com. Will IT companies hire someone from non-tech with a gap?',
        confidence: 94,
        suggestedResponse: 'Explain that 42% of our successful alumni come from non-IT streams. Emphasize project portfolio and live capstones that prove hands-on skills regardless of previous degree.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-15T14:20:00Z'
      },
      {
        id: 'obj-2',
        category: 'Fees or affordability',
        supportingQuote: 'Can I pay in monthly instalments rather than one upfront payment?',
        confidence: 88,
        suggestedResponse: 'Share verified zero-cost EMI terms of ₹4,999/month through partner NBFCs without interest markup.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-15T14:22:00Z'
      }
    ],
    summary: 'Commerce graduate (2022) with 2-year gap keen on MERN stack. Concerned about non-tech background and gap year acceptance. Looking for evening batch and EMI payment options.',
    lastInteraction: '2026-10-16T11:45:00Z',
    suggestedNextAction: {
      action: 'Offer an available demo slot',
      reason: 'Student is qualified and anxious about learning curve; a demo session will showcase practical hands-on teaching style.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'Hi Pooja! Many successful developers in our batch started from commerce backgrounds just like you. Would you like to attend our upcoming live interactive coding demo this Saturday at 11:00 AM?',
      recommendedDate: '2026-10-17T10:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T10:00:00Z',
    assignedCounsellor: 'Priya Joshi',
    communicationConsent: true,
    createdAt: '2026-10-14T09:30:00Z',
    updatedAt: '2026-10-16T11:45:00Z',
    isArchived: false
  },
  {
    id: 'lead-102',
    name: 'Swapnil Kadam',
    rawPhone: '+919922114455',
    normalizedPhone: '+91 99221 14455',
    email: 'swapnil.kadam@rediffmail.com',
    preferredLanguage: 'Marathi',
    educationBackground: '12th Science (HSC)',
    graduationYear: 2024,
    careerGoal: 'Software programmer / coding job',
    courseInterest: 'Full Stack Web Development (MERN & Cloud)',
    budgetRange: 'Seeking scholarship or low fees',
    preferredSchedule: 'Weekday Morning: 8:00 AM - 10:30 AM',
    source: 'Website',
    stage: 'Demo Booked',
    score: 88,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 24,
      engagement: 19,
      eligibilityAlignment: 18,
      demoIntent: 18,
      responsiveness: 9,
      total: 88,
      reasons: [
        'Enquired in Marathi: "मला coding शिकायचं आहे, पण english चा problem आहे"',
        'Successfully booked a Demo Class for Saturday',
        'Took aptitude assessment and scored 75/100 with high logic marks'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-3',
        category: 'Lack of confidence',
        supportingQuote: 'माझं इंग्रजी कच्चं आहे, मला मराठीत मार्गदर्शन मिळेल का?',
        confidence: 96,
        suggestedResponse: 'Assure that instructors provide bilingual explanations (Marathi + English) and technical communication workshops to build English interview confidence.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-15T18:10:00Z'
      }
    ],
    summary: '12th Science student comfortable in Marathi asking for bilingual coding training. Highly motivated, scored well on logical test, and already booked Saturday demo.',
    lastInteraction: '2026-10-16T15:10:00Z',
    suggestedNextAction: {
      action: 'Schedule a follow-up',
      reason: 'Send Marathi reminder and pre-demo preparation link before Saturday session.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'नमस्कार स्वप्निल! शनिवारी सकाळी ११ वाजता होणाऱ्या मोफत प्रॅक्टिकल कोडिंग डेमोसाठी तुमची नोंदणी झाली आहे. तुम्हाला क्लास जॉइन करण्याची लिंक एसएमएस व व्हॉट्सॲपवर पाठवली आहे.',
      recommendedDate: '2026-10-17T09:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T09:00:00Z',
    assignedCounsellor: 'Priya Joshi',
    communicationConsent: true,
    createdAt: '2026-10-15T10:15:00Z',
    updatedAt: '2026-10-16T15:10:00Z',
    isArchived: false
  },
  {
    id: 'lead-103',
    name: 'Rohit Verma',
    rawPhone: '9819988776',
    normalizedPhone: '+91 98199 88776',
    email: 'rohit.verma.engg@gmail.com',
    preferredLanguage: 'English',
    educationBackground: 'B.E. Mechanical Engineering',
    graduationYear: 2021,
    careerGoal: 'Data Scientist / Machine Learning Engineer',
    courseInterest: 'Data Science & AI Engineering with Python',
    budgetRange: 'Company reimbursement / self-funded ₹60,000+',
    preferredSchedule: 'Weekend Intensive: Sat-Sun 9:30 AM - 2:30 PM',
    source: 'Instagram',
    stage: 'AI Counselling',
    score: 74,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 22,
      engagement: 16,
      eligibilityAlignment: 19,
      demoIntent: 8,
      responsiveness: 9,
      total: 74,
      reasons: [
        'Currently working in mechanical design; seeks higher compensation in AI track',
        'Strong math and analytical grounding from engineering degree',
        'Asked detailed questions about GenAI module and syllabus depth'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-4',
        category: 'Time constraints',
        supportingQuote: 'I have 10-hour work shifts on weekdays. Can I complete this course only on weekends?',
        confidence: 91,
        suggestedResponse: 'Highlight our 28-week dedicated weekend intensive track with recorded lectures and weekday evening asynchronous doubt resolution channels.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-16T12:00:00Z'
      }
    ],
    summary: 'Working mechanical engineer seeking pivot into AI/Data Science. Strong mathematical foundation, restricted to weekend batches due to day job.',
    lastInteraction: '2026-10-16T12:05:00Z',
    suggestedNextAction: {
      action: 'Share verified course information',
      reason: 'Send weekend syllabus breakdown and AI portfolio capstone project details.',
      preferredChannel: 'Email',
      suggestedMessage: 'Dear Rohit, Here is the detailed syllabus for the Weekend Data Science & GenAI cohort, designed specifically for working professionals.',
      recommendedDate: '2026-10-16T19:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T11:00:00Z',
    assignedCounsellor: 'Vikram Mehta',
    communicationConsent: true,
    createdAt: '2026-10-16T08:00:00Z',
    updatedAt: '2026-10-16T12:05:00Z',
    isArchived: false
  },
  {
    id: 'lead-104',
    name: 'Ananya Patel',
    rawPhone: '+91 97665 43210',
    normalizedPhone: '+91 97665 43210',
    email: 'ananya.p.designs@outlook.com',
    preferredLanguage: 'English',
    educationBackground: 'B.A. Graphic Design / Fine Arts',
    graduationYear: 2023,
    careerGoal: 'UI/UX Product Designer in tech product company',
    courseInterest: 'UI/UX Product Design & Frontend Fundamentals',
    budgetRange: '₹35,000 - ₹40,000',
    preferredSchedule: 'Weekday Evening: 6:00 PM - 8:30 PM',
    source: 'Website',
    stage: 'Admission Confirmed',
    score: 95,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 25,
      engagement: 20,
      eligibilityAlignment: 20,
      demoIntent: 18,
      responsiveness: 12,
      total: 95,
      reasons: [
        'Attended UI/UX live demo and rated session 5/5',
        'Submitted creative portfolio and qualified for CREATIVE10 discount',
        'Initial fee installment paid and seat reserved for Nov batch'
      ]
    },
    detectedObjections: [],
    summary: 'Graphic design graduate admitted to UI/UX product design cohort with CREATIVE10 scholarship. Completed onboarding paperwork.',
    lastInteraction: '2026-10-16T16:00:00Z',
    suggestedNextAction: {
      action: 'Assign a human counsellor',
      reason: 'Coordinate LMS onboarding and welcome kit dispatch.',
      preferredChannel: 'Phone Call',
      suggestedMessage: 'Welcome to AI Lead Desk! Your LMS credentials and cohort orientation schedule have been generated.',
      recommendedDate: '2026-10-18T10:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-18T10:00:00Z',
    assignedCounsellor: 'Vikram Mehta',
    communicationConsent: true,
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-10-16T16:00:00Z',
    isArchived: false
  },
  {
    id: 'lead-105',
    name: 'Suresh Chavan',
    rawPhone: '09822199881',
    normalizedPhone: '+91 98221 99881',
    email: 'suresh.chavan77@yahoo.in',
    preferredLanguage: 'Marathi',
    educationBackground: 'Diploma in Electrical Engg',
    graduationYear: 2020,
    studyGapYears: 4,
    careerGoal: 'IT Cloud Administrator / Systems Support',
    courseInterest: 'Cloud Computing & DevOps Masterclass (AWS & Docker)',
    budgetRange: 'Low budget, needs family approval',
    preferredSchedule: 'Weekend Masterclass',
    source: 'Walk-in',
    stage: 'Follow-up Required',
    score: 58,
    temperature: 'Warm',
    scoreBreakdown: {
      courseInterest: 18,
      engagement: 12,
      eligibilityAlignment: 15,
      demoIntent: 7,
      responsiveness: 6,
      total: 58,
      reasons: [
        'Walk-in enquiry at Pune learning centre',
        'Father accompanying student asked about job security and fees',
        'Needs approval from family before financial commitment'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-5',
        category: 'Family approval',
        supportingQuote: 'माझे वडील विचारत आहेत की इतके पैसे भरून नक्की नोकरी मिळेल का?',
        confidence: 95,
        suggestedResponse: 'Offer a direct 15-minute face-to-face or video counselling session for student and parents with our senior counsellor to review verified alumni placement records transparently without pressure.',
        requiresHumanIntervention: true,
        detectedAt: '2026-10-15T16:30:00Z'
      },
      {
        id: 'obj-6',
        category: 'Job or placement concerns',
        supportingQuote: 'Is placement 100% guaranteed in writing?',
        confidence: 93,
        suggestedResponse: 'Politely clarify that ethical institutes provide audited placement assistance, interview drives, and mock preparation, but do not provide false guarantees.',
        requiresHumanIntervention: true,
        detectedAt: '2026-10-15T16:35:00Z'
      }
    ],
    summary: 'Electrical diploma holder with 4-year gap considering Cloud/DevOps. Father requires clarity on fees and realistic placement prospects. Requires human counsellor intervention.',
    lastInteraction: '2026-10-15T17:00:00Z',
    suggestedNextAction: {
      action: 'Assign a human counsellor',
      reason: 'Objection requires parental counselling and verified placement data explanation.',
      preferredChannel: 'Phone Call',
      suggestedMessage: 'नमस्कार सुरेशजी, तुमच्या वडिलांशी व तुमच्याशी कोर्स व करिअर संधींबद्दल चर्चा करण्यासाठी आपल्या वरिष्ठ काउन्सेलरशी कॉल शेड्यूल करूया का?',
      recommendedDate: '2026-10-17T11:30:00Z',
      requiresApproval: true
    },
    followUpDueDate: '2026-10-17T11:30:00Z',
    assignedCounsellor: 'Vikram Mehta',
    communicationConsent: true,
    createdAt: '2026-10-15T15:00:00Z',
    updatedAt: '2026-10-15T17:00:00Z',
    isArchived: false
  },
  {
    id: 'lead-106',
    name: 'Neha Kulkarni',
    rawPhone: '+91 94220 88771',
    normalizedPhone: '+91 94220 88771',
    email: 'neha.kulkarni@gmail.com',
    preferredLanguage: 'English',
    educationBackground: 'B.Sc. Computer Science',
    graduationYear: 2024,
    careerGoal: 'MERN Stack Developer',
    courseInterest: 'Full Stack Web Development (MERN & Cloud)',
    budgetRange: 'Standard fee is fine',
    preferredSchedule: 'Weekday Morning: 8:00 AM - 10:30 AM',
    source: 'Website',
    stage: 'Demo Completed',
    score: 91,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 24,
      engagement: 19,
      eligibilityAlignment: 20,
      demoIntent: 16,
      responsiveness: 12,
      total: 91,
      reasons: [
        'Attended live coding demo yesterday, engaged in live chat Q&A',
        'Scored 90% on aptitude test, eligible for MERIT15 discount',
        'Requested enrollment link and batch confirmation'
      ]
    },
    detectedObjections: [],
    summary: 'B.Sc. CS graduate who completed live demo yesterday. Scored top tier in aptitude assessment (90%). Ready for enrollment with MERIT15 coupon.',
    lastInteraction: '2026-10-16T10:20:00Z',
    suggestedNextAction: {
      action: 'Share verified course information',
      reason: 'Send formal admission offer letter with verified 15% merit discount voucher.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'Hi Neha! Congratulations on your stellar 90% aptitude score! Here is your verified MERIT15 discount code and enrollment link for Monday morning batch.',
      recommendedDate: '2026-10-16T17:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-16T17:00:00Z',
    assignedCounsellor: 'Priya Joshi',
    communicationConsent: true,
    createdAt: '2026-10-12T14:00:00Z',
    updatedAt: '2026-10-16T10:20:00Z',
    isArchived: false
  },
  {
    id: 'lead-107',
    name: 'Vikas Gaikwad',
    rawPhone: '09890123999',
    normalizedPhone: '+91 98901 23999',
    email: 'vikas.g91@gmail.com',
    preferredLanguage: 'Hindi',
    educationBackground: 'B.A. History',
    graduationYear: 2019,
    studyGapYears: 5,
    careerGoal: 'Uncertain, wants high salary job quickly',
    courseInterest: 'Data Science & AI Engineering with Python',
    budgetRange: 'Demanding 50% discount or free training',
    preferredSchedule: 'Self-paced',
    source: 'Instagram',
    stage: 'Not Interested',
    score: 28,
    temperature: 'Cold',
    scoreBreakdown: {
      courseInterest: 10,
      engagement: 6,
      eligibilityAlignment: 6,
      demoIntent: 3,
      responsiveness: 3,
      total: 28,
      reasons: [
        'Demanded unauthorised 50% discount not approved in policy',
        'Refused to participate in counseling questions or aptitude test',
        'Looking for 100% written salary guarantee of ₹10 LPA within 2 months'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-7',
        category: 'Fees or affordability',
        supportingQuote: 'Can you give me 50% discount? Otherwise I will not join.',
        confidence: 96,
        suggestedResponse: 'State politely that our fees are fixed to maintain batch quality and mentorship ratios, and share approved merit/early-bird scholarships.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-14T11:00:00Z'
      },
      {
        id: 'obj-8',
        category: 'Job or placement concerns',
        supportingQuote: 'Will you guarantee ₹10 Lakh salary in writing on stamp paper?',
        confidence: 98,
        suggestedResponse: 'Clarify that ethical educational institutions do not issue stamp paper salary guarantees.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-14T11:05:00Z'
      }
    ],
    summary: 'B.A. graduate demanding unauthorized 50% fee discount and guaranteed ₹10 LPA placement on stamp paper. Not aligned with educational prerequisites.',
    lastInteraction: '2026-10-14T11:30:00Z',
    suggestedNextAction: {
      action: 'Mark the lead as not interested',
      reason: 'Unrealistic demands contrary to institute compliance and ethical guidelines.',
      preferredChannel: 'In-App',
      suggestedMessage: 'We appreciate your interest. Currently our programs do not match your requested terms. We wish you the best in your career pursuits.',
      recommendedDate: '2026-10-14T12:00:00Z',
      requiresApproval: true
    },
    followUpDueDate: '2026-10-20T10:00:00Z',
    assignedCounsellor: 'Vikram Mehta',
    communicationConsent: false,
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-14T11:30:00Z',
    isArchived: false
  },
  {
    id: 'lead-108',
    name: 'Rahul Sharma',
    rawPhone: '+919823411223',
    normalizedPhone: '+91 98234 11223',
    email: 'rahul.sharma.dev@gmail.com',
    preferredLanguage: 'English',
    educationBackground: 'B.Tech IT',
    graduationYear: 2023,
    careerGoal: 'DevOps / Cloud Specialist',
    courseInterest: 'Cloud Computing & DevOps Masterclass (AWS & Docker)',
    budgetRange: 'Company sponsored ₹50,000',
    preferredSchedule: 'Weekend Masterclass',
    source: 'Website',
    stage: 'Qualified',
    score: 79,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 23,
      engagement: 17,
      eligibilityAlignment: 19,
      demoIntent: 11,
      responsiveness: 9,
      total: 79,
      reasons: [
        'Enquired via Website after previously submitting an Instagram lead form',
        'Strong technical background and Linux proficiency',
        'Matched with existing contact record on normalized phone +91 98234 11223'
      ]
    },
    detectedObjections: [],
    summary: 'B.Tech IT with strong technical profile. Enquired twice across Instagram and Website; phone number match identified duplicate enquiry candidate for unified record.',
    lastInteraction: '2026-10-16T14:15:00Z',
    suggestedNextAction: {
      action: 'Offer an available demo slot',
      reason: 'Lead profile matches AWS DevOps cohort requirements; schedule live cloud lab demo.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'Hi Rahul! We noticed your enquiry regarding the Cloud & DevOps Masterclass. Would you like to attend our upcoming live microservice deployment lab demo this Sunday at 10:00 AM?',
      recommendedDate: '2026-10-17T10:30:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T10:30:00Z',
    assignedCounsellor: 'Priya Joshi',
    communicationConsent: true,
    createdAt: '2026-10-16T09:00:00Z',
    updatedAt: '2026-10-16T14:15:00Z',
    isArchived: false,
    duplicateWarning: {
      matchedLeadId: 'lead-112',
      matchedLeadName: 'Rahul S. (Instagram)',
      matchReason: 'Exact normalized phone match (+91 98234 11223)',
      similarityScore: 95
    }
  },
  {
    id: 'lead-109',
    name: 'Kavita Jadhav',
    rawPhone: '09765433211',
    normalizedPhone: '+91 97654 33211',
    email: 'kavita.jadhav.m@gmail.com',
    preferredLanguage: 'Marathi',
    educationBackground: 'B.Sc. Chemistry',
    graduationYear: 2022,
    studyGapYears: 2,
    careerGoal: 'Software testing or Web development',
    courseInterest: 'Full Stack Web Development (MERN & Cloud)',
    budgetRange: 'EMI ₹4,500/month',
    preferredSchedule: 'Weekday Evening: 6:30 PM - 9:00 PM',
    source: 'Phone Call',
    stage: 'New',
    score: 64,
    temperature: 'Warm',
    scoreBreakdown: {
      courseInterest: 18,
      engagement: 14,
      eligibilityAlignment: 14,
      demoIntent: 9,
      responsiveness: 9,
      total: 64,
      reasons: [
        'Called admissions helpline after seeing local newspaper feature',
        'Non-IT science graduate asking if coding requires advanced mathematics',
        'Prefers Marathi communication'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-9',
        category: 'Lack of confidence',
        supportingQuote: 'माझं बॅकग्राउंड केमिस्ट्री आहे, मला कोडिंग जमेल का? खूप मॅथ्स असतं का?',
        confidence: 93,
        suggestedResponse: 'Clarify that web development requires logical problem solving rather than complex higher mathematics, and highlight foundational beginner modules.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-16T15:30:00Z'
      }
    ],
    summary: 'Chemistry graduate with 2-year gap worried about non-IT background and math requirements. Needs reassuring guidance in Marathi.',
    lastInteraction: '2026-10-16T15:45:00Z',
    suggestedNextAction: {
      action: 'Ask a relevant counselling question',
      reason: 'Assess her everyday comfort with computers and guide her through the adaptive logic test.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'नमस्कार कविताजी! वेब डेव्हलपमेंटसाठी अवघड गणिताची गरज नसते, फक्त बेसिक लॉजिक पुरेसे असते. तुम्ही आमची 3 मिनिटांची छोटी ॲप्टिट्यूड टेस्ट ट्राय करू इच्छिता का?',
      recommendedDate: '2026-10-17T12:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T12:00:00Z',
    assignedCounsellor: 'Priya Joshi',
    communicationConsent: true,
    createdAt: '2026-10-16T15:00:00Z',
    updatedAt: '2026-10-16T15:45:00Z',
    isArchived: false
  },
  {
    id: 'lead-110',
    name: 'Mohd. Faisal Khan',
    rawPhone: '+91 91580 77665',
    normalizedPhone: '+91 91580 77665',
    email: 'faisal.khan.ai@gmail.com',
    preferredLanguage: 'Hindi',
    educationBackground: 'B.C.A.',
    graduationYear: 2024,
    careerGoal: 'AI Engineer / Machine Learning Developer',
    courseInterest: 'Data Science & AI Engineering with Python',
    budgetRange: '₹60,000',
    preferredSchedule: 'Weekday Evening: 7:00 PM - 9:30 PM',
    source: 'Instagram',
    stage: 'Qualified',
    score: 84,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 23,
      engagement: 18,
      eligibilityAlignment: 19,
      demoIntent: 14,
      responsiveness: 10,
      total: 84,
      reasons: [
        'BCA fresher with foundational C++ and Python knowledge',
        'Requested syllabus for PyTorch and GenAI modules',
        'Has personal laptop and high bandwidth internet ready'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-10',
        category: 'Eligibility',
        supportingQuote: 'BCA walon ko MNCs mein data science role milta hai kya, ya sirf B.Tech walon ko?',
        confidence: 89,
        suggestedResponse: 'Explain that modern AI product teams prioritize demonstrable GitHub projects and Kaggle benchmarks over degree tags.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-16T13:10:00Z'
      }
    ],
    summary: 'BCA fresher with basic Python wanting to fast-track into AI engineering. Enquired in Hindi about industry perception of BCA versus B.Tech.',
    lastInteraction: '2026-10-16T13:30:00Z',
    suggestedNextAction: {
      action: 'Offer an available demo slot',
      reason: 'Invite to AI predictive modeling live session.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'नमस्ते फैसल! क्या आप इस रविवार को शाम 5 बजे होने वाले हमारे लाइव डेटा साइंस और AI प्रोजेक्ट वर्कशॉप में भाग लेना चाहेंगे?',
      recommendedDate: '2026-10-17T11:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T11:00:00Z',
    assignedCounsellor: 'Vikram Mehta',
    communicationConsent: true,
    createdAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-10-16T13:30:00Z',
    isArchived: false
  },
  {
    id: 'lead-111',
    name: 'Snehal Shinde',
    rawPhone: '+91 96570 12890',
    normalizedPhone: '+91 96570 12890',
    email: 'snehal.shinde.pune@gmail.com',
    preferredLanguage: 'Mixed/Hinglish',
    educationBackground: 'B.E. Civil Engineering',
    graduationYear: 2023,
    studyGapYears: 1,
    careerGoal: 'UI/UX Design / Frontend Development',
    courseInterest: 'UI/UX Product Design & Frontend Fundamentals',
    budgetRange: '₹35,000',
    preferredSchedule: 'Weekend Batch: Sat-Sun 2:00 PM - 7:00 PM',
    source: 'Referral',
    stage: 'AI Counselling',
    score: 71,
    temperature: 'Hot',
    scoreBreakdown: {
      courseInterest: 20,
      engagement: 16,
      eligibilityAlignment: 17,
      demoIntent: 9,
      responsiveness: 9,
      total: 71,
      reasons: [
        'Referred by current student Ananya Patel',
        'Interested in visual architecture and digital prototyping',
        'Civil engineering AutoCAD experience translates well to spatial design'
      ]
    },
    detectedObjections: [
      {
        id: 'obj-11',
        category: 'Course uncertainty',
        supportingQuote: 'I am confused between UI/UX design and Full Stack Coding. Which has faster hiring?',
        confidence: 88,
        suggestedResponse: 'Compare the day-to-day work: UI/UX focuses on user empathy, visual interfaces, and Figma; Full Stack focuses on logic and server databases. Recommend our 3-minute aptitude test.',
        requiresHumanIntervention: false,
        detectedAt: '2026-10-16T14:40:00Z'
      }
    ],
    summary: 'Civil engineer looking to switch industries. Confused between coding and design. Referred by existing batch student.',
    lastInteraction: '2026-10-16T14:50:00Z',
    suggestedNextAction: {
      action: 'Ask a relevant counselling question',
      reason: 'Offer aptitude diagnostic test to resolve course uncertainty.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: 'Hi Snehal! Since you are exploring both UI/UX and Web Development, taking our quick adaptive assessment will highlight whether your strengths lean towards visual problem solving or algorithmic logic.',
      recommendedDate: '2026-10-17T10:00:00Z',
      requiresApproval: false
    },
    followUpDueDate: '2026-10-17T10:00:00Z',
    assignedCounsellor: 'Vikram Mehta',
    communicationConsent: true,
    createdAt: '2026-10-16T11:00:00Z',
    updatedAt: '2026-10-16T14:50:00Z',
    isArchived: false
  },
  {
    id: 'lead-112',
    name: 'Rahul S. (Instagram)',
    rawPhone: '9823411223',
    normalizedPhone: '+91 98234 11223',
    email: 'rahul.s9823@gmail.com',
    preferredLanguage: 'English',
    educationBackground: 'IT Student',
    careerGoal: 'DevOps & Cloud Engineer',
    courseInterest: 'Cloud Computing & DevOps Masterclass (AWS & Docker)',
    budgetRange: 'Under ₹50k',
    preferredSchedule: 'Weekend Masterclass',
    source: 'Instagram',
    stage: 'New',
    score: 68,
    temperature: 'Warm',
    scoreBreakdown: {
      courseInterest: 20,
      engagement: 14,
      eligibilityAlignment: 18,
      demoIntent: 8,
      responsiveness: 8,
      total: 68,
      reasons: [
        'Instagram lead ad submission',
        'Shares same phone number (+91 98234 11223) as Lead #108'
      ]
    },
    detectedObjections: [],
    summary: 'Instagram enquiry with matching phone number to Lead #108. Flagged by identity resolution engine for unified record merge.',
    lastInteraction: '2026-10-16T08:30:00Z',
    suggestedNextAction: {
      action: 'Assign a human counsellor',
      reason: 'Review duplicate merge request to prevent duplicate outbound messages.',
      preferredChannel: 'In-App',
      suggestedMessage: 'Merge candidate pending counsellor verification.',
      recommendedDate: '2026-10-16T18:00:00Z',
      requiresApproval: true
    },
    followUpDueDate: '2026-10-17T09:30:00Z',
    assignedCounsellor: 'Priya Joshi',
    communicationConsent: true,
    createdAt: '2026-10-16T08:30:00Z',
    updatedAt: '2026-10-16T08:30:00Z',
    isArchived: false,
    duplicateWarning: {
      matchedLeadId: 'lead-108',
      matchedLeadName: 'Rahul Sharma',
      matchReason: 'Exact normalized phone match (+91 98234 11223)',
      similarityScore: 95
    }
  }
];

export const INITIAL_SLOTS: AppointmentSlot[] = [
  {
    id: 'slot-1',
    courseId: 'crs-1',
    courseName: 'Full Stack Web Development (MERN & Cloud)',
    date: '2026-10-18',
    time: '11:00 AM - 12:30 PM',
    counsellorName: 'Priya Joshi',
    mode: 'Online',
    venueOrLink: 'https://meet.google.com/xyz-lead-desk',
    capacity: 25,
    bookedCount: 18,
    status: 'Available'
  },
  {
    id: 'slot-2',
    courseId: 'crs-1',
    courseName: 'Full Stack Web Development (MERN & Cloud)',
    date: '2026-10-19',
    time: '06:30 PM - 08:00 PM',
    counsellorName: 'Priya Joshi',
    mode: 'Online',
    venueOrLink: 'https://meet.google.com/abc-mern-demo',
    capacity: 20,
    bookedCount: 20,
    status: 'Full'
  },
  {
    id: 'slot-3',
    courseId: 'crs-2',
    courseName: 'Data Science & AI Engineering with Python',
    date: '2026-10-18',
    time: '04:00 PM - 05:30 PM',
    counsellorName: 'Vikram Mehta',
    mode: 'Online',
    venueOrLink: 'https://meet.google.com/ds-ai-class',
    capacity: 30,
    bookedCount: 12,
    status: 'Available'
  },
  {
    id: 'slot-4',
    courseId: 'crs-3',
    courseName: 'Cloud Computing & DevOps Masterclass (AWS & Docker)',
    date: '2026-10-19',
    time: '10:00 AM - 11:30 AM',
    counsellorName: 'Vikram Mehta',
    mode: 'Offline Campus',
    venueOrLink: 'Lab 3B, Pune Tech Campus, Shivaji Nagar',
    capacity: 15,
    bookedCount: 8,
    status: 'Available'
  },
  {
    id: 'slot-5',
    courseId: 'crs-4',
    courseName: 'UI/UX Product Design & Frontend Fundamentals',
    date: '2026-10-20',
    time: '05:00 PM - 06:30 PM',
    counsellorName: 'Priya Joshi',
    mode: 'Online',
    venueOrLink: 'https://meet.google.com/uiux-design-lab',
    capacity: 25,
    bookedCount: 9,
    status: 'Available'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    leadId: 'lead-102',
    studentName: 'Swapnil Kadam',
    studentPhone: '+91 99221 14455',
    studentEmail: 'swapnil.kadam@rediffmail.com',
    slotId: 'slot-1',
    courseId: 'crs-1',
    courseName: 'Full Stack Web Development (MERN & Cloud)',
    date: '2026-10-18',
    time: '11:00 AM - 12:30 PM',
    mode: 'Online',
    venueOrLink: 'https://meet.google.com/xyz-lead-desk',
    status: 'Booked',
    counsellorName: 'Priya Joshi',
    notes: 'Requested Marathi bilingual explanation during demo session.',
    createdAt: '2026-10-15T18:20:00Z'
  },
  {
    id: 'app-2',
    leadId: 'lead-106',
    studentName: 'Neha Kulkarni',
    studentPhone: '+91 94220 88771',
    studentEmail: 'neha.kulkarni@gmail.com',
    slotId: 'slot-1',
    courseId: 'crs-1',
    courseName: 'Full Stack Web Development (MERN & Cloud)',
    date: '2026-10-15',
    time: '11:00 AM - 12:30 PM',
    mode: 'Online',
    venueOrLink: 'https://meet.google.com/xyz-lead-desk',
    status: 'Completed',
    counsellorName: 'Priya Joshi',
    notes: 'Attended full session and solved coding exercise during class.',
    createdAt: '2026-10-13T10:00:00Z'
  }
];

export const INITIAL_FOLLOW_UPS: FollowUpTask[] = [
  {
    id: 'task-1',
    leadId: 'lead-101',
    studentName: 'Pooja Deshmukh',
    title: 'Share Evening Batch Demo Link & EMI Breakdown',
    reason: 'Commerce graduate concerned about study gap and needing flexible payment plan.',
    preferredChannel: 'WhatsApp',
    suggestedMessage: 'Hi Pooja! Hope you are doing well. Here is the link for our Saturday coding demo and our 0% EMI payment schedule.',
    dueDate: '2026-10-17T10:00:00Z',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'Priya Joshi',
    createdAt: '2026-10-16T11:45:00Z'
  },
  {
    id: 'task-2',
    leadId: 'lead-105',
    studentName: 'Suresh Chavan',
    title: 'Parent Counselling Call for Electrical Diploma to Cloud Transition',
    reason: 'Student and father require clarification on placement support and fee investment.',
    preferredChannel: 'Phone Call',
    suggestedMessage: 'Call father to discuss audited placement statistics and lab facilities.',
    dueDate: '2026-10-17T11:30:00Z',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'Vikram Mehta',
    createdAt: '2026-10-15T17:00:00Z'
  },
  {
    id: 'task-3',
    leadId: 'lead-103',
    studentName: 'Rohit Verma',
    title: 'Email Weekend GenAI Module & Capstone Details',
    reason: 'Mechanical engineer wants weekend batch details to study alongside full-time job.',
    preferredChannel: 'Email',
    suggestedMessage: 'Hi Rohit, Please find attached the curriculum brochure for our Weekend Data Science and GenAI program.',
    dueDate: '2026-10-16T19:00:00Z',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Vikram Mehta',
    createdAt: '2026-10-16T12:05:00Z'
  },
  {
    id: 'task-4',
    leadId: 'lead-108',
    studentName: 'Rahul Sharma',
    title: 'Resolve Duplicate Lead Merge with Rahul S. (Instagram)',
    reason: 'Identical telephone number +91 98234 11223 across web and Instagram ads.',
    preferredChannel: 'Phone Call',
    suggestedMessage: 'Review merge records in lead desk duplicate manager.',
    dueDate: '2026-10-16T18:00:00Z',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Priya Joshi',
    createdAt: '2026-10-16T14:15:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-16T14:15:00Z',
    performedBy: 'System Identity Resolver',
    action: 'DUPLICATE_DETECTED',
    entityType: 'Lead',
    entityId: 'lead-108',
    details: 'Matched incoming lead #108 with existing #112 on normalized phone +91 98234 11223 (95% similarity)'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-16T10:20:00Z',
    performedBy: 'Priya Joshi (Counsellor)',
    action: 'SCORE_UPDATED',
    entityType: 'Lead',
    entityId: 'lead-106',
    details: 'Lead score upgraded to 91 (Hot) following demo completion and 90% aptitude result'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-15T18:20:00Z',
    performedBy: 'Student Self-Service',
    action: 'DEMO_BOOKED',
    entityType: 'Appointment',
    entityId: 'app-1',
    details: 'Swapnil Kadam booked slot #slot-1 for Full Stack Web Development demo on 2026-10-18'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-20T10:00:00Z',
    performedBy: 'Dr. Rajesh Sharma (Director)',
    action: 'COURSE_VERIFIED',
    entityType: 'Course',
    entityId: 'crs-1',
    details: 'Course syllabus and placement statistics verified and stamped authoritative'
  }
];

export const INITIAL_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q1',
    difficulty: 'basic',
    category: 'Logical Reasoning',
    question: {
      en: 'If a web application receives 100 requests per minute and each request takes 0.5 seconds to process, how many requests can 1 server process per minute?',
      hi: 'यदि एक वेब एप्लिकेशन प्रति मिनट 100 अनुरोध प्राप्त करता है और प्रत्येक अनुरोध को प्रोसेस करने में 0.5 सेकंड लगते हैं, तो 1 सर्वर प्रति मिनट कितने अनुरोध प्रोसेस कर सकता है?',
      mr: 'जर एका वेब ॲप्लिकेशनला प्रति मिनिट १०० विनंत्या (requests) येत असतील आणि प्रत्येक विनंती पूर्ण व्हायला ०.५ सेकंद लागत असतील, तर १ सर्व्हर प्रति मिनिट किती विनंत्या हाताळू शकेल?'
    },
    options: [
      { id: 'q1_a', text: { en: '60 requests', hi: '60 अनुरोध', mr: '६० विनंत्या' }, points: 5, aptitudeType: 'practical' },
      { id: 'q1_b', text: { en: '120 requests (60s / 0.5s = 120)', hi: '120 अनुरोध (60s / 0.5s = 120)', mr: '१२० विनंत्या (६० सेकंद / ०.५ = १२०)' }, points: 25, aptitudeType: 'analytical' },
      { id: 'q1_c', text: { en: '200 requests', hi: '200 अनुरोध', mr: '२०० विनंत्या' }, points: 10, aptitudeType: 'exploratory' },
      { id: 'q1_d', text: { en: '50 requests', hi: '50 अनुरोध', mr: '५० विनंत्या' }, points: 5, aptitudeType: 'creative' }
    ]
  },
  {
    id: 'q2',
    difficulty: 'intermediate',
    category: 'Pattern Recognition',
    question: {
      en: 'Look at this sequence of numbers: 2, 6, 12, 20, 30, __. What should be the next number?',
      hi: 'इस संख्या अनुक्रम को देखें: 2, 6, 12, 20, 30, __। अगली संख्या क्या होनी चाहिए?',
      mr: 'या संख्यांच्या पॅटर्नकडे पहा: २, ६, १२, २०, ३०, __. पुढील संख्या कोणती येईल?'
    },
    options: [
      { id: 'q2_a', text: { en: '42 (+4, +6, +8, +10, +12)', hi: '42 (+4, +6, +8, +10, +12)', mr: '४२ (+४, +६, +८, +१०, +१२)' }, points: 25, aptitudeType: 'analytical' },
      { id: 'q2_b', text: { en: '40', hi: '40', mr: '४०' }, points: 10, aptitudeType: 'practical' },
      { id: 'q2_c', text: { en: '36', hi: '36', mr: '३६' }, points: 5, aptitudeType: 'creative' },
      { id: 'q2_d', text: { en: '48', hi: '48', mr: '४८' }, points: 5, aptitudeType: 'exploratory' }
    ]
  },
  {
    id: 'q3',
    difficulty: 'intermediate',
    category: 'Problem Solving',
    question: {
      en: 'When faced with a broken piece of code or software error, what is your first instinct?',
      hi: 'जब किसी सॉफ़्टवेयर कोड में कोई समस्या या त्रुटि आती है, तो आपका पहला विचार क्या होता है?',
      mr: 'जेव्हा एखाद्या कोडमध्ये किंवा सॉफ्टवेअरमध्ये एरर (त्रुटी) येते, तेव्हा तुमची पहिली कृती काय असते?'
    },
    options: [
      { id: 'q3_a', text: { en: 'Break down the error message and trace where data changes line by line', hi: 'एरर मैसेज को समझकर डेटा को स्टेप बाई स्टेप ट्रेस करना', mr: 'एरर मेसेज समजून घेऊन डेटा कुठे बदलतोय ते स्टेप बाय स्टेप तपासणे' }, points: 25, aptitudeType: 'analytical' },
      { id: 'q3_b', text: { en: 'Search community forums or documentation to see how others solved it', hi: 'कम्युनिटी फोरम या डॉक्यूमेंटेशन में देखना कि दूसरों ने इसे कैसे हल किया', mr: 'फोरम किंवा डॉक्युमेंटेशनमध्ये इतरांनी हा प्रश्न कसा सोडवला ते शोधणे' }, points: 20, aptitudeType: 'practical' },
      { id: 'q3_c', text: { en: 'Re-design the user interface or flow to bypass the issue', hi: 'समस्या से बचने के लिए यूजर फ्लो को नया रूप देना', mr: 'समस्या टाळण्यासाठी डिझाईन किंवा युझर फ्लो वेगळ्या पद्धतीने करणे' }, points: 15, aptitudeType: 'creative' },
      { id: 'q3_d', text: { en: 'Experiment with changing inputs until something works', hi: 'अलग-अलग इनपुट डालकर देखना जब तक काम न बने', mr: 'वेगवेगळे इनपुट बदलून प्रयोग करून पाहणे' }, points: 10, aptitudeType: 'exploratory' }
    ]
  },
  {
    id: 'q4',
    difficulty: 'advanced',
    category: 'Learning Preference',
    question: {
      en: 'What kind of work gives you the greatest personal satisfaction?',
      hi: 'किस प्रकार का काम आपको सबसे अधिक व्यक्तिगत संतुष्टि देता है?',
      mr: 'कोणत्या प्रकारच्या कामातून तुम्हाला सर्वात जास्त समाधान मिळते?'
    },
    options: [
      { id: 'q4_a', text: { en: 'Building interactive web apps that real users engage with every day', hi: 'ऐसी वेबसाइट और ऐप्स बनाना जिनका लोग रोज इस्तेमाल करें', mr: 'प्रत्यक्ष लोक दररोज वापरतील अशा सुंदर आणि उपयुक्त वेब ॲप्स तयार करणे' }, points: 25, aptitudeType: 'practical' },
      { id: 'q4_b', text: { en: 'Analysing complex data, finding hidden patterns, and training AI models', hi: 'डेटा का विश्लेषण करना और AI मॉडल को ट्रेन करना', mr: 'मोठ्या डेटाचे विश्लेषण करणे, त्यातील पॅटर्न शोधणे आणि AI मॉडेल्स तयार करणे' }, points: 25, aptitudeType: 'analytical' },
      { id: 'q4_c', text: { en: 'Automating server infrastructure, cloud security, and smooth deployments', hi: 'क्लाउड सर्वर ऑटोमेशन और सुरक्षा संभालना', mr: 'क्लाउड सर्व्हर, सुरक्षित सिस्टीम आणि ऑटोमेशन हाताळणे' }, points: 25, aptitudeType: 'exploratory' },
      { id: 'q4_d', text: { en: 'Crafting intuitive user interfaces, visual design, and frictionless UX', hi: 'आकर्षक डिजाइन, रंगों और यूजर इंटरफेस को निखारना', mr: 'सुंदर व्हिज्युअल डिझाईन, रंगसंगती आणि सहज समजणारे युझर इंटरफेस तयार करणे' }, points: 25, aptitudeType: 'creative' }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, ConversationMessage[]> = {
  'conv-lead-101': [
    {
      id: 'm1',
      conversationId: 'conv-lead-101',
      leadId: 'lead-101',
      sender: 'student',
      content: 'Hello, I am Pooja Deshmukh. I completed my B.Com in 2022 and have a 2-year gap. Can I become a software developer? Mujhe coding ka koi background nahi hai.',
      language: 'Mixed',
      timestamp: '2026-10-15T14:18:00Z'
    },
    {
      id: 'm2',
      conversationId: 'conv-lead-101',
      leadId: 'lead-101',
      sender: 'ai',
      content: 'Hello Pooja! Thank you for reaching out. Yes, absolutely! Having a B.Com degree and a 2-year gap is not an obstacle to entering software development. In fact, over 40% of our alumni come from non-IT backgrounds like commerce and arts. What matters most is building a hands-on portfolio of real projects.\n\nCould you tell me what sparked your interest in coding, and how many hours a week you can comfortably dedicate to learning?',
      language: 'English',
      timestamp: '2026-10-15T14:19:00Z',
      metadata: {
        courseId: 'crs-1',
        verifiedFactsUsed: ['No coding background strictly required', 'Any graduate eligible']
      }
    },
    {
      id: 'm3',
      conversationId: 'conv-lead-101',
      leadId: 'lead-101',
      sender: 'student',
      content: 'I can dedicate around 15 to 20 hours a week, especially in the evenings. But can I pay in instalments? Upfront fees is a bit difficult for me.',
      language: 'English',
      timestamp: '2026-10-15T14:21:00Z'
    },
    {
      id: 'm4',
      conversationId: 'conv-lead-101',
      leadId: 'lead-101',
      sender: 'ai',
      content: 'That is great time dedication, Pooja! Our Full Stack Web Development cohort has a dedicated Weekday Evening batch from 6:30 PM to 9:00 PM that fits your schedule perfectly.\n\nRegarding fees, you do not have to pay everything at once. We offer 3 zero-interest instalments (₹19,000 + ₹18,000 + ₹18,000) or No-Cost EMI options starting at just ₹4,999/month through verified NBFC partners. Would you like to attend a free live 90-minute practical coding demo this Saturday at 11:00 AM to see how our instructors teach?',
      language: 'English',
      timestamp: '2026-10-15T14:23:00Z',
      metadata: {
        courseId: 'crs-1',
        verifiedFactsUsed: ['Weekday Evening batch schedule', '3 zero-interest instalments', 'EMI starting ₹4,999/mo', 'Free 90-minute demo']
      }
    }
  ],
  'conv-lead-102': [
    {
      id: 'm102_1',
      conversationId: 'conv-lead-102',
      leadId: 'lead-102',
      sender: 'student',
      content: 'मला coding शिकायचं आहे, पण english चा problem आहे आणि मला computer ची बेसिक माहिती आहे. मी शिकू शकेन का?',
      language: 'Marathi',
      timestamp: '2026-10-15T18:05:00Z'
    },
    {
      id: 'm102_2',
      conversationId: 'conv-lead-102',
      leadId: 'lead-102',
      sender: 'ai',
      content: 'नमस्कार स्वप्निल! नक्कीच, तुम्ही अगदी खात्रीने कोडिंग शिकू शकता! कोडिंगमध्ये लॉजिक महत्त्वाचे असते, इंग्रजी भाषेची भीती बाळगण्याची गरज नाही. आमचे शिक्षक मराठी आणि इंग्रजी दोन्ही भाषांमध्ये संकल्पना सोप्या करून समजावून सांगतात.\n\nतुमचं शिक्षण किती झालं आहे आणि तुम्हाला दिवसातून किती वेळ अभ्यासासाठी देता येईल?',
      language: 'Marathi',
      timestamp: '2026-10-15T18:06:00Z'
    },
    {
      id: 'm102_3',
      conversationId: 'conv-lead-102',
      leadId: 'lead-102',
      sender: 'student',
      content: 'मी १२ वी सायन्स पास झालो आहे. मला सकाळी क्लास करायचा आहे आणि प्रॅक्टिकल डेमो बघायचा आहे.',
      language: 'Marathi',
      timestamp: '2026-10-15T18:08:00Z'
    },
    {
      id: 'm102_4',
      conversationId: 'conv-lead-102',
      leadId: 'lead-102',
      sender: 'ai',
      content: 'उत्तम स्वप्निल! १२ वी सायन्सच्या विद्यार्थ्यांसाठी आमचा फुल स्टॅक वेब डेव्हलपमेंट कोर्स अतिशय फायदेशीर ठरतो. सकाळी ८:०० ते १०:३० चा स्पेशल बॅच उपलब्ध आहे.\n\nतुम्ही शनिवार, १८ ऑक्टोबर रोजी सकाळी ११:०० वाजता होणाऱ्या मोफत प्रॅक्टिकल डेमो सेशनची सीट आत्ताच बूक करू शकता. मी तुमच्यासाठी स्लॉट ओपन करू का?',
      language: 'Marathi',
      timestamp: '2026-10-15T18:09:00Z',
      metadata: {
        courseId: 'crs-1',
        verifiedFactsUsed: ['Weekday Morning 8:00 AM batch', 'Saturday demo availability']
      }
    }
  ]
};

// Safe LocalStorage Helper with fallback
class DatabaseService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`Failed reading key ${key} from storage`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed writing key ${key} to storage`, e);
    }
  }

  // Initialise database with demo data if empty
  init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults(): void {
    this.setItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    this.setItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    this.setItem(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    this.setItem(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
    this.setItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    this.setItem(STORAGE_KEYS.FOLLOW_UPS, INITIAL_FOLLOW_UPS);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    this.setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_STAFF[0]); // default Priya Joshi (Counsellor)
    this.setItem(STORAGE_KEYS.INTEGRATIONS, {
      geminiApiKey: '',
      geminiModel: 'gemini-1.5-flash',
      isDemoMode: true,
      enableVoiceSTT: true,
      enableWhatsAppSim: true,
      enablePhoneSim: true
    } as IntegrationConfig);
  }

  // Staff & Auth
  getStaff(): StaffProfile[] {
    return this.getItem<StaffProfile[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  getCurrentUser(): StaffProfile {
    return this.getItem<StaffProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_STAFF[0]);
  }

  setCurrentUser(user: StaffProfile): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    this.addAuditLog('AUTH_ROLE_SWITCH', 'StaffProfile', user.id, `Active user switched to ${user.name} (${user.role})`);
  }

  // Leads
  getLeads(): Lead[] {
    return this.getItem<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  }

  getLeadById(id: string): Lead | undefined {
    const leads = this.getLeads();
    return leads.find(l => l.id === id);
  }

  saveLead(lead: Lead): void {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === lead.id);
    lead.updatedAt = new Date().toISOString();
    if (index >= 0) {
      leads[index] = lead;
    } else {
      leads.unshift(lead);
    }
    this.setItem(STORAGE_KEYS.LEADS, leads);
    this.addAuditLog('LEAD_SAVE', 'Lead', lead.id, `Saved lead details for ${lead.name}`);
  }

  deleteLead(id: string): void {
    const leads = this.getLeads().filter(l => l.id !== id);
    this.setItem(STORAGE_KEYS.LEADS, leads);
    this.addAuditLog('LEAD_DELETE', 'Lead', id, `Deleted lead record #${id}`);
  }

  // Merge Duplicate Leads
  mergeLeads(primaryLeadId: string, secondaryLeadId: string): Lead | null {
    const leads = this.getLeads();
    const primary = leads.find(l => l.id === primaryLeadId);
    const secondary = leads.find(l => l.id === secondaryLeadId);
    if (!primary || !secondary) return null;

    // Merge detected objections without duplicates
    const combinedObjections = [...primary.detectedObjections];
    secondary.detectedObjections.forEach(obj => {
      if (!combinedObjections.some(o => o.category === obj.category && o.supportingQuote === obj.supportingQuote)) {
        combinedObjections.push(obj);
      }
    });

    // Merge notes & summaries
    const mergedSummary = `${primary.summary} | Merged from ${secondary.source} Enquiry: ${secondary.summary}`;

    primary.detectedObjections = combinedObjections;
    primary.summary = mergedSummary;
    primary.duplicateWarning = undefined;
    primary.updatedAt = new Date().toISOString();

    // Mark secondary as archived / duplicateOf
    const updatedLeads = leads
      .filter(l => l.id !== secondaryLeadId)
      .map(l => l.id === primaryLeadId ? primary : l);

    this.setItem(STORAGE_KEYS.LEADS, updatedLeads);

    // Merge conversation messages
    const allMessages = this.getAllMessages();
    const secKey = `conv-${secondaryLeadId}`;
    const priKey = `conv-${primaryLeadId}`;
    if (allMessages[secKey]) {
      const existing = allMessages[priKey] || [];
      allMessages[priKey] = [...existing, ...allMessages[secKey]];
      delete allMessages[secKey];
      this.setItem(STORAGE_KEYS.MESSAGES, allMessages);
    }

    this.addAuditLog(
      'LEADS_MERGED',
      'Lead',
      primaryLeadId,
      `Authorised merge of lead #${secondaryLeadId} (${secondary.name}) into primary #${primaryLeadId} (${primary.name})`
    );

    return primary;
  }

  // Courses & Knowledge Base
  getCourses(): Course[] {
    return this.getItem<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }

  getVerifiedCourses(): Course[] {
    return this.getCourses().filter(c => c.isActive && c.isVerified);
  }

  saveCourse(course: Course): void {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === course.id);
    if (idx >= 0) {
      courses[idx] = course;
    } else {
      courses.push(course);
    }
    this.setItem(STORAGE_KEYS.COURSES, courses);
    this.addAuditLog('COURSE_UPDATE', 'Course', course.id, `Saved course record ${course.name} (Verified: ${course.isVerified})`);
  }

  toggleCourseVerification(courseId: string, verifiedBy: string): Course | null {
    const courses = this.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;
    course.isVerified = !course.isVerified;
    course.lastVerifiedDate = new Date().toISOString().split('T')[0];
    course.verifiedBy = verifiedBy;
    this.setItem(STORAGE_KEYS.COURSES, courses);
    this.addAuditLog(
      course.isVerified ? 'COURSE_VERIFIED' : 'COURSE_UNVERIFIED',
      'Course',
      courseId,
      `Verification status toggled to ${course.isVerified} by ${verifiedBy}`
    );
    return course;
  }

  // Appointments & Slot Conflict Prevention
  getSlots(): AppointmentSlot[] {
    return this.getItem<AppointmentSlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
  }

  getAppointments(): Appointment[] {
    return this.getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }

  bookAppointment(data: {
    leadId: string;
    studentName: string;
    studentPhone: string;
    studentEmail: string;
    slotId: string;
    notes?: string;
  }): { success: boolean; appointment?: Appointment; message: string } {
    const slots = this.getSlots();
    const slotIndex = slots.findIndex(s => s.id === data.slotId);
    if (slotIndex < 0) {
      return { success: false, message: 'Selected time slot does not exist.' };
    }

    const slot = slots[slotIndex];

    // Conflict safeguard 1: Capacity check
    if (slot.status === 'Full' || slot.bookedCount >= slot.capacity) {
      return { success: false, message: 'This slot is already fully booked. Please select an alternate time.' };
    }

    // Conflict safeguard 2: Prevent duplicate student booking for same slot
    const appointments = this.getAppointments();
    const alreadyBooked = appointments.find(
      a => a.slotId === data.slotId && (a.leadId === data.leadId || a.studentPhone === data.studentPhone) && a.status === 'Booked'
    );
    if (alreadyBooked) {
      return { success: false, message: 'You already have an active confirmed booking for this slot.' };
    }

    // Update slot counts
    slot.bookedCount += 1;
    if (slot.bookedCount >= slot.capacity) {
      slot.status = 'Full';
    }
    slots[slotIndex] = slot;
    this.setItem(STORAGE_KEYS.SLOTS, slots);

    // Create appointment
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      leadId: data.leadId,
      studentName: data.studentName,
      studentPhone: data.studentPhone,
      studentEmail: data.studentEmail || '',
      slotId: slot.id,
      courseId: slot.courseId,
      courseName: slot.courseName,
      date: slot.date,
      time: slot.time,
      mode: slot.mode,
      venueOrLink: slot.venueOrLink,
      status: 'Booked',
      counsellorName: slot.counsellorName,
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    appointments.unshift(newAppointment);
    this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Update lead stage to Demo Booked
    const lead = this.getLeadById(data.leadId);
    if (lead) {
      lead.stage = 'Demo Booked';
      lead.score = Math.min(100, lead.score + 15);
      lead.temperature = lead.score >= 70 ? 'Hot' : 'Warm';
      this.saveLead(lead);
    }

    // Create reminder follow-up task
    this.saveFollowUp({
      id: `task-${Date.now()}`,
      leadId: data.leadId,
      studentName: data.studentName,
      title: `Send Demo Class Reminder for ${slot.courseName}`,
      reason: 'Confirmed demo booking. Send WhatsApp join link 2 hours before session.',
      preferredChannel: 'WhatsApp',
      suggestedMessage: `Hi ${data.studentName}! Reminder for your demo class today at ${slot.time}. Link: ${slot.venueOrLink}`,
      dueDate: `${slot.date}T08:00:00Z`,
      priority: 'High',
      status: 'Pending',
      assignedTo: slot.counsellorName,
      createdAt: new Date().toISOString()
    });

    this.addAuditLog(
      'APPOINTMENT_BOOKED',
      'Appointment',
      newAppointment.id,
      `Booked demo class for ${data.studentName} on ${slot.date} (${slot.time})`
    );

    return { success: true, appointment: newAppointment, message: 'Demo class booked successfully!' };
  }

  cancelAppointment(appointmentId: string, reason?: string): boolean {
    const appointments = this.getAppointments();
    const app = appointments.find(a => a.id === appointmentId);
    if (!app || app.status === 'Cancelled') return false;

    app.status = 'Cancelled';
    app.notes = (app.notes ? app.notes + ' | ' : '') + `Cancelled: ${reason || 'User cancelled'}`;
    this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Free slot capacity
    const slots = this.getSlots();
    const slot = slots.find(s => s.id === app.slotId);
    if (slot && slot.bookedCount > 0) {
      slot.bookedCount -= 1;
      if (slot.status === 'Full') {
        slot.status = 'Available';
      }
      this.setItem(STORAGE_KEYS.SLOTS, slots);
    }

    this.addAuditLog('APPOINTMENT_CANCELLED', 'Appointment', appointmentId, `Appointment cancelled: ${reason || 'No reason'}`);
    return true;
  }

  // Follow-ups
  getFollowUps(): FollowUpTask[] {
    return this.getItem<FollowUpTask[]>(STORAGE_KEYS.FOLLOW_UPS, INITIAL_FOLLOW_UPS);
  }

  saveFollowUp(task: FollowUpTask): void {
    const tasks = this.getFollowUps();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      tasks[idx] = task;
    } else {
      tasks.unshift(task);
    }
    this.setItem(STORAGE_KEYS.FOLLOW_UPS, tasks);
    this.addAuditLog('TASK_SAVE', 'Lead', task.leadId, `Saved follow-up task "${task.title}" for ${task.studentName}`);
  }

  completeFollowUp(taskId: string): void {
    const tasks = this.getFollowUps();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'Completed';
      this.setItem(STORAGE_KEYS.FOLLOW_UPS, tasks);
      this.addAuditLog('TASK_COMPLETED', 'Lead', task.leadId, `Follow-up task completed: ${task.title}`);
    }
  }

  // Messages & Conversation History
  getAllMessages(): Record<string, ConversationMessage[]> {
    return this.getItem<Record<string, ConversationMessage[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  getMessagesForLead(leadId: string): ConversationMessage[] {
    const all = this.getAllMessages();
    return all[`conv-${leadId}`] || [];
  }

  addMessage(leadId: string, message: ConversationMessage): void {
    const all = this.getAllMessages();
    const key = `conv-${leadId}`;
    if (!all[key]) {
      all[key] = [];
    }
    all[key].push(message);
    this.setItem(STORAGE_KEYS.MESSAGES, all);

    // Update lead lastInteraction
    const lead = this.getLeadById(leadId);
    if (lead) {
      lead.lastInteraction = message.timestamp;
      this.saveLead(lead);
    }
  }

  // Conversation Status & Takeover
  getConversations(): Conversation[] {
    return this.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, [
      {
        id: 'conv-lead-101',
        leadId: 'lead-101',
        studentName: 'Pooja Deshmukh',
        studentPhone: '+91 98234 12345',
        preferredLanguage: 'Mixed/Hinglish',
        status: 'ai_active',
        startedAt: '2026-10-15T14:18:00Z',
        lastMessageAt: '2026-10-15T14:23:00Z'
      },
      {
        id: 'conv-lead-102',
        leadId: 'lead-102',
        studentName: 'Swapnil Kadam',
        studentPhone: '+91 99221 14455',
        preferredLanguage: 'Marathi',
        status: 'ai_active',
        startedAt: '2026-10-15T18:05:00Z',
        lastMessageAt: '2026-10-15T18:09:00Z'
      },
      {
        id: 'conv-lead-105',
        leadId: 'lead-105',
        studentName: 'Suresh Chavan',
        studentPhone: '+91 98221 99881',
        preferredLanguage: 'Marathi',
        status: 'human_takeover',
        takenOverBy: 'Vikram Mehta',
        takeoverReason: 'Parental counselling required for fee & placement concerns',
        startedAt: '2026-10-15T16:30:00Z',
        lastMessageAt: '2026-10-15T17:00:00Z'
      }
    ]);
  }

  takeOverConversation(leadId: string, counsellorName: string, reason: string): Conversation {
    const convs = this.getConversations();
    let conv = convs.find(c => c.leadId === leadId);
    const lead = this.getLeadById(leadId);
    if (!conv && lead) {
      conv = {
        id: `conv-${leadId}`,
        leadId,
        studentName: lead.name,
        studentPhone: lead.normalizedPhone,
        preferredLanguage: lead.preferredLanguage,
        status: 'human_takeover',
        takenOverBy: counsellorName,
        takeoverReason: reason,
        startedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString()
      };
      convs.push(conv);
    } else if (conv) {
      conv.status = 'human_takeover';
      conv.takenOverBy = counsellorName;
      conv.takeoverReason = reason;
      conv.lastMessageAt = new Date().toISOString();
    }

    this.setItem(STORAGE_KEYS.CONVERSATIONS, convs);

    // Add system message to audit thread
    if (conv) {
      this.addMessage(leadId, {
        id: `sys-${Date.now()}`,
        conversationId: `conv-${leadId}`,
        leadId,
        sender: 'system',
        content: `Conversation taken over by Admissions Counsellor ${counsellorName}. AI automatic replies paused.`,
        language: 'English',
        timestamp: new Date().toISOString()
      });
    }

    this.addAuditLog(
      'HUMAN_TAKEOVER_ACTIVATED',
      'Conversation',
      leadId,
      `Counsellor ${counsellorName} initiated takeover for lead #${leadId}. Reason: ${reason}`
    );

    return conv!;
  }

  resumeAiConversation(leadId: string, counsellorName: string): Conversation | null {
    const convs = this.getConversations();
    const conv = convs.find(c => c.leadId === leadId);
    if (!conv) return null;

    conv.status = 'ai_active';
    conv.takenOverBy = undefined;
    conv.takeoverReason = undefined;
    conv.lastMessageAt = new Date().toISOString();
    this.setItem(STORAGE_KEYS.CONVERSATIONS, convs);

    this.addMessage(leadId, {
      id: `sys-${Date.now()}`,
      conversationId: `conv-${leadId}`,
      leadId,
      sender: 'system',
      content: `AI Admissions Counsellor resumed by ${counsellorName}.`,
      language: 'English',
      timestamp: new Date().toISOString()
    });

    this.addAuditLog(
      'AI_RESUMED',
      'Conversation',
      leadId,
      `AI assistance resumed by ${counsellorName} for lead #${leadId}`
    );

    return conv;
  }

  // Aptitude Results
  getAptitudeResults(): AptitudeResult[] {
    return this.getItem<AptitudeResult[]>(STORAGE_KEYS.APTITUDE_RESULTS, [
      {
        id: 'apt-1',
        leadId: 'lead-106',
        studentName: 'Neha Kulkarni',
        answers: [
          { questionId: 'q1', selectedOptionId: 'q1_b', points: 25 },
          { questionId: 'q2', selectedOptionId: 'q2_a', points: 25 },
          { questionId: 'q3', selectedOptionId: 'q3_a', points: 25 },
          { questionId: 'q4', selectedOptionId: 'q4_a', points: 25 }
        ],
        totalScore: 90,
        dominantAptitude: 'Analytical & Architectural',
        recommendedTrack: 'Full Stack Web Development (MERN & Cloud)',
        explanation: 'Outstanding algorithmic reasoning and systematic debugging mindset.',
        strengths: ['Algorithmic Logic', 'Code Flow Tracing', 'Clean Architecture'],
        suggestedNextStep: 'Enroll with MERIT15 discount for upcoming batch',
        completedAt: '2026-10-15T12:00:00Z'
      }
    ]);
  }

  saveAptitudeResult(res: AptitudeResult): void {
    const list = this.getAptitudeResults();
    list.unshift(res);
    this.setItem(STORAGE_KEYS.APTITUDE_RESULTS, list);
    this.addAuditLog('APTITUDE_COMPLETED', 'Lead', res.leadId, `Aptitude assessment completed by ${res.studentName} (Score: ${res.totalScore}%)`);
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  addAuditLog(action: string, entityType: AuditLog['entityType'], entityId: string, details: string): void {
    const logs = this.getAuditLogs();
    const currentUser = this.getCurrentUser();
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      performedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System',
      action,
      entityType,
      entityId,
      details
    };
    logs.unshift(log);
    // Keep last 150 logs
    if (logs.length > 150) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Integrations & API Config
  getIntegrations(): IntegrationConfig {
    return this.getItem<IntegrationConfig>(STORAGE_KEYS.INTEGRATIONS, {
      geminiApiKey: '',
      geminiModel: 'gemini-1.5-flash',
      isDemoMode: true,
      enableVoiceSTT: true,
      enableWhatsAppSim: true,
      enablePhoneSim: true
    });
  }

  saveIntegrations(cfg: IntegrationConfig): void {
    this.setItem(STORAGE_KEYS.INTEGRATIONS, cfg);
    this.addAuditLog('INTEGRATION_CONFIG_UPDATE', 'Integration', 'gemini', `Updated integration settings (Demo Mode: ${cfg.isDemoMode}, Key configured: ${!!cfg.geminiApiKey})`);
  }
}

export const db = new DatabaseService();
