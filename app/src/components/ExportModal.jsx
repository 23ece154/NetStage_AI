import React from 'react';
import { Download, X, FileText, Code, Database, Shield } from 'lucide-react';

export default function ExportModal({ onClose }) {

  const deliverables = [
    {
      name: 'cases.csv',
      type: 'Case Dataset',
      size: '30 Cases',
      path: 'dataset/cases.csv',
      icon: Database,
      desc: 'All 30 Packet Tracer troubleshooting cases with symptoms, show outputs, OSI layer, and expected faults.'
    },
    {
      name: 'diagnose_prompt.md',
      type: 'AI Prompt Library',
      size: 'Master Template',
      path: 'prompts/diagnose_prompt.md',
      icon: FileText,
      desc: 'Structured system prompt forcing JSON output schema with 3 worked few-shot examples.'
    },
    {
      name: 'rule_checker.py',
      type: 'Python Rule Checker',
      size: 'Python 3 Script',
      path: 'python/rule_checker.py',
      icon: Code,
      desc: 'Deterministic Python script for detecting IP conflicts, wrong masks, gateway mismatches, and ACL drops.'
    },
    {
      name: 'responsible_ai_log.md',
      type: 'Audit Log',
      size: '5 Logged Scenarios',
      path: 'docs/responsible_ai_log.md',
      icon: Shield,
      desc: 'Documentation on 5 human corrections where AI initial diagnosis was edited or rejected.'
    }
  ];

  const handleDownloadAlert = (name) => {
    alert(`Deliverable '${name}' is saved locally in your project workspace directory!\nPath: C:\\Users\\sri karthika\\.gemini\\antigravity\\scratch\\netsage-ai\\`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Download size={22} color="var(--primary-cyan)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Project Deliverables & Artifacts</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          All required Cisco project deliverables have been generated and validated in your project workspace directory:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {deliverables.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.name} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.12)', padding: '0.6rem', borderRadius: '8px', color: 'var(--primary-cyan)' }}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.name}</span>
                      <span className="badge badge-layer">{item.type}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.desc}</div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleDownloadAlert(item.name)}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button className="btn btn-accept" onClick={onClose}>Close Window</button>
        </div>
      </div>
    </div>
  );
}
