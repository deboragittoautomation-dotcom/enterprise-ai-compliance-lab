import { sanitizePrompt } from "../src/guardrails/pii-sanitizer";
import { evaluatePromptRisk } from "../src/risk-engine/risk-assessor";

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required",
    });
  }

  // Sanitizzazione PII
  const piiResult = sanitizePrompt(prompt);

  // Analisi rischio
  const riskResult = evaluatePromptRisk(piiResult.sanitizedText);

  return res.status(200).json({
    originalText: prompt,
    sanitizedText: piiResult.sanitizedText,
    detectedPII: piiResult.detectedTypes,
    riskLevel: riskResult.riskLevel,
    complianceFlags: riskResult.complianceFlags,
    requiresHumanInTheLoop: riskResult.requiresHumanInTheLoop,
  });
} 
