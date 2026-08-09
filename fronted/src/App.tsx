import { useState } from 'react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{
    piiDetected: string[];
    promptInjection: boolean;
    riskLevel: string;
    status: string;
  } | null>(null);

  async function analyzePrompt() {
    if (!prompt.trim()) {
      alert('ERRORE: il prompt è vuoto.');
      return;
    }

    try {
      const response = await fetch('/api/compliance-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt }),
      });

      const rawResponse = await response.text();

      if (!response.ok) {
        alert(
          `ERRORE HTTP\n\nStatus: ${response.status}\nStatus text: ${response.statusText}\n\nRisposta backend:\n${rawResponse}`
        );
        return;
      }

      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch (error) {
        alert(
          `ERRORE JSON\n\nIl backend ha risposto, ma la risposta non è JSON valido.\n\nRisposta ricevuta:\n${rawResponse}\n\nDettaglio:\n${String(error)}`
        );
        return;
      }

      setResult({
        piiDetected: data.pii?.detectedTypes ?? [],
        promptInjection: !data.promptInjection?.safe,
        riskLevel: data.riskAssessment?.riskLevel ?? 'UNKNOWN',
        status: data.outputValidation?.approved ? 'APPROVED' : 'BLOCKED',
      });
    } catch (error) {
      const details = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      alert(`ERRORE DI RETE O FETCH\n\nDettaglio preciso:\n${details}`);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', lineHeight: 1.6, color: '#0f172a' }}>
      <header style={{ padding: '2.5rem 0 3rem', borderBottom: '1px solid #e5e7eb' }}>
        <p style={{ margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', fontSize: '0.8rem', fontWeight: 700 }}>Enterprise AI Governance Platform</p>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: '2.4rem', lineHeight: 1.2 }}>Enterprise AI Compliance Lab</h1>
        <p style={{ margin: '0 0 1.25rem', maxWidth: '720px', fontSize: '1.05rem', color: '#475569' }}>
          Transforming AI adoption into a measurable, auditable, and policy-aligned operating model for enterprise teams.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="#demonstrator" style={{ display: 'inline-block', padding: '0.7rem 1rem', borderRadius: '999px', background: '#0f172a', color: '#fff', textDecoration: 'none' }}>Explore the demonstrator</a>
          <a href="#architecture" style={{ display: 'inline-block', padding: '0.7rem 1rem', borderRadius: '999px', border: '1px solid #cbd5e1', color: '#0f172a', textDecoration: 'none' }}>Review the architecture</a>
        </div>
      </header>

      <main id="main-content" style={{ display: 'grid', gap: '2rem', padding: '2rem 0' }}>
        <section id="challenge" style={{ display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: '0', fontSize: '1.4rem' }}>Enterprise Challenge</h2>
          <p style={{ margin: '0', color: '#475569' }}>
            Large organizations need more than a prompt-based interface. They need governed workflows, policy enforcement, auditability and transparent risk management.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Policy enforcement</h3>
              <p style={{ margin: '0', color: '#475569' }}>Guardrails evaluate prompts and outputs before they become operational decisions.</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Risk visibility</h3>
              <p style={{ margin: '0', color: '#475569' }}>Compliance signals are surfaced in a structured and explainable report.</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Operational trust</h3>
              <p style={{ margin: '0', color: '#475569' }}>Auditable analysis helps teams move faster with measurable control.</p>
            </div>
          </div>
        </section>

        <section id="demonstrator" style={{ display: 'grid', gap: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '18px', background: '#fff' }}>
          <div>
            <p style={{ margin: '0 0 0.35rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', fontSize: '0.76rem', fontWeight: 700 }}>Interactive Demonstrator</p>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem' }}>Experience the current compliance workflow</h2>
            <p style={{ margin: '0', color: '#475569' }}>The existing analysis flow remains intact. Enter a prompt, run the checker, and inspect the compliance report.</p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              aria-label="Insert a prompt to analyze for compliance"
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '12px', resize: 'vertical', boxSizing: 'border-box' }}
              placeholder="Enter a prompt to analyze"
            />

            <button onClick={analyzePrompt} aria-label="Analyze the prompt for compliance" style={{ alignSelf: 'flex-start', padding: '0.7rem 1rem', border: 'none', borderRadius: '999px', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
              Analyze
            </button>

            {result && (
              <div aria-live="polite" style={{ border: '1px solid #dbeafe', borderRadius: '12px', padding: '1rem', background: '#f8fbff' }}>
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>Compliance Report</h3>
                <p style={{ margin: '0 0 0.35rem' }}><strong>Status:</strong> {result.status}</p>
                <p style={{ margin: '0 0 0.35rem' }}><strong>Risk level:</strong> {result.riskLevel}</p>
                <p style={{ margin: '0 0 0.35rem' }}><strong>Prompt injection:</strong> {result.promptInjection ? 'Detected' : 'Not detected'}</p>
                <p style={{ margin: '0' }}><strong>PII detected:</strong> {result.piiDetected.length > 0 ? result.piiDetected.join(', ') : 'None'}</p>
              </div>
            )}
          </div>
        </section>

        <section id="report" style={{ display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: '0', fontSize: '1.4rem' }}>Compliance Report</h2>
          <p style={{ margin: '0', color: '#475569' }}>
            The outcome of the analysis is delivered as a structured assessment that blends content safety, data exposure and risk scoring into a single decision surface.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Evidence-based review</h3>
              <p style={{ margin: '0', color: '#475569' }}>Each decision is anchored to the guardrail checks performed during the pipeline.</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Operational clarity</h3>
              <p style={{ margin: '0', color: '#475569' }}>The report highlights the exact signals that influenced the result.</p>
            </div>
          </div>
        </section>

        <section id="architecture" style={{ display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: '0', fontSize: '1.4rem' }}>Architecture</h2>
          <p style={{ margin: '0', color: '#475569' }}>
            A modular architecture separates ingestion, policy evaluation, risk analysis, and audit logging so each layer can evolve independently.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem 1.1rem', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#fff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700 }}>Input layer</h3>
              <p style={{ margin: '0', color: '#475569' }}>The prompt enters the system through a controlled endpoint and is prepared for evaluation.</p>
            </div>
            <div style={{ padding: '1rem 1.1rem', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#fff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700 }}>Decision layer</h3>
              <p style={{ margin: '0', color: '#475569' }}>Sanitization, injection detection, and output validation are executed in sequence.</p>
            </div>
            <div style={{ padding: '1rem 1.1rem', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#fff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700 }}>Audit layer</h3>
              <p style={{ margin: '0', color: '#475569' }}>Results are logged in a way that supports traceability and review.</p>
            </div>
          </div>
        </section>

        <section id="stack" style={{ display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: '0', fontSize: '1.4rem' }}>Technology Stack</h2>
          <p style={{ margin: '0', color: '#475569' }}>
            The implementation combines a lightweight Node.js backend with a modern React interface to keep the experience fast and transparent.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Node.js + Express</h3>
              <p style={{ margin: '0', color: '#475569' }}>Provides the API surface and orchestration layer.</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>TypeScript</h3>
              <p style={{ margin: '0', color: '#475569' }}>Keeps the logic explicit, typed and easier to evolve.</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>React + Vite</h3>
              <p style={{ margin: '0', color: '#475569' }}>Powers the interactive experience and the landing-page structure.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}