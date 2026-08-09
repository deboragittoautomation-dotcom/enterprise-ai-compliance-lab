export interface ValidationResult {
  approved: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  detectedIssues: string[];
}

const OUTPUT_RULES = {
  CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/g,
  API_KEY: /sk-[a-zA-Z0-9]{20,}/g,
  PASSWORD: /password\s*[:=]\s*\S+/gi,
};

export function validateOutput(text: string): ValidationResult {
  const detectedIssues: string[] = [];

  if (OUTPUT_RULES.CREDIT_CARD.test(text)) {
    detectedIssues.push("CREDIT_CARD");
  }

  if (OUTPUT_RULES.API_KEY.test(text)) {
    detectedIssues.push("API_KEY");
  }

  if (OUTPUT_RULES.PASSWORD.test(text)) {
    detectedIssues.push("PASSWORD");
  }

  return {
    approved: detectedIssues.length === 0,
    riskLevel:
      detectedIssues.length === 0
        ? "LOW"
        : detectedIssues.length === 1
        ? "MEDIUM"
        : "HIGH",
    detectedIssues,
  };
}
