import { executeCompliancePipeline } from "./compliance-pipeline";

const input = `
Hello!

My name is Mario Rossi.

Email: mario.rossi@gmail.com
Phone: +39 3471234567
Fiscal Code: RSSMRA80A01H501U
Credit Card: 4111 1111 1111 1111
`;

const result = executeCompliancePipeline(input);
console.log("\n========== COMPLIANCE PIPELINE ==========");

console.log(result);

console.log("========== ORIGINAL ==========");
console.log(input);

console.log("\n========== SANITIZED ==========");
console.log(result.sanitizedText);

console.log("\n========== DETECTED ==========");
console.log(result.pii.detectedTypes);

console.log("\n========== SUMMARY ==========");
console.log(result);