import "./SavingsSummary.css";

interface SavingsSummaryProps {
  totalDeposited: string;
  totalLocked: string;
  totalWithdrawn: string;
  activeDeposits: number;
  completedDeposits: number;
  isLoading?: boolean;
}

export function SavingsSummary({
  totalDeposited,
  totalLocked,
  totalWithdrawn,
  activeDeposits,
  completedDeposits,
  isLoading,
}: SavingsSummaryProps) {
  const formatValue = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const savingsRate =
    parseFloat(totalDeposited) > 0
      ? ((parseFloat(totalLocked) / parseFloat(totalDeposited)) * 100).toFixed(0)
      : "0";

  return (
    <div className="savings-summary">
      <h3 className="summary-title">📈 Savings Summary</h3>

      <div className="summary-stats">
        <div className="stat-card primary">
          <span className="stat-label">Currently Locked</span>
          <span className="stat-amount">
            {isLoading ? (
              <span className="skeleton">Loading...</span>
            ) : (
              <>
                <span className="currency">$</span>
                {formatValue(totalLocked)}
              </>
            )}
          </span>
          <span className="stat-sublabel">USDC in vault</span>
        </div>

        <div className="mini-stats">
          <div className="mini-stat">
            <span className="mini-label">Total Deposited</span>
            <span className="mini-value">
              {isLoading ? "--" : `$${formatValue(totalDeposited)}`}
            </span>
          </div>
          <div className="mini-stat">
            <span className="mini-label">Total Withdrawn</span>
            <span className="mini-value">
              {isLoading ? "--" : `$${formatValue(totalWithdrawn)}`}
            </span>
          </div>
          <div className="mini-stat">
            <span className="mini-label">Active Locks</span>
            <span className="mini-value">
              {isLoading ? "--" : activeDeposits}
            </span>
          </div>
          <div className="mini-stat">
            <span className="mini-label">Completed</span>
            <span className="mini-value">
              {isLoading ? "--" : completedDeposits}
            </span>
          </div>
        </div>
      </div>

      <div className="savings-progress">
        <div className="progress-header">
          <span>Savings Discipline Score</span>
          <span className="progress-value">{savingsRate}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(parseFloat(savingsRate), 100)}%` }}
          />
        </div>
        <p className="progress-hint">
          {parseFloat(savingsRate) >= 80
            ? "🎉 Excellent! You're maintaining great savings discipline!"
            : parseFloat(savingsRate) >= 50
            ? "💪 Good progress! Keep locking to build discipline."
            : "🌱 Start locking USDC to build your savings habit!"}
        </p>
      </div>
    </div>
  );
}
