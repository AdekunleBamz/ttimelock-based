import "./TokenBalances.css";

interface TokenBalancesProps {
  usdcBalance: string;
  ethBalance: string;
  totalLocked: string;
  isLoading?: boolean;
}

export function TokenBalances({
  usdcBalance,
  ethBalance,
  totalLocked,
  isLoading,
}: TokenBalancesProps) {
  const formatBalance = (balance: string, decimals: number = 2) => {
    const num = parseFloat(balance);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="token-balances">
      <h3 className="balances-title">💰 Your Balances</h3>
      
      <div className="balances-grid">
        <div className="balance-card usdc">
          <div className="token-icon">
            <img
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="fallback-icon">$</span>
          </div>
          <div className="balance-info">
            <span className="token-name">USDC</span>
            <span className="balance-value">
              {isLoading ? (
                <span className="skeleton">Loading...</span>
              ) : (
                formatBalance(usdcBalance)
              )}
            </span>
          </div>
        </div>

        <div className="balance-card eth">
          <div className="token-icon eth-icon">
            <span>Ξ</span>
          </div>
          <div className="balance-info">
            <span className="token-name">ETH</span>
            <span className="balance-value">
              {isLoading ? (
                <span className="skeleton">Loading...</span>
              ) : (
                formatBalance(ethBalance, 4)
              )}
            </span>
          </div>
        </div>

        <div className="balance-card locked">
          <div className="token-icon locked-icon">
            <span>🔒</span>
          </div>
          <div className="balance-info">
            <span className="token-name">Locked USDC</span>
            <span className="balance-value highlight">
              {isLoading ? (
                <span className="skeleton">Loading...</span>
              ) : (
                formatBalance(totalLocked)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
