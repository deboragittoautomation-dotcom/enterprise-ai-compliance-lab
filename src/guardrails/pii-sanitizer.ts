/**
 * Enterprise AI Compliance Lab - PII Sanitizer Engine
 * Synchronously redacts sensitive data before LLM inference.
 */

export interface SanitizationResult {
  sanitizedText: string;
  piiMaskedCount: number;
  detectedTypes: string[];
}

const PII_PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  PHONE_ITALIAN: /(\+39\s?)?((3\d{2}\s?\d{6,7})|(0\d{1,4}\s?\d{5,7}))/g,
  FISCAL_CODE_IT: /[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]/gi,
  CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/g,
};

export function sanitizePII(input: string): SanitizationResult {
  let text = input;
  let maskedCount = 0;
  const detectedTypes: Set<string> = new Set();

  // Redact Emails
  if (PII_PATTERNS.EMAIL.test(text)) {
    text = text.replace(PII_PATTERNS.EMAIL, '[REDACTED_EMAIL]');
    detectedTypes.add('EMAIL');
    maskedCount++;
  }

  // Redact Italian Fiscal Codes
  if (PII_PATTERNS.FISCAL_CODE_IT.test(text)) {
    text = text.replace(PII_PATTERNS.FISCAL_CODE_IT, '[REDACTED_TAX_ID]');
    detectedTypes.add('TAX_ID');
    maskedCount++;
  }

  // Redact Phone Numbers
  if (PII_PATTERNS.PHONE_ITALIAN.test(text)) {
    text = text.replace(PII_PATTERNS.PHONE_ITALIAN, '[REDACTED_PHONE]');
    detectedTypes.add('PHONE');
    maskedCount++;
  }

  // Redact Credit Cards
  if (PII_PATTERNS.CREDIT_CARD.test(text)) {
    text = text.replace(PII_PATTERNS.CREDIT_CARD, '[REDACTED_CARD]');
    detectedTypes.add('CREDIT_CARD');
    maskedCount++;
  }

  return {
    sanitizedText: text,
    piiMaskedCount: maskedCount,
    detectedTypes: Array.from(detectedTypes),
  };
}
