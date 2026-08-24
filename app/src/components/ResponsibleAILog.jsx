import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Edit3, XCircle, FileText } from 'lucide-react';
import { aiCorrections } from '../data/aiCorrections';

export default function ResponsibleAILog() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ShieldCheck size={28} color="var(--accent-emerald)" />
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Responsible AI Safety & Audit Log</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Documented human corrections where AI initial diagnoses required modification or rejection before lab deployment.
            </p>
          </div>
        </div>

        <div className="safety-badge" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
          <span>5 Logged Cases</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {aiCorrections.map((item) => {
          const isEdited = item.reviewer_action === 'EDITED';
          const badgeColor = isEdited ? 'var(--accent-amber)' : 'var(--accent-crimson)';

          return (
            <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="mono" style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>[{item.case_id}]</span>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{item.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                    {item.error_mode}
                  </span>
                  <span className="badge" style={{ background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}` }}>
                    {item.reviewer_action}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* AI Diagnosis Column */}
                <div className="glass-panel" style={{ padding: '1rem', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.03)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-crimson)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <XCircle size={14} /> Initial AI Faulty Diagnosis
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {item.ai_diagnosis}
                  </div>
                  <div className="mono" style={{ background: '#040810', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.775rem', color: '#f87171' }}>
                    Proposed: {item.ai_fix}
                  </div>
                </div>

                {/* Human Corrected Column */}
                <div className="glass-panel" style={{ padding: '1rem', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.03)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={14} /> Human Reviewer Correction
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {item.human_correction}
                  </div>
                  <div className="mono" style={{ background: '#040810', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.775rem', color: '#34d399' }}>
                    Corrected: {item.corrected_fix}
                  </div>
                </div>

              </div>

              {/* Guardrail Lesson Learned */}
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.08)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <strong>Safety Guardrail Impact:</strong> {item.guardrail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
