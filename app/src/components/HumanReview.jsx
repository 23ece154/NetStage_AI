import React, { useState } from 'react';
import { ShieldCheck, Check, Edit3, XCircle, AlertCircle } from 'lucide-react';

export default function HumanReview({ caseData, currentReview, onReviewSubmit }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [editedFix, setEditedFix] = useState('');
  const [reviewerNotes, setReviewerNotes] = useState('');

  const handleAccept = () => {
    onReviewSubmit({
      status: 'ACCEPTED',
      corrected_fix: null,
      notes: 'Human reviewer accepted AI diagnosis without modifications.'
    });
  };

  const handleSaveEdit = () => {
    if (!editedFix.trim()) return;
    onReviewSubmit({
      status: 'EDITED',
      corrected_fix: editedFix,
      notes: reviewerNotes || 'Human reviewer modified AI fix steps.'
    });
    setShowEditModal(false);
  };

  const handleSaveReject = () => {
    if (!reviewerNotes.trim()) return;
    onReviewSubmit({
      status: 'REJECTED',
      corrected_fix: null,
      notes: reviewerNotes
    });
    setShowRejectModal(false);
  };

  return (
    <div className="human-review-box">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={22} color="var(--accent-emerald)" />
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Mandatory Human Review Gate</h4>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Safety Rule: AI fix cannot be deployed until verified by a human engineer.</div>
          </div>
        </div>

        {currentReview && (
          <div className="badge" style={{
            background: currentReview.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.2)' :
                        currentReview.status === 'EDITED' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: currentReview.status === 'ACCEPTED' ? 'var(--accent-emerald)' :
                   currentReview.status === 'EDITED' ? 'var(--accent-amber)' : 'var(--accent-crimson)',
            border: `1px solid ${currentReview.status === 'ACCEPTED' ? 'var(--accent-emerald)' : currentReview.status === 'EDITED' ? 'var(--accent-amber)' : 'var(--accent-crimson)'}`
          }}>
            Status: {currentReview.status}
          </div>
        )}
      </div>

      {currentReview && (
        <div className="glass-panel" style={{ padding: '0.85rem 1.1rem', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--primary-cyan)', marginBottom: '0.2rem' }}>Human Reviewer Log Entry:</div>
          <div style={{ color: 'var(--text-main)' }}>{currentReview.notes}</div>
          {currentReview.corrected_fix && (
            <div className="mono" style={{ marginTop: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', background: '#040810', padding: '0.5rem', borderRadius: '4px' }}>
              Override Fix: {currentReview.corrected_fix}
            </div>
          )}
        </div>
      )}

      <div className="review-actions">
        <button className="btn btn-accept" onClick={handleAccept}>
          <Check size={18} /> Accept AI Fix
        </button>
        <button className="btn btn-edit" onClick={() => setShowEditModal(true)}>
          <Edit3 size={18} /> Edit & Override Fix
        </button>
        <button className="btn btn-reject" onClick={() => setShowRejectModal(true)}>
          <XCircle size={18} /> Reject AI Diagnosis
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={20} /> Edit & Correct AI Diagnosis
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Modify the proposed Cisco IOS fix commands or enter corrective CLI statements:
            </p>
            <textarea 
              className="form-textarea"
              placeholder="Enter corrected Cisco CLI commands (e.g. interface Fa0/24 \n switchport trunk allowed vlan add 30)..."
              value={editedFix}
              onChange={(e) => setEditedFix(e.target.value)}
            />
            <textarea 
              className="form-textarea"
              style={{ minHeight: '70px' }}
              placeholder="Reason for editing AI diagnosis (e.g. AI inverted wildcard mask)..."
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-edit" onClick={handleSaveEdit}>Submit Corrected Fix</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={20} /> Reject AI Diagnosis
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Explain why the AI diagnosis was incorrect or hallucinated to log into the Responsible AI audit system:
            </p>
            <textarea 
              className="form-textarea"
              placeholder="Explain why AI was wrong (e.g. AI confused Layer 2 VLAN pruning with Layer 3 OSPF routing)..."
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn btn-reject" onClick={handleSaveReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
