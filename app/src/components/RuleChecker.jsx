import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Wrench } from 'lucide-react';

export default function RuleChecker({ findings }) {
  if (!findings || findings.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <CheckCircle size={20} color="var(--accent-emerald)" />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>Deterministic Rule Engine Passed</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No static configuration rule violations flagged. Proceeding to LLM contextual diagnosis.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rule-checker-banner">
      <div className="rule-checker-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} />
          <span>Deterministic Rule Checker Warning ({findings.length} Rule Match{findings.length > 1 ? 'es' : ''})</span>
        </div>
        <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
          Pre-AI Validation Hit
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {findings.map((hit, idx) => (
          <div key={idx} className="rule-hit-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="mono" style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.8rem' }}>
                  [{hit.rule_id}]
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{hit.category}</span>
              </div>
              <span className={`badge severity-${hit.severity.toLowerCase()}`}>{hit.severity}</span>
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{hit.description}</div>
            <div style={{ fontSize: '0.775rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <Wrench size={12} />
              <span>Remediation Hint: {hit.remediation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
