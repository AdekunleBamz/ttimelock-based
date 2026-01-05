import { useState } from "react";
import { LOCK_DURATIONS, MIN_DEPOSIT } from "../config/contracts";
import "./DepositForm.css";

interface DepositFormProps {
  usdcBalance: string;
  txPending: boolean;
  onDeposit: (amount: number, duration: number) => Promise<void>;
}

export function DepositForm({ usdcBalance, txPending, onDeposit }: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(LOCK_DURATIONS[0].value);

  const amountNum = parseFloat(amount) || 0;
  const fee = amountNum * 0.005; // 0.5%
  const netDeposit = amountNum - fee;

  const isValid = amountNum >= MIN_DEPOSIT && amountNum <= parseFloat(usdcBalance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || txPending) return;
    await onDeposit(amountNum, duration);
    setAmount("");
  };

  const setMax = () => {
    setAmount(usdcBalance);
  };

  return (
    <form className="deposit-form" onSubmit={handleSubmit}>
      <h2>🔒 Lock USDC</h2>

      <div className="form-group">
        <label>Amount (USDC)</label>
        <div className="input-row">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min: ${MIN_DEPOSIT} USDC`}
            step="0.01"
            min={MIN_DEPOSIT}
            disabled={txPending}
          />
          <button type="button" className="max-btn" onClick={setMax} disabled={txPending}>
            MAX
          </button>
        </div>
        <span className="balance">Balance: {parseFloat(usdcBalance).toFixed(2)} USDC</span>
      </div>

      <div className="form-group">
        <label>Lock Duration</label>
        <div className="duration-buttons">
          {LOCK_DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`duration-btn ${duration === d.value ? "active" : ""}`}
              onClick={() => setDuration(d.value)}
              disabled={txPending}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {amountNum > 0 && (
        <div className="summary">
          <div className="summary-row">
            <span>Deposit Amount:</span>
            <span>{amountNum.toFixed(2)} USDC</span>
          </div>
          <div className="summary-row fee">
            <span>Creator Fee (0.5%):</span>
            <span>-{fee.toFixed(4)} USDC</span>
          </div>
          <div className="summary-row net">
            <span>You'll Lock:</span>
            <span>{netDeposit.toFixed(4)} USDC</span>
          </div>
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={!isValid || txPending}>
        {txPending ? "Processing..." : "🔐 Deposit & Lock"}
      </button>

      {amountNum < MIN_DEPOSIT && amount !== "" && (
        <p className="error">Minimum deposit is {MIN_DEPOSIT} USDC</p>
      )}
    </form>
  );
}
