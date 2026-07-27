/**
 * Enterprise AI Compliance Lab - EU AI Act Risk Assessment Engine
 * Classifies AI prompt risk tier based on system context and intent.
 */

export enum RiskLevel {
  LOW = 'LOW_RISK',
  MEDIUM = 'MEDIUM_RISK',
  HIGH = 'HIGH_RISK_EU_AI_ACT',
  PROHIBITED = 'PROHIBITED_EU_AI_ACT',
}

export interface RiskAssessmentResult {
  riskLevel: RiskLevel;
  requiresHumanInTheLoop: boolean;
  complianceFlags: string[];
}

const HIGH_RISK_KEYWORDS = ['credit scoring', 'recruitment filter', 'biometric identification', 'critical infrastructure control'];
const PROHIBITED_KEYWORDS = ['social scoring', 'subliminal manipulation', 'facial recognition scrape'];

export function evaluatePromptRisk(promptText: string): RiskAssessmentResult {
  const normalized = promptText.toLowerCase();
  const flags: string[] = [];

  // Prohibited practices check
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      flags.push(`Prohibited practice detected: ${keyword}`);
      return {
        riskLevel: RiskLevel.PROHIBITED,
        requiresHumanInTheLoop: true,
        complianceFlags: flags,
      };
    }
  }

  // High-risk practices check
  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (normalized.includes(keyword)) {
      flags.push(`High-risk EU AI Act classification: ${keyword}`);
      return {
        riskLevel: RiskLevel.HIGH,
        requiresHumanInTheLoop: true,
        complianceFlags: flags,
      };
    }
  }

  // Default baseline
  return {
    riskLevel: RiskLevel.LOW,
    requiresHumanInTheLoop: false,
    complianceFlags: ['Minimal risk tier confirmed'],
  };
}
