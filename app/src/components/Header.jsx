import React from 'react';
import { ShieldCheck, Cpu, LayoutDashboard, FileText, Terminal, Download } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenExport }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <Cpu size={24} />
        </div>
        <div>
          <div className="brand-title">NetSage AI</div>
          <div className="brand-tagline">Packet Tracer AI Troubleshooter & Human Oversight Console</div>
        </div>
      </div>

      <nav className="header-nav">
        <button 
          className={`nav-tab ${activeTab === 'troubleshoot' ? 'active' : ''}`}
          onClick={() => setActiveTab('troubleshoot')}
        >
          <Cpu size={16} /> Troubleshooter
        </button>
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} /> Analytics
        </button>
        <button 
          className={`nav-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <ShieldCheck size={16} /> Responsible AI Log
        </button>
        <button 
          className={`nav-tab ${activeTab === 'cli' ? 'active' : ''}`}
          onClick={() => setActiveTab('cli')}
        >
          <Terminal size={16} /> CLI Sandbox
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="safety-badge">
          <span className="pulse-dot"></span>
          <span>Human Review Active</span>
        </div>

        <button className="btn btn-secondary" onClick={onOpenExport} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
          <Download size={14} /> Deliverables
        </button>
      </div>
    </header>
  );
}
