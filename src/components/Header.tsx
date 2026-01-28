import { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">🔐</span>
        <span className="logo-text">TimeVault</span>
      </div>

      {/* Desktop Wallet View */}
      <div className="desktop-wallet">
        {renderWalletContent(wallet, ethBalance)}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="burger-btn" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {renderWalletContent(wallet, ethBalance, true)}
        </div>
      )}
    </header>
  );
}

function renderWalletContent(wallet: WalletInfo, ethBalance?: string, isMobile = false) {
  if (!wallet.isConnected) {
    return (
      <button
        className={`connect-btn ${isMobile ? "mobile" : ""}`}
        onClick={wallet.connect}
        disabled={wallet.isConnecting}
      >
        {wallet.isConnecting ? (
          <>
            <span className="spinner"></span> Connecting...
          </>
        ) : (
          <>
            <span className="wallet-icon">🦊</span> Connect Wallet
          </>
        )}
      </button>
    );
  }

  if (!wallet.isCorrectChain) {
    return (
      <button className={`switch-btn ${isMobile ? "mobile" : ""}`} onClick={wallet.switchToBase}>
        <span className="warning-icon">⚠️</span> Switch to Base
      </button>
    );
  }

  return (
    <div className={`wallet-info ${isMobile ? "mobile" : ""}`}>
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
      <button className="disconnect-btn" onClick={wallet.disconnect} title="Disconnect">
        ✕
      </button>
    </div>
  );
}
