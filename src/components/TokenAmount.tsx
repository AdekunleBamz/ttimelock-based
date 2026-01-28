import React from 'react';
import './TokenAmount.css';

interface TokenAmountProps {
  amount: string;
  symbol?: string;
  decimals?: number;
  showSymbol?: boolean;
}

export const TokenAmount: React.FC<TokenAmountProps> = ({ 
  amount, 
  symbol = 'USDC', 
  decimals = 2,
  showSymbol = true 
}) => {
  const formatted = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className="token-amount">
      <span className="amount-value">{formatted}</span>
      {showSymbol && <span className="amount-symbol">{symbol}</span>}
    </span>
  );
};
