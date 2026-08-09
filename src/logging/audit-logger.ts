/**
 * Enterprise AI Compliance Lab
 * Audit Logger
 */

export interface AuditLogEntry {
  timestamp: string;
  riskLevel: string;
  promptInjectionDetected: boolean;
  piiDetected: string[];
  status: string;
}
export function logAudit(entry: AuditLogEntry): void {
console.log("LOGGER CHIAMATO");
  console.log("\n========== AUDIT LOG ==========");

  console.log("Timestamp:", entry.timestamp);
  console.log("Risk Level:", entry.riskLevel);
  console.log(
    "Prompt Injection:",
    entry.promptInjectionDetected ? "DETECTED" : "NOT DETECTED"
  );
  console.log("PII Detected:", entry.piiDetected.join(", "));
  console.log("Status:", entry.status);

  console.log("===============================\n");
}