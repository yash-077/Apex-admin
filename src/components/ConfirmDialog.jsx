import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container confirm-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onCancel} aria-label="Cancel">
          <X size={18} />
        </button>
        
        <div className="confirm-header">
          <div className="warning-icon-wrapper">
            <AlertTriangle size={24} className="warning-icon" />
          </div>
          <h3 className="confirm-title">{title || 'Are you sure?'}</h3>
        </div>

        <p className="confirm-message">{message || 'This action cannot be undone.'}</p>

        <div className="modal-footer confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
