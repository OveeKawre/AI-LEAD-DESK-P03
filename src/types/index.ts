export type LeadSource = 'WhatsApp' | 'Instagram' | 'Website' | 'Phone Call' | 'Walk-in' | 'Referral';

export type PipelineStage = 
  | 'New' 
  | 'AI Counselling' 
  | 'Qualified' 
  | 'Demo Booked' 
  | 'Demo Completed' 
  | 'Follow-up Required' 
  | 'Admission Confirmed' 
  | 'Not Interested';

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export type UserRole = 'Administrator' | 'Admissions Counsellor' | 'Prospective Student';

export type ObjectionCategory =
  | 'Fees or affordability'
  | 'Job or placement concerns'
  | 'Family approval'
  | 'Study gap'
  | 'Eligibility'
  | 'Time constraints'
  | 'Lack of confidence'
  | 'Course uncertainty'
  | 'Other'
  | 'No objection detected';

export interface DetectedObjection {
  id: string;
  category: ObjectionCategory;
  supportingQuote: string;
  confidence: number; // 0-100
  suggestedResponse: string;
  requiresHumanIntervention: boolean;
  detectedAt: string;
}

export interface LeadScoreBreakdown {
  courseInterest: number; // 0-25
  engagement: number; // 0-20
  eligibilityAlignment: number; // 0-20
  demoIntent: number; // 0-20
  responsiveness: number; // 0-15
  total: number; // 0-100
  reasons: string[];
}

export interface NextBestAction {
  action: string;
  reason: string;
  preferredChannel: 'WhatsApp' | 'Phone Call' | 'Email' | 'In-App' | 'Direct Consultation';
  suggestedMessage: string;
  recommendedDate: string;
  requiresApproval: boolean;
}

export interface Lead {
  id: string;
  name: string;
  rawPhone: string;
  normalizedPhone: string;
  email: string;
  preferredLanguage: 'English' | 'Hindi' | 'Marathi' | 'Mixed/Hinglish';
  educationBackground: string;
  graduationYear?: number;
  studyGapYears?: number;
  careerGoal: string;
  courseInterest: string;
  budgetRange?: string;
  preferredSchedule: 'Weekdays' | 'Weekends' | 'Evening Batches' | 'Self-paced' | string;
  source: LeadSource;
  stage: PipelineStage;
  score: number;
  temperature: LeadTemperature;
  scoreBreakdown: LeadScoreBreakdown;
  detectedObjections: DetectedObjection[];
  summary: string; // 3-line concise summary
  lastInteraction: string;
  suggestedNextAction: NextBestAction;
  followUpDueDate: string;
  assignedCounsellor: string;
  communicationConsent: boolean;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  duplicateWarning?: {
    matchedLeadId: string;
    matchedLeadName: string;
    matchReason: string;
    similarityScore: number;
  };
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  eligibility: string;
  duration: string; // e.g. "6 Months (Full-Time)"
  fees: number;
  currency: string;
  paymentTerms: string;
  approvedDiscounts: {
    code: string;
    description: string;
    percentage: number;
    conditions: string;
  }[];
  schedules: string[];
  deliveryMode: 'Online' | 'Classroom' | 'Hybrid';
  syllabus: {
    moduleName: string;
    topics: string[];
    durationWeeks: number;
  }[];
  demoDetails: string;
  placementSupport: string;
  verifiedPlacementStats: string;
  sourceReference: string;
  lastVerifiedDate: string;
  verifiedBy: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  leadId: string;
  sender: 'student' | 'ai' | 'counsellor' | 'system';
  content: string;
  language: 'English' | 'Hindi' | 'Marathi' | 'Mixed';
  timestamp: string;
  isVoice?: boolean;
  audioDurationSeconds?: number;
  metadata?: {
    courseId?: string;
    verifiedFactsUsed?: string[];
    objectionDetected?: ObjectionCategory;
    aptitudeTriggered?: boolean;
  };
}

export interface Conversation {
  id: string;
  leadId: string;
  studentName: string;
  studentPhone: string;
  preferredLanguage: string;
  status: 'ai_active' | 'human_takeover' | 'completed';
  takenOverBy?: string;
  takeoverReason?: string;
  startedAt: string;
  lastMessageAt: string;
}

export interface AppointmentSlot {
  id: string;
  courseId: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:00 AM - 12:30 PM"
  counsellorName: string;
  mode: 'Online' | 'Offline Campus';
  venueOrLink: string;
  capacity: number;
  bookedCount: number;
  status: 'Available' | 'Full' | 'Cancelled';
}

export interface Appointment {
  id: string;
  leadId: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  slotId: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  mode: 'Online' | 'Offline Campus';
  venueOrLink: string;
  status: 'Booked' | 'Completed' | 'Cancelled' | 'Rescheduled';
  counsellorName: string;
  notes: string;
  createdAt: string;
}

export interface FollowUpTask {
  id: string;
  leadId: string;
  studentName: string;
  title: string;
  reason: string;
  preferredChannel: 'WhatsApp' | 'Phone Call' | 'Email';
  suggestedMessage: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Cancelled';
  assignedTo: string;
  createdAt: string;
}

export interface AptitudeQuestion {
  id: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: 'Logical Reasoning' | 'Pattern Recognition' | 'Problem Solving' | 'Tech Affinity' | 'Learning Preference';
  question: {
    en: string;
    hi: string;
    mr: string;
  };
  options: {
    id: string;
    text: {
      en: string;
      hi: string;
      mr: string;
    };
    points: number;
    aptitudeType: 'analytical' | 'creative' | 'practical' | 'exploratory';
  }[];
}

export interface AptitudeResult {
  id: string;
  leadId: string;
  studentName: string;
  answers: { questionId: string; selectedOptionId: string; points: number }[];
  totalScore: number; // 0-100
  dominantAptitude: string;
  recommendedTrack: string;
  explanation: string;
  strengths: string[];
  suggestedNextStep: string;
  completedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  performedBy: string;
  action: string;
  entityType: 'Lead' | 'Conversation' | 'Appointment' | 'Course' | 'Integration' | 'StaffProfile';
  entityId: string;
  details: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl: string;
  assignedLeadsCount: number;
  activeStatus: 'Online' | 'In Counselling' | 'Offline';
}

export interface IntegrationConfig {
  geminiApiKey: string;
  geminiModel: string;
  isDemoMode: boolean;
  enableVoiceSTT: boolean;
  enableWhatsAppSim: boolean;
  enablePhoneSim: boolean;
}
