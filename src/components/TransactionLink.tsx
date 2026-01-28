import React from 'react';
import './TransactionLink.css';

interface TransactionLinkProps {
  txHash: string;
  chainId?: number;
  label?: string;
}

const getExplorerUrl = (chainId: number, txHash: string) => {
  const explorers: Record<number, string> = {
    8453: 'https://basescan.org',
    84532: 'https://sepolia.basescan.org',
  };
  return `${explorers[chainId] || explorers[8453]}/tx/${txHash}`;
};

export const TransactionLink: React.FC<TransactionLinkProps> = ({ 
  txHash, 
  chainId = 8453, 
  label = 'View Transaction' 
}) => {
  const shortHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

  return (
    <a
      href={getExplorerUrl(chainId, txHash)}
      target="_blank"
      rel="noopener noreferrer"
      className="transaction-link"
    >
      <span className="tx-label">{label}</span>
      <span className="tx-hash">{shortHash}</span>
      <span className="tx-icon">↗</span>
    </a>
  );
};
