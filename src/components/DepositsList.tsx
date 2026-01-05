import type { DepositInfo } from "../hooks/useVault";
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

  const getTimeRemaining = (unlockTime: Date) => {
    const now = new Date();
    const diff = unlockTime.getTime() - now.getTime();

    if (diff <= 0) return "Unlocked!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
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
        <div className="empty">No deposits yet. Start saving!</div>
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
                    {getTimeRemaining(deposit.unlockTime)}
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
                  <button
                    className="emergency-btn"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Emergency withdraw will cost you 10% (${(
                            parseFloat(deposit.principalFormatted) * 0.1
                          ).toFixed(4)} USDC). Continue?`
                        )
                      ) {
                        onEmergencyWithdraw(deposit.id);
                      }
                    }}
                    disabled={txPending}
                  >
                    ⚠️ Emergency Withdraw (-10%)
                  </button>
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
    </div>
  );
}
