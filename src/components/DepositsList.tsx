import React, { useState } from "react";
import type { DepositInfo } from "../hooks/useVault";
import { Tooltip } from "./Tooltip";
import { DepositTimer } from "./DepositTimer";
import { Modal } from "./Modal";
import { EmptyState } from "./EmptyState";
import "./DepositsList.css";

interface DepositsListProps {
  deposits: DepositInfo[];
  isLoading: boolean;
  txPending: boolean;
  onWithdraw: (depositId: number) => Promise<void>;
  onEmergencyWithdraw: (depositId: number) => Promise<void>;
}

export function DepositsList({
  deposits,
  isLoading,
  txPending,
  onWithdraw,
  onEmergencyWithdraw,
}: DepositsListProps) {
  const [modalData, setModalData] = useState<{ id: number; penalty: string } | null>(null);

  const activeDeposits = deposits.filter((d) => !d.withdrawn);
  const withdrawnDeposits = deposits.filter((d) => d.withdrawn);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEmergencyClick = (depositId: number, principal: string) => {
    const penalty = (parseFloat(principal) * 0.1).toFixed(4);
    setModalData({ id: depositId, penalty });
  };

  const confirmEmergencyWithdraw = () => {
    if (modalData) {
      onEmergencyWithdraw(modalData.id);
    }
  };

  if (isLoading) {
    return (
      <div className="deposits-list">
        <h2>📦 Your Deposits</h2>
        <div className="loading">Loading deposits...</div>
      </div>
    );
  }

  return (
    <div className="deposits-list">
      <h2>📦 Your Deposits</h2>

      {activeDeposits.length === 0 && withdrawnDeposits.length === 0 && (
        <EmptyState
          icon="🌱"
          title="Start Your Savings Journey"
          description="You haven't made any deposits yet. Lock your USDC to build discipline and secure your future."
          actionLabel="Create Deposit"
          onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      )}

      {activeDeposits.length > 0 && (
        <div className="section">
          <h3>Active Locks</h3>
          {activeDeposits.map((deposit) => (
            <div key={deposit.id} className={`deposit-card ${deposit.isUnlocked ? "unlocked" : "locked"}`}>
              <div className="deposit-header">
                <span className="deposit-id">#{deposit.id}</span>
                <span className={`status ${deposit.isUnlocked ? "unlocked" : "locked"}`}>
                  {deposit.isUnlocked ? "🔓 Unlocked" : "🔒 Locked"}
                </span>
              </div>

              <div className="deposit-amount">{parseFloat(deposit.principalFormatted).toFixed(2)} USDC</div>

              <div className="deposit-details">
                <div className="detail">
                  <span className="label">Locked:</span>
                  <span>{formatDate(deposit.startTime)}</span>
                </div>
                <div className="detail">
                  <span className="label">Unlocks:</span>
                  <span>{formatDate(deposit.unlockTime)}</span>
                </div>
                <div className="detail time-remaining">
                  <span className="label">Status:</span>
                  <span className={deposit.isUnlocked ? "green" : "orange"}>
                    {deposit.isUnlocked ? "Ready to Withdraw" : <DepositTimer targetDate={deposit.unlockTime} />}
                  </span>
                </div>
              </div>

              <div className="deposit-actions">
                {deposit.isUnlocked ? (
                  <button
                    className="withdraw-btn"
                    onClick={() => onWithdraw(deposit.id)}
                    disabled={txPending}
                  >
                    ✅ Withdraw
                  </button>
                ) : (
                  <Tooltip
                    content="10% of your principal will be deducted as a penalty."
                    position="top"
                  >
                    <button
                      className="emergency-btn"
                      onClick={() => handleEmergencyClick(deposit.id, deposit.principalFormatted)}
                      disabled={txPending}
                      aria-label="Emergency withdraw with 10% penalty"
                    >
                      ⚠️ Emergency Withdraw
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {withdrawnDeposits.length > 0 && (
        <div className="section">
          <h3>History</h3>
          {withdrawnDeposits.map((deposit) => (
            <div key={deposit.id} className="deposit-card withdrawn">
              <div className="deposit-header">
                <span className="deposit-id">#{deposit.id}</span>
                <span className="status withdrawn">✓ Withdrawn</span>
              </div>
              <div className="deposit-amount">{parseFloat(deposit.principalFormatted).toFixed(2)} USDC</div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        title="⚠️ Confirm Emergency Withdraw"
        confirmLabel="Yes, Withdraw (Pay Penalty)"
        isDanger={true}
        onConfirm={confirmEmergencyWithdraw}
      >
        <p>You are about to withdraw funds before the lock period is over.</p>
        <div style={{ margin: "20px 0", padding: "15px", background: "rgba(255, 107, 107, 0.1)", borderRadius: "8px", border: "1px solid rgba(255, 107, 107, 0.3)" }}>
          <p style={{ margin: "0 0 5px 0", color: "#ff6b6b" }}><strong>Penalty Applied: 10%</strong></p>
          <p style={{ margin: 0 }}>Penalty Amount: <strong>{modalData?.penalty} USDC</strong></p>
        </div>
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </div>
  );
}
