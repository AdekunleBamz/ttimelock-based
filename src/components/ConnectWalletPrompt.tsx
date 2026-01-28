import React from 'react';
import './ConnectWalletPrompt.css';

interface ConnectWalletPromptProps {
  onConnect: () => void;
}

export const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({ onConnect }) => {
  return (
    <div className="connect-wallet-prompt">
      <div className="wallet-icon">🔐</div>
      <h2>Connect Your Wallet</h2>
      <p>Connect your wallet to start using the Timelock Savings Vault</p>
      <button className="connect-btn" onClick={onConnect}>
        Connect Wallet
      </button>
    </div>
  );
};
