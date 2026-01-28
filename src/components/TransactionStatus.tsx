import React from 'react';
import './TransactionStatus.css';

type Status = 'pending' | 'success' | 'error';

interface TransactionStatusProps {
  status: Status;
  title: string;
  message?: string;
  txHash?: string;
  explorerUrl?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

const STATUS_ICONS: Record<Status, string> = {
  pending: '⏳',
  success: '✅',
  error: '❌',
};

export function TransactionStatus({
  status,
  title,
  message,
  txHash,
  explorerUrl,
  onClose,
  onRetry,
}: TransactionStatusProps) {
  const shortenHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <div className="transaction-status">
      <div className={`transaction-status__icon transaction-status__icon--${status}`}>
        {STATUS_ICONS[status]}
      </div>
      
      <h3 className="transaction-status__title">{title}</h3>
      
      {message && <p className="transaction-status__message">{message}</p>}
      
      {status === 'pending' && (
        <div className="transaction-status__progress">
          <div className="transaction-status__progress-bar" />
        </div>
      )}
      
      {txHash && (
        <div className="transaction-status__hash">
          {explorerUrl ? (
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="transaction-status__hash-link"
            >
              {shortenHash(txHash)} ↗
            </a>
          ) : (
            <span>{shortenHash(txHash)}</span>
          )}
        </div>
      )}
      
      <div className="transaction-status__actions">
        {status === 'error' && onRetry && (
          <button 
            className="transaction-status__btn transaction-status__btn--primary"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
        {onClose && (
          <button 
            className="transaction-status__btn transaction-status__btn--secondary"
            onClick={onClose}
          >
            {status === 'success' ? 'Done' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
}
