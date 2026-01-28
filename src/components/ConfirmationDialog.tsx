import React from 'react';
import { Modal } from './Modal';
import './ConfirmationDialog.css';

type DialogVariant = 'warning' | 'danger' | 'info';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
}

const ICONS: Record<DialogVariant, string> = {
  warning: '⚠️',
  danger: '🗑️',
  info: 'ℹ️',
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="confirmation-dialog">
        <div className={`confirmation-dialog__icon confirmation-dialog__icon--${variant}`}>
          {ICONS[variant]}
        </div>
        <h3 className="confirmation-dialog__title">{title}</h3>
        <p className="confirmation-dialog__message">{message}</p>
        <div className="confirmation-dialog__actions">
          <button
            className="confirmation-dialog__btn confirmation-dialog__btn--cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`confirmation-dialog__btn confirmation-dialog__btn--confirm ${
              variant === 'danger' ? 'confirmation-dialog__btn--danger' : ''
            }`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
