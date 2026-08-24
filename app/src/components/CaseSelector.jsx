import React, { useState } from 'react';
import { Search, Filter, AlertTriangle } from 'lucide-react';

export default function CaseSelector({ cases, selectedCase, onSelectCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('ALL');

  const concepts = ['ALL', 'VLAN & Trunking', 'IP & Gateway', 'DHCP & DNS', 'Routing', 'ACL', 'NAT', 'Wireless'];

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.concept_tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConcept = selectedConcept === 'ALL' || c.concept_tag === selectedConcept;
    return matchesSearch && matchesConcept;
  });

  return (
    <div className="sidebar-panel glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Packet Tracer Lab Cases</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filteredCases.length} / {cases.length} Loaded</span>
      </div>

      <div className="search-box">
        <Search size={16} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by ID, symptom, or topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-pills">
        {concepts.map(concept => (
          <button 
            key={concept}
            className={`filter-pill ${selectedConcept === concept ? 'active' : ''}`}
            onClick={() => setSelectedConcept(concept)}
          >
            {concept}
          </button>
        ))}
      </div>

      <div className="case-list">
        {filteredCases.map(c => {
          const isSelected = selectedCase?.case_id === c.case_id;
          const severityClass = `severity-${c.severity.toLowerCase()}`;
          let conceptBadgeClass = 'badge-layer';
          if (c.concept_tag.includes('VLAN')) conceptBadgeClass = 'badge-vlan';
          else if (c.concept_tag.includes('Routing')) conceptBadgeClass = 'badge-routing';
          else if (c.concept_tag.includes('ACL')) conceptBadgeClass = 'badge-acl';
          else if (c.concept_tag.includes('NAT')) conceptBadgeClass = 'badge-nat';
          else if (c.concept_tag.includes('DHCP')) conceptBadgeClass = 'badge-dhcp';
          else if (c.concept_tag.includes('Wireless')) conceptBadgeClass = 'badge-wireless';

          return (
            <div 
              key={c.case_id}
              className={`case-item ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCase(c)}
            >
              <div className="case-header-row">
                <span className="case-id">{c.case_id}</span>
                <span className={`badge ${severityClass}`}>{c.severity}</span>
              </div>
              <div className="case-symptom-preview">{c.symptom}</div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                <span className={`badge ${conceptBadgeClass}`}>{c.concept_tag}</span>
                <span className="badge badge-layer">{c.osi_layer}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
