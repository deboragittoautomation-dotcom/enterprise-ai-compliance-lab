/**
 * Enterprise AI Compliance Lab - Prompt Injection Detector
 */

export interface InjectionResult {
  safe: boolean;
  detectedRules: string[];
}

const DANGEROUS_PATTERNS = [
  {
    rule: "IGNORE_INSTRUCTIONS",
    pattern: /ignore (all )?(previous|above) instructions/i,
  },
  {
    rule: "SYSTEM_PROMPT_REQUEST",
    pattern: /(show|reveal).*(system prompt)/i,
  },
  {
    rule: "ROLE_MANIPULATION",
    pattern: /act as (developer|system|administrator)/i,
  },
];

export function detectPromptInjection(input: string): InjectionResult {
  const detectedRules: string[] = [];

  for (const item of DANGEROUS_PATTERNS) {
    if (item.pattern.test(input)) {
      detectedRules.push(item.rule);
    }
  }

  return {
    safe: detectedRules.length === 0,
    detectedRules,
  };
}