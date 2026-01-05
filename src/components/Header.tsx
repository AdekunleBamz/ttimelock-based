import "./Header.css";

interface WalletInfo {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectChain: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

interface HeaderProps {
  wallet: WalletInfo;
  ethBalance?: string;
}

export function Header({ wallet, ethBalance }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">🔐</span>
        <span className="logo-text">TimeVault</span>
      </div>

      <div className="wallet-section">
        {!wallet.isConnected ? (
          <button
            className="connect-btn"
            onClick={wallet.connect}
            disabled={wallet.isConnecting}
          >
            {wallet.isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="wallet-icon">🦊</span>
                Connect Wallet
              </>
            )}
          </button>
        ) : !wallet.isCorrectChain ? (
          <button className="switch-btn" onClick={wallet.switchToBase}>
            <span className="warning-icon">⚠️</span>
            Switch to Base
          </button>
        ) : (
          <div className="wallet-info">
            <div className="network-badge">
              <span className="network-dot"></span>
              <span>Base</span>
            </div>
            {ethBalance && (
              <div className="eth-balance">
                <span className="eth-icon">Ξ</span>
                <span>{parseFloat(ethBalance).toFixed(4)}</span>
              </div>
            )}
            <div className="address-badge">
              <span className="address">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(wallet.address || "")}
                title="Copy address"
              >
                📋
              </button>
            </div>
            <button
              className="disconnect-btn"
              onClick={wallet.disconnect}
              title="Disconnect"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
