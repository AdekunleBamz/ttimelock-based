import { useState, useEffect } from "react";
import { Contract, formatUnits, JsonRpcProvider } from "ethers";
import { CONTRACTS, USDC_DECIMALS, BASE_MAINNET } from "../config/contracts";
import { TIMELOCK_VAULT_ABI, ERC20_ABI } from "../abi";
import "./VaultStats.css";

interface VaultStatsData {
  tvl: string;
  totalDeposits: number;
  uniqueWallets: number;
  treasuryBalance: string;
}

export function VaultStats() {
  const [stats, setStats] = useState<VaultStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const provider = new JsonRpcProvider(BASE_MAINNET.rpcUrl);
        const vault = new Contract(CONTRACTS.TIMELOCK_VAULT, TIMELOCK_VAULT_ABI, provider);
        const usdc = new Contract(CONTRACTS.USDC, ERC20_ABI, provider);

        // Get TVL (USDC balance in vault)
        const vaultBalance = await usdc.balanceOf(CONTRACTS.TIMELOCK_VAULT);
        const treasuryBalance = await usdc.balanceOf(CONTRACTS.VAULT_TREASURY);
        
        // Get deposit count
        const nextDepositId = await vault.nextDepositId();
        const totalDeposits = Number(nextDepositId) - 1;

        // Count unique wallets by scanning deposits
        const uniqueWalletsSet = new Set<string>();
        for (let i = 1; i <= totalDeposits && i <= 200; i++) {
          try {
            const deposit = await vault.deposits(i);
            if (deposit.owner !== "0x0000000000000000000000000000000000000000") {
              uniqueWalletsSet.add(deposit.owner.toLowerCase());
            }
          } catch {
            // Skip errors
          }
        }

        setStats({
          tvl: formatUnits(vaultBalance, USDC_DECIMALS),
          totalDeposits,
          uniqueWallets: uniqueWalletsSet.size,
          treasuryBalance: formatUnits(treasuryBalance, USDC_DECIMALS),
        });
      } catch (err) {
        console.error("Failed to fetch vault stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="vault-stats loading">
        <div className="vault-stats-header">
          <h2>📊 Vault Statistics</h2>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-item skeleton">
              <div className="skeleton-text"></div>
              <div className="skeleton-value"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="vault-stats">
      <div className="vault-stats-header">
        <h2>📊 Vault Statistics</h2>
        <span className="live-badge">
          <span className="live-dot"></span>
          Live
        </span>
      </div>
      <div className="stats-grid">
        <div className="stat-item tvl">
          <span className="stat-icon">💰</span>
          <div className="stat-content">
            <span className="stat-label">Total Value Locked</span>
            <span className="stat-value">${parseFloat(stats.tvl).toFixed(2)}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <span className="stat-label">Total Deposits</span>
            <span className="stat-value">{stats.totalDeposits}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-label">Unique Wallets</span>
            <span className="stat-value">{stats.uniqueWallets}</span>
          </div>
        </div>
        <div className="stat-item treasury">
          <span className="stat-icon">🏦</span>
          <div className="stat-content">
            <span className="stat-label">Treasury (Fees)</span>
            <span className="stat-value">${parseFloat(stats.treasuryBalance).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
