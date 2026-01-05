import { useWallet, useVault } from "./hooks";
import { DepositForm, DepositsList } from "./components";
import "./App.css";

function App() {
  const wallet = useWallet();
  const vault = useVault(wallet.signer, wallet.address);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🔐</span>
          <span className="logo-text">TimeVault</span>
        </div>

        <div className="wallet-section">
          {!wallet.isConnected ? (
            <button className="connect-btn" onClick={wallet.connect} disabled={wallet.isConnecting}>
              {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : !wallet.isCorrectChain ? (
            <button className="switch-btn" onClick={wallet.switchToBase}>
              Switch to Base
            </button>
          ) : (
            <div className="wallet-info">
              <span className="network">Base Mainnet</span>
              <span className="address">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </span>
              <button className="disconnect-btn" onClick={wallet.disconnect}>
                ✕
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {!wallet.isConnected ? (
          <div className="welcome">
            <h1>🔒 Timelock Savings Vault</h1>
            <p>Lock your USDC for 3-30 days and build savings discipline.</p>
            <ul>
              <li>✅ Minimum deposit: 0.1 USDC</li>
              <li>✅ Lock periods: 3, 7, 14, or 30 days</li>
              <li>✅ 0.5% deposit fee</li>
              <li>⚠️ Emergency withdrawal: 10% penalty</li>
            </ul>
            <button className="connect-btn large" onClick={wallet.connect}>
              Connect Wallet to Start
            </button>
          </div>
        ) : !wallet.isCorrectChain ? (
          <div className="wrong-network">
            <h2>⚠️ Wrong Network</h2>
            <p>Please switch to Base Mainnet to use this app.</p>
            <button className="switch-btn large" onClick={wallet.switchToBase}>
              Switch to Base Mainnet
            </button>
          </div>
        ) : (
          <div className="dashboard">
            <div className="left-panel">
              <DepositForm
                usdcBalance={vault.usdcBalance}
                txPending={vault.txPending}
                onDeposit={vault.deposit}
              />

              {vault.txStatus && (
                <div className={`tx-status ${vault.txStatus.startsWith("Error") ? "error" : "success"}`}>
                  {vault.txStatus}
                </div>
              )}
            </div>

            <div className="right-panel">
              <DepositsList
                deposits={vault.deposits}
                isLoading={vault.isLoading}
                txPending={vault.txPending}
                onWithdraw={vault.withdraw}
                onEmergencyWithdraw={vault.emergencyWithdraw}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Built on <strong>Base</strong> • Contracts verified on BaseScan
        </p>
      </footer>

      {wallet.error && <div className="error-toast">{wallet.error}</div>}
    </div>
  );
}

export default App;
