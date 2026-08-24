import React from 'react';
import { Cpu, Quote, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DiagnosisView({ diagnosis, caseData }) {
  if (!diagnosis) return null;

  const confidenceColor = diagnosis.confidence === 'High' ? 'var(--accent-emerald)' :
                          diagnosis.confidence === 'Medium' ? 'var(--accent-amber)' : 'var(--accent-crimson)';

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Cpu size={22} color="var(--primary-cyan)" />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>AI Diagnostic Assessment</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence:</span>
          <span className="badge" style={{ background: `${confidenceColor}20`, border: `1px solid ${confidenceColor}`, color: confidenceColor }}>
            {diagnosis.confidence}
          </span>
        </div>
      </div>

      {/* Root Cause Card */}
      <div className="glass-panel" style={{ padding: '1.1rem', borderColor: 'rgba(6, 182, 212, 0.4)', background: 'rgba(6, 182, 212, 0.04)' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
          Identified Root Cause
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, fontWeight: 500 }}>
          {diagnosis.root_cause}
        </div>
      </div>

      {/* Evidence Quotes */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Quote size={14} color="var(--primary-cyan)" /> Show Command Evidence Cited by AI:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {diagnosis.evidence && diagnosis.evidence.map((ev, idx) => (
            <div key={idx} className="mono" style={{ background: '#040810', border: '1px solid #1e293b', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#a7f3d0' }}>
              &gt; "{ev}"
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Verification Command */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#090d16', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <Terminal size={18} color="var(--accent-amber)" />
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Recommended Next Verification Command:</span>
          <span className="mono" style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.875rem' }}>
            {diagnosis.next_command}
          </span>
        </div>
      </div>

      {/* Recommended Fix Steps */}
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} color="var(--accent-emerald)" /> Proposed Cisco IOS Fix Commands:
        </div>
        <div className="mono" style={{ background: '#02050b', border: '1px solid #1e293b', borderRadius: '8px', padding: '1rem', color: '#38bdf8', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {diagnosis.fix_steps && diagnosis.fix_steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-dim)', userSelect: 'none' }}>{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
