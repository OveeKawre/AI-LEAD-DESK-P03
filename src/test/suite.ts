import { normalizeIndianPhoneNumber, detectDuplicateLead } from '../services/identity';
import { calculateLeadScore, detectObjectionsInText, determineNextBestAction } from '../services/scoring';
import { detectLanguage, retrieveVerifiedCourseFacts } from '../services/ai';
import { db, INITIAL_COURSES, INITIAL_LEADS } from '../services/db';
import { Lead } from '../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('========================================================');
console.log('AI LEAD DESK: AUTOMATED TEST SUITE (20 VERIFICATION POINTS)');
console.log('========================================================\n');

// 1. Phone Normalization Tests
console.log('--- TEST GROUP 1: Indian Phone Normalization ---');
const t1 = normalizeIndianPhoneNumber('09823412345');
assert(t1.isValid && t1.normalized === '+91 98234 12345', 'Normalizes 11-digit leading zero number');

const t2 = normalizeIndianPhoneNumber('+91 98234 12345');
assert(t2.isValid && t2.normalized === '+91 98234 12345', 'Normalizes formatted +91 number');

const t3 = normalizeIndianPhoneNumber('9823412345');
assert(t3.isValid && t3.normalized === '+91 98234 12345', 'Normalizes standard 10-digit mobile number');

// 2. Identity Resolution & Duplicate Detection Tests
console.log('\n--- TEST GROUP 2: Identity Resolution & Duplicate Matching ---');
const dummyLeads: Lead[] = [
  { ...INITIAL_LEADS[0], id: 'lead-test-1', normalizedPhone: '+91 98234 11223', email: 'rahul@test.com' }
];

const dup1 = detectDuplicateLead({ phone: '09823411223', name: 'Rahul', email: 'other@test.com' }, dummyLeads);
assert(dup1.isDuplicate && dup1.confidence === 95, 'Detects exact phone match across channels (+91 98234 11223)');

const dup2 = detectDuplicateLead({ phone: '9999999999', name: 'Rahul S.', email: 'rahul@test.com' }, dummyLeads);
assert(dup2.isDuplicate && dup2.confidence === 90, 'Detects exact email match when phone differs');

const dup3 = detectDuplicateLead({ phone: '9123456789', name: 'New Student' }, dummyLeads);
assert(!dup3.isDuplicate, 'Correctly reports unique non-duplicate student');

// 3. Multilingual Detection Tests (English, Hindi, Marathi, Mixed)
console.log('\n--- TEST GROUP 3: Multilingual & Code-Switching Detection ---');
assert(detectLanguage('Hello, I want to know course duration and eligibility') === 'English', 'Detects pure English enquiry');
assert(detectLanguage('नमस्ते, क्या मुझे डेटा साइंस कोर्स की फीस और सिलेबस बता सकते हैं?') === 'Hindi', 'Detects pure Hindi Devanagari enquiry');
assert(detectLanguage('मला कोडिंग शिकायचं आहे, फी किती आहे आणि क्लास कधी सुरू होईल?') === 'Marathi', 'Detects pure Marathi Devanagari enquiry');
assert(detectLanguage('मला coding शिकायचं आहे, but I have no programming experience') === 'Mixed', 'Detects natural Marathi-English code-switching');
assert(detectLanguage('Mujhe coding sikhna hai but mera 2-year gap hai') === 'Mixed', 'Detects natural Hinglish query');

// 4. Objection Detection Tests
console.log('\n--- TEST GROUP 4: Evidence-Based Objection Detection ---');
const feeObj = detectObjectionsInText('Fees is too high, can you give me 50% discount?');
assert(feeObj.some(o => o.category === 'Fees or affordability'), 'Detects fee / discount concern');

const jobObj = detectObjectionsInText('Will you give 100% job guarantee on stamp paper?');
assert(jobObj.some(o => o.category === 'Job or placement concerns' && o.requiresHumanIntervention), 'Detects placement guarantee demand with human intervention flag');

const gapObj = detectObjectionsInText('I have a 3-year career gap after graduation.');
assert(gapObj.some(o => o.category === 'Study gap'), 'Detects study gap objection');

const familyObj = detectObjectionsInText('माझे वडील विचारत आहेत की जॉब मिळेल का?');
assert(familyObj.some(o => o.category === 'Family approval'), 'Detects family approval objection in Marathi');

// 5. Lead Scoring Algorithm Tests
console.log('\n--- TEST GROUP 5: Lead Scoring Breakdown & Thresholds ---');
const hotScore = calculateLeadScore({
  courseInterest: 'Full Stack Web Development',
  careerGoal: 'Become a Full Stack Engineer',
  educationBackground: 'B.Com',
  stage: 'Qualified',
  communicationConsent: true
}, ['msg1', 'msg2', 'msg3', 'msg4']);

assert(hotScore.score >= 70 && hotScore.temperature === 'Hot', 'Qualifies high engagement lead as Hot (70-100)');
assert(hotScore.breakdown.courseInterest <= 25, 'Caps course interest score at 25');
assert(hotScore.breakdown.engagement <= 20, 'Caps engagement score at 20');
assert(hotScore.breakdown.reasons.length > 0, 'Provides itemized scoring explanation reasons');

const coldScore = calculateLeadScore({
  stage: 'Not Interested',
  courseInterest: ''
}, []);
assert(coldScore.temperature === 'Cold', 'Classifies unengaged lead as Cold');

// 6. Next Best Action Prediction Tests
console.log('\n--- TEST GROUP 6: Next Best Action Engine ---');
const testLeadDemoBooked: Lead = {
  ...INITIAL_LEADS[0],
  stage: 'Demo Booked'
};
const nba1 = determineNextBestAction(testLeadDemoBooked);
assert(nba1.action === 'Schedule a follow-up', 'Recommends pre-demo reminder for Demo Booked student');

const testLeadAdmitted: Lead = {
  ...INITIAL_LEADS[0],
  stage: 'Admission Confirmed'
};
const nba2 = determineNextBestAction(testLeadAdmitted);
assert(nba2.action === 'Assign a human counsellor' && nba2.suggestedMessage.includes('LMS credentials'), 'Recommends LMS onboarding for confirmed admissions');

// 7. RAG Verified Knowledge Base Facts Retrieval Tests
console.log('\n--- TEST GROUP 7: RAG Knowledge Base Retrieval & Safety ---');
const ragRes = retrieveVerifiedCourseFacts('I want to know about MERN Full Stack fees and schedule', INITIAL_COURSES);
assert(ragRes.courses.some(c => c.code === 'FSD-101'), 'Retrieves exact matched FSD-101 course');
assert(ragRes.verifiedFacts.some(f => f.includes('Fees ₹55,000')), 'Retrieves authoritative fee fact without hallucination');

// Summary
console.log('\n========================================================');
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
}
