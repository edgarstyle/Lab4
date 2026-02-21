import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-content">
          <p className="confirm-dialog-message">{message}</p>
          <div className="confirm-dialog-buttons">
            <button 
              className="confirm-dialog-button confirm-dialog-button-cancel"
              onClick={onCancel}
            >
              Отмена
            </button>
            <button 
              className="confirm-dialog-button confirm-dialog-button-confirm"
              onClick={onConfirm}
            >
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;


