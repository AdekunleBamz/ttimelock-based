import React from 'react';
import './DepositCard.css';

interface DepositCardProps {
  id: string;
  amount: string;
  amountUsd?: string;
  unlockDate: Date;
  depositDate: Date;
  status: 'locked' | 'unlocked' | 'pending';
  onWithdraw?: () => void;
  onEarlyWithdraw?: () => void;
  penaltyPercent?: number;
  isLoading?: boolean;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function calculateProgress(depositDate: Date, unlockDate: Date): number {
  const now = Date.now();
  const start = depositDate.getTime();
  const end = unlockDate.getTime();
  
  if (now >= end) return 100;
  if (now <= start) return 0;
  
  return Math.round(((now - start) / (end - start)) * 100);
}

function getTimeRemaining(unlockDate: Date): string {
  const now = Date.now();
  const diff = unlockDate.getTime() - now;
  
  if (diff <= 0) return 'Ready to withdraw';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }
  
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}

export function DepositCard({
  amount,
  amountUsd,
  unlockDate,
  depositDate,
  status,
  onWithdraw,
  onEarlyWithdraw,
  penaltyPercent = 10,
  isLoading = false,
}: DepositCardProps) {
  const progress = calculateProgress(depositDate, unlockDate);
  const timeRemaining = getTimeRemaining(unlockDate);
  const isUnlocked = status === 'unlocked' || new Date() >= unlockDate;

  const statusLabels = {
    locked: '🔒 Locked',
    unlocked: '🔓 Unlocked',
    pending: '⏳ Pending',
  };

  return (
    <div className="deposit-card">
      <div className="deposit-card__header">
        <div>
          <h3 className="deposit-card__amount">{amount} USDC</h3>
          {amountUsd && (
            <p className="deposit-card__amount-usd">≈ {amountUsd}</p>
          )}
        </div>
        <span className={`deposit-card__status deposit-card__status--${status}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="deposit-card__details">
        <div className="deposit-card__detail">
          <span className="deposit-card__detail-label">Deposited</span>
          <span className="deposit-card__detail-value">
            {formatDate(depositDate)}
          </span>
        </div>
        <div className="deposit-card__detail">
          <span className="deposit-card__detail-label">Unlocks</span>
          <span className="deposit-card__detail-value">
            {formatDate(unlockDate)} at {formatTime(unlockDate)}
          </span>
        </div>
      </div>

      <div className="deposit-card__progress">
        <div className="deposit-card__progress-header">
          <span className="deposit-card__progress-label">{timeRemaining}</span>
          <span className="deposit-card__progress-value">{progress}%</span>
        </div>
        <div className="deposit-card__progress-bar">
          <div 
            className="deposit-card__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="deposit-card__actions">
        {isUnlocked ? (
          <button
            className="deposit-card__action deposit-card__action--primary"
            onClick={onWithdraw}
            disabled={isLoading || status === 'pending'}
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </button>
        ) : (
          <>
            <button
              className="deposit-card__action deposit-card__action--secondary"
              disabled
            >
              Locked
            </button>
            <button
              className="deposit-card__action deposit-card__action--warning"
              onClick={onEarlyWithdraw}
              disabled={isLoading || status === 'pending'}
            >
              {isLoading ? 'Processing...' : 'Early Withdraw'}
            </button>
          </>
        )}
      </div>

      {!isUnlocked && (
        <div className="deposit-card__penalty-warning">
          <span className="deposit-card__penalty-icon">⚠️</span>
          <span>
            Early withdrawal incurs a {penaltyPercent}% penalty
          </span>
        </div>
      )}
    </div>
  );
}
