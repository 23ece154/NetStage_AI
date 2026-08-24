import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, HelpCircle, RefreshCw } from 'lucide-react';

export default function TerminalSim({ caseData }) {
  const [command, setCommand] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { text: `Cisco IOS Software, Packet Tracer Simulator v8.2.0`, type: 'info' },
    { text: `Target Device: ${caseData ? caseData.topology_note.split(' ')[0] : 'Router-1'}#`, type: 'info' },
    { text: `Type 'help' or execute show commands (e.g. 'show ip route', 'show interfaces trunk', 'show access-lists').`, type: 'muted' }
  ]);

  const handleRunCommand = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim();
    const newHistory = [...terminalHistory, { text: `Router-1# ${cmd}`, type: 'cmd' }];

    let response = '';
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'help') {
      response = `Available Cisco CLI commands in simulator:\n - show ip route\n - show interfaces trunk\n - show access-lists\n - show ip interface brief\n - show vlan brief\n - show ip dhcp binding\n - show ip nat translations\n - ping <ip_address>`;
    } else if (lowerCmd.includes('show') || lowerCmd.includes('ping')) {
      if (caseData && caseData.show_outputs) {
        response = caseData.show_outputs;
      } else {
        response = `% Executed '${cmd}': Command parsed successfully. No fault output logged.`;
      }
    } else if (lowerCmd.startsWith('configure terminal') || lowerCmd.startsWith('conf t')) {
      response = `Enter configuration commands, one per line. End with CNTL/Z.`;
    } else {
      response = `% Invalid command or unhandled syntax in demo mode. Try 'show ip route' or 'show access-lists'.`;
    }

    newHistory.push({ text: response, type: 'output' });
    setTerminalHistory(newHistory);
    setCommand('');
  };

  return (
    <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="terminal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="terminal-title">Cisco Packet Tracer CLI Console - Interactive Sandbox</span>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => setTerminalHistory([{ text: 'Terminal output cleared.', type: 'muted' }])}
          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
        >
          <RefreshCw size={12} /> Clear
        </button>
      </div>

      <div className="terminal-body" style={{ minHeight: '320px' }}>
        {terminalHistory.map((item, idx) => (
          <div key={idx} style={{ 
            color: item.type === 'cmd' ? '#38bdf8' : 
                   item.type === 'output' ? '#a7f3d0' : 
                   item.type === 'muted' ? '#64748b' : '#94a3b8',
            marginBottom: '0.35rem' 
          }}>
            {item.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleRunCommand} style={{ display: 'flex', background: '#0b1120', borderTop: '1px solid #1e293b', padding: '0.5rem 0.75rem' }}>
        <span className="mono" style={{ color: '#38bdf8', paddingRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
          Router-1#
        </span>
        <input 
          type="text" 
          className="mono"
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '0.875rem' }}
          placeholder="Enter show command (e.g. show ip route, show access-lists)..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <button type="submit" className="btn btn-accept" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
          <Play size={14} /> Run
        </button>
      </form>
    </div>
  );
}
