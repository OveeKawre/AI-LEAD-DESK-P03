import { Lead } from '../types';

export function normalizeIndianPhoneNumber(phone: string): { normalized: string; isValid: boolean; raw: string } {
  const raw = phone.trim();
  // Strip all non-digit characters except leading +
  const cleaned = raw.replace(/[^\d+]/g, '');
  
  let digits = cleaned.replace(/^\+/, '');
  
  // If starts with 91 and has 12 digits total
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    // Leading zero (e.g. 09823412345)
    digits = digits.slice(1);
  }

  const isValid = digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
  
  if (isValid) {
    const formatted = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    return { normalized: formatted, isValid: true, raw };
  }

  return { normalized: raw, isValid: false, raw };
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchedLead?: Lead;
  matchType?: 'Exact Phone Match' | 'Exact Email Match' | 'Probable Name & Course Match';
  confidence: number;
  reason?: string;
}

export function detectDuplicateLead(newContact: { phone: string; email?: string; name: string; courseInterest?: string }, existingLeads: Lead[], excludeId?: string): DuplicateCheckResult {
  const normPhone = normalizeIndianPhoneNumber(newContact.phone);
  const normalizedEmail = (newContact.email || '').trim().toLowerCase();
  const normalizedName = newContact.name.trim().toLowerCase();

  for (const lead of existingLeads) {
    if (excludeId && lead.id === excludeId) continue;

    // 1. Exact normalized phone match (Highest confidence: 95%)
    if (normPhone.isValid && lead.normalizedPhone === normPhone.normalized) {
      return {
        isDuplicate: true,
        matchedLead: lead,
        matchType: 'Exact Phone Match',
        confidence: 95,
        reason: `Matched existing lead #${lead.id} (${lead.name}) with identical phone number ${normPhone.normalized} across channels.`
      };
    }

    // 2. Exact email match (Confidence: 90%)
    if (normalizedEmail && lead.email && lead.email.toLowerCase() === normalizedEmail) {
      return {
        isDuplicate: true,
        matchedLead: lead,
        matchType: 'Exact Email Match',
        confidence: 90,
        reason: `Matched existing lead #${lead.id} (${lead.name}) with identical email address ${normalizedEmail}.`
      };
    }

    // 3. Similar name + same course interest (Flag for human review only - never auto-merge!)
    if (normalizedName.length > 4 && lead.name.toLowerCase() === normalizedName) {
      if (newContact.courseInterest && lead.courseInterest && lead.courseInterest.toLowerCase() === newContact.courseInterest.toLowerCase()) {
        return {
          isDuplicate: true,
          matchedLead: lead,
          matchType: 'Probable Name & Course Match',
          confidence: 65,
          reason: `Same student name "${lead.name}" and course interest "${lead.courseInterest}". Flagged for counsellor verification.`
        };
      }
    }
  }

  return { isDuplicate: false, confidence: 0 };
}
