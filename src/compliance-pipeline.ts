import { sanitizePII } from "./guardrails/pii-sanitizer";
import { detectPromptInjection } from "./guardrails/prompt-injection";
import { validateOutput } from "./guardrails/output-validator";
import { evaluatePromptRisk } from "./risk-engine/risk-assessor";
import { logAudit } from "./logging/audit-logger";

export function executeCompliancePipeline(input: string) {
  const pii = sanitizePII(input);
  const promptInjection = detectPromptInjection(input);

  const baseRiskAssessment = evaluatePromptRisk(input);
  const isPromptInjectionDetected = !promptInjection.safe;

  const riskAssessment = isPromptInjectionDetected
    ? {
        ...baseRiskAssessment,
        riskLevel: "HIGH_RISK_EU_AI_ACT",
        requiresHumanInTheLoop: true,
        complianceFlags: [
          ...baseRiskAssessment.complianceFlags,
          "Prompt injection detected: request blocked for safety review",
        ],
      }
    : baseRiskAssessment;

  const outputValidation = validateOutput(pii.sanitizedText);
  const finalApproved = outputValidation.approved && !isPromptInjectionDetected;

  logAudit({
    timestamp: new Date().toISOString(),
    riskLevel: riskAssessment.riskLevel,
    promptInjectionDetected: isPromptInjectionDetected,
    piiDetected: pii.detectedTypes,
    status: finalApproved ? "APPROVED" : "BLOCKED",
  });

  return {
    sanitizedText: pii.sanitizedText,

    pii,

    promptInjection,

    outputValidation: {
      ...outputValidation,
      approved: finalApproved,
      riskLevel: finalApproved ? outputValidation.riskLevel : "HIGH",
      detectedIssues: isPromptInjectionDetected
        ? [...outputValidation.detectedIssues, "PROMPT_INJECTION"]
        : outputValidation.detectedIssues,
    },

    riskAssessment,
  };
}