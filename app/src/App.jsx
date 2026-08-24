import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CaseSelector from './components/CaseSelector';
import RuleChecker from './components/RuleChecker';
import DiagnosisView from './components/DiagnosisView';
import HumanReview from './components/HumanReview';
import Dashboard from './components/Dashboard';
import ResponsibleAILog from './components/ResponsibleAILog';
import TerminalSim from './components/TerminalSim';
import ExportModal from './components/ExportModal';

import { labCases } from './data/labCases';
import { runDeterministicRuleChecker } from './utils/ruleEngine';
import { Cpu, Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function App() {
  const [cases] = useState(labCases);
  const [selectedCase, setSelectedCase] = useState(labCases[0]);
  const [activeTab, setActiveTab] = useState('troubleshoot');
  const [showExportModal, setShowExportModal] = useState(false);
  const [humanReviews, setHumanReviews] = useState({});

  // Calculate deterministic rule hits for selected case
  const ruleFindings = useMemo(() => {
    if (!selectedCase) return [];
    return runDeterministicRuleChecker(selectedCase);
  }, [selectedCase]);

  // Generate structured AI diagnosis mock for selected case
  const aiDiagnosis = useMemo(() => {
    if (!selectedCase) return null;

    // Craft realistic AI diagnosis matching diagnose_prompt.md schema
    let evidence = [];
    const show = selectedCase.show_outputs || '';

    if (show.includes('Vlans allowed on trunk')) {
      evidence.push('Fa0/24 allowed on trunk: 1-10,20');
    } else if (show.includes('Default Gateway:')) {
      evidence.push('PC-5 Default Gateway: 192.168.1.254 (Router IP is 192.168.1.1)');
    } else if (show.includes('Gateway of last resort is not set')) {
      evidence.push('Gateway of last resort is not set');
    } else if (show.includes('administratively down')) {
      evidence.push('GigabitEthernet0/0/0 status: administratively down');
    } else if (show.includes('Inside interfaces:\n  (None)')) {
      evidence.push('Inside interfaces: (None)');
    } else if (show.includes('Native Mode VLAN: 10')) {
      evidence.push('Switch-A Native VLAN 10 vs Switch-B Native VLAN 20');
    } else {
      const lines = show.split('\n').filter(l => l.trim().length > 0);
      evidence = lines.slice(0, 2);
    }

    // Default fix step derivation
    let fixSteps = [];
    if (selectedCase.case_id === 'NET-001') {
      fixSteps = [
        'Switch-1# configure terminal',
        'Switch-1(config)# interface FastEthernet0/24',
        'Switch-1(config-if)# switchport trunk allowed vlan add 30',
        'Switch-1(config-if)# end',
        'Switch-1# copy running-config startup-config'
      ];
    } else if (selectedCase.case_id === 'NET-007') {
      fixSteps = [
        'PC-5 Configuration > Network Settings',
        'Set Default Gateway: 192.168.1.1',
        'Verify ping 192.168.1.1 succeeds'
      ];
    } else if (selectedCase.case_id === 'NET-009') {
      fixSteps = [
        'Router-1# configure terminal',
        'Router-1(config)# interface GigabitEthernet0/0/0',
        'Router-1(config-if)# no shutdown',
        'Router-1(config-if)# end'
      ];
    } else if (selectedCase.case_id === 'NET-0015') {
      fixSteps = [
        'Branch-R1# configure terminal',
        'Branch-R1(config)# ip route 0.0.0.0 0.0.0.0 Serial0/1/0',
        'Branch-R1(config)# end'
      ];
    } else {
      fixSteps = [
        `Device# configure terminal`,
        `Apply fix for ${selectedCase.expected_fault.split('.')[0]}`,
        `Device# copy running-config startup-config`
      ];
    }

    return {
      root_cause: selectedCase.expected_fault,
      confidence: selectedCase.severity === 'Critical' || selectedCase.severity === 'High' ? 'High' : 'Medium',
      evidence: evidence,
      next_command: `show ${selectedCase.concept_tag.toLowerCase().includes('vlan') ? 'interfaces trunk' : selectedCase.concept_tag.toLowerCase().includes('acl') ? 'access-lists' : 'ip route'}`,
      fix_steps: fixSteps
    };
  }, [selectedCase]);

  const handleReviewSubmit = (reviewData) => {
    setHumanReviews(prev => ({
      ...prev,
      [selectedCase.case_id]: reviewData
    }));
  };

  const currentCaseReview = humanReviews[selectedCase?.case_id];

  return (
    <div className="app-container">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* Main Troubleshooter View */}
      {activeTab === 'troubleshoot' && (
        <div className="grid-troubleshooter">
          <CaseSelector 
            cases={cases}
            selectedCase={selectedCase}
            onSelectCase={setSelectedCase}
          />

          <div className="workspace-panel">
            
            {/* Case Details Card */}
            {selectedCase && (
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
                      [{selectedCase.case_id}]
                    </span>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{selectedCase.concept_tag} Troubleshooting Case</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-layer">{selectedCase.osi_layer}</span>
                    <span className={`badge severity-${selectedCase.severity.toLowerCase()}`}>{selectedCase.severity}</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', borderColor: 'rgba(59, 130, 246, 0.4)', background: 'rgba(59, 130, 246, 0.04)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Reported Network Symptom
                  </div>
                  <div style={{ fontSize: '0.925rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {selectedCase.symptom}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Topology Context:</strong> {selectedCase.topology_note}
                </div>
              </div>
            )}

            {/* Rule Checker Results */}
            <RuleChecker findings={ruleFindings} />

            {/* AI Diagnosis Output */}
            <DiagnosisView diagnosis={aiDiagnosis} caseData={selectedCase} />

            {/* Interactive Packet Tracer Console Preview */}
            <TerminalSim caseData={selectedCase} />

            {/* Human Review Gate */}
            <HumanReview 
              caseData={selectedCase}
              currentReview={currentCaseReview}
              onReviewSubmit={handleReviewSubmit}
            />

          </div>
        </div>
      )}

      {/* Analytics Dashboard View */}
      {activeTab === 'dashboard' && (
        <Dashboard cases={cases} reviews={humanReviews} />
      )}

      {/* Responsible AI Safety Log View */}
      {activeTab === 'audit' && (
        <ResponsibleAILog />
      )}

      {/* Standalone CLI Sandbox View */}
      {activeTab === 'cli' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Terminal size={24} color="var(--primary-cyan)" />
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Interactive Cisco CLI Simulator</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Test Cisco IOS show commands on simulated routers and switches.
              </p>
            </div>
          </div>
          <TerminalSim caseData={selectedCase} />
        </div>
      )}

      {/* Export Deliverables Modal */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}

    </div>
  );
}
