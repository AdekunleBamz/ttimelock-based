import { useWallet, useVault } from "./hooks";
import {
  Header,
  DepositForm,
  DepositsList,
  TokenBalances,
  StatsCard,
  SavingsSummary,
  ToastContainer,
  useToast,
  VaultStats,
  Footer,
} from "./components";
import { useEffect, useCallback, useMemo } from "react";
import "./App.css";

function App() {
  const wallet = useWallet();
  const vault = useVault(wallet.signer, wallet.address);
  const toast = useToast();

  // Calculate stats
  const totalLocked = vault.deposits
    .filter((d) => !d.withdrawn)
    .reduce((sum, d) => sum + parseFloat(d.principalFormatted), 0)
    .toFixed(2);

  const totalDeposited = vault.deposits
    .reduce((sum, d) => sum + parseFloat(d.principalFormatted), 0)
    .toFixed(2);

  const totalWithdrawn = vault.deposits
    .filter((d) => d.withdrawn)
    .reduce((sum, d) => sum + parseFloat(d.principalFormatted), 0)
    .toFixed(2);

  const activeDeposits = vault.deposits.filter((d) => !d.withdrawn).length;
  const completedDeposits = vault.deposits.filter((d) => d.withdrawn).length;
  const unlockedDeposits = vault.deposits.filter(
    (d) => !d.withdrawn && d.isUnlocked
  ).length;

  const stats = useMemo(() => [
    {
      label: "Total Locked",
      value: `$${totalLocked}`,
      icon: "🔒",
    },
    {
      label: "Active Deposits",
      value: activeDeposits.toString(),
      icon: "📦",
    },
    {
      label: "Ready to Withdraw",
      value: unlockedDeposits.toString(),
      icon: "✅",
      changeType: unlockedDeposits > 0 ? ("positive" as const) : ("neutral" as const),
    },
    {
      label: "Network",
      value: wallet.isCorrectChain ? "Base" : "Wrong",
      icon: "🌐",
      changeType: wallet.isCorrectChain ? ("positive" as const) : ("negative" as const),
    },
  ], [totalLocked, activeDeposits, unlockedDeposits, wallet.isCorrectChain]);

  // Handle deposit with toast notifications
  const handleDeposit = useCallback(
    async (amount: number, duration: number) => {
      const toastId = toast.pending("Processing Deposit", "Waiting for wallet...");

      try {
        await vault.deposit(amount, duration);
        toast.removeToast(toastId);
        toast.success(
          "Deposit Successful!",
          `Locked ${amount} USDC for ${Math.floor(duration / 86400)} days`
        );
      } catch (err) {
        toast.removeToast(toastId);
        const message = err instanceof Error ? err.message : "Transaction failed";
        if (!message.includes("user rejected")) {
          toast.error("Deposit Failed", message);
        }
      }
    },
    [vault, toast]
  );

  // Handle withdraw with toast notifications
  const handleWithdraw = useCallback(
    async (depositId: number) => {
      const toastId = toast.pending("Processing Withdrawal", "Confirming transaction...");

      try {
        await vault.withdraw(depositId);
        toast.removeToast(toastId);
        toast.success("Withdrawal Successful!", "Funds returned to your wallet");
      } catch (err) {
        toast.removeToast(toastId);
        const message = err instanceof Error ? err.message : "Transaction failed";
        if (!message.includes("user rejected")) {
          toast.error("Withdrawal Failed", message);
        }
      }
    },
    [vault, toast]
  );

  // Handle emergency withdraw with toast notifications
  const handleEmergencyWithdraw = useCallback(
    async (depositId: number) => {
      const toastId = toast.pending(
        "Emergency Withdrawal",
        "10% penalty will apply..."
      );

      try {
        await vault.emergencyWithdraw(depositId);
        toast.removeToast(toastId);
        toast.warning(
          "Emergency Withdrawal Complete",
          "10% penalty was applied"
        );
      } catch (err) {
        toast.removeToast(toastId);
        const message = err instanceof Error ? err.message : "Transaction failed";
        if (!message.includes("user rejected")) {
          toast.error("Emergency Withdrawal Failed", message);
        }
      }
    },
    [vault, toast]
  );

  // Show connection toast
  useEffect(() => {
    if (wallet.isConnected && wallet.isCorrectChain) {
      toast.success(
        "Wallet Connected",
        `Connected to ${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.isConnected, wallet.isCorrectChain]);

  return (
    <div className="app">
      <Header wallet={wallet} ethBalance={wallet.ethBalance} />

      <main className="main">
        {/* Global Vault Stats - Always visible */}
        <VaultStats />

        {!wallet.isConnected ? (
          <div className="welcome">
            <div className="welcome-content">
              <h1>🔒 Timelock Savings Vault</h1>
              <p className="tagline">
                Build financial discipline by locking your USDC for a set period.
              </p>

              <div className="features">
                <div className="feature">
                  <span className="feature-icon">💰</span>
                  <div>
                    <h3>Minimum Deposit</h3>
                    <p>Start with as little as 0.1 USDC</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">⏱️</span>
                  <div>
                    <h3>Flexible Lock Periods</h3>
                    <p>Choose 3, 7, 14, or 30 days</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔐</span>
                  <div>
                    <h3>Secure & Transparent</h3>
                    <p>Verified contracts on Base</p>
                  </div>
                </div>
                <div className="feature warning">
                  <span className="feature-icon">⚠️</span>
                  <div>
                    <h3>Early Withdrawal</h3>
                    <p>10% penalty if you unlock early</p>
                  </div>
                </div>
              </div>

              <button className="connect-btn large" onClick={wallet.connect}>
                <span className="wallet-icon">🦊</span>
                Connect Wallet to Start
              </button>
            </div>
          </div>
        ) : !wallet.isCorrectChain ? (
          <div className="wrong-network">
            <div className="wrong-network-content">
              <span className="warning-big">⚠️</span>
              <h2>Wrong Network</h2>
              <p>Please switch to Base Mainnet to use TimeVault.</p>
              <button className="switch-btn large" onClick={wallet.switchToBase}>
                Switch to Base Mainnet
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard">
            {/* Top Row: Balances & Stats */}
            <div className="dashboard-top">
              <TokenBalances
                usdcBalance={vault.usdcBalance}
                ethBalance={wallet.ethBalance}
                totalLocked={totalLocked}
                isLoading={vault.isLoading}
              />
              <StatsCard stats={stats} isLoading={vault.isLoading} />
            </div>

            {/* Savings Summary */}
            <SavingsSummary
              totalDeposited={totalDeposited}
              totalLocked={totalLocked}
              totalWithdrawn={totalWithdrawn}
              activeDeposits={activeDeposits}
              completedDeposits={completedDeposits}
              isLoading={vault.isLoading}
            />

            {/* Main Content: Form & Deposits */}
            <div className="dashboard-main">
              <div className="left-panel">
                <DepositForm
                  usdcBalance={vault.usdcBalance}
                  txPending={vault.txPending}
                  onDeposit={handleDeposit}
                />
              </div>

              <div className="right-panel">
                <DepositsList
                  deposits={vault.deposits}
                  isLoading={vault.isLoading}
                  txPending={vault.txPending}
                  onWithdraw={handleWithdraw}
                  onEmergencyWithdraw={handleEmergencyWithdraw}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.removeToast} />
    </div>
  );
}

export default App;
