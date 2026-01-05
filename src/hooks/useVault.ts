import { useState, useEffect, useCallback } from "react";
import { Contract, formatUnits, parseUnits, JsonRpcSigner } from "ethers";
import { CONTRACTS, USDC_DECIMALS } from "../config/contracts";
import { ERC20_ABI, VAULT_ROUTER_ABI, TIMELOCK_VAULT_ABI } from "../abi";

export interface DepositInfo {
  id: number;
  owner: string;
  principal: bigint;
  principalFormatted: string;
  startTime: Date;
  unlockTime: Date;
  withdrawn: boolean;
  isUnlocked: boolean;
}

export function useVault(signer: JsonRpcSigner | null, address: string | null) {
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [deposits, setDeposits] = useState<DepositInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Refresh USDC balance and allowance
  const refreshBalances = useCallback(async () => {
    if (!signer || !address) return;

    try {
      const usdc = new Contract(CONTRACTS.USDC, ERC20_ABI, signer);
      const balance = await usdc.balanceOf(address);
      const allow = await usdc.allowance(address, CONTRACTS.VAULT_ROUTER);

      setUsdcBalance(formatUnits(balance, USDC_DECIMALS));
      setAllowance(allow);
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    }
  }, [signer, address]);

  // Fetch user deposits
  const refreshDeposits = useCallback(async () => {
    if (!signer || !address) return;

    setIsLoading(true);
    try {
      const vault = new Contract(CONTRACTS.TIMELOCK_VAULT, TIMELOCK_VAULT_ABI, signer);
      const nextId = await vault.nextDepositId();
      const userDeposits: DepositInfo[] = [];

      // Scan all deposits (in production, use events for efficiency)
      for (let i = 1; i < Number(nextId); i++) {
        try {
          const d = await vault.deposits(i);
          if (d.owner.toLowerCase() === address.toLowerCase()) {
            const now = new Date();
            const unlockTime = new Date(Number(d.unlockTime) * 1000);

            userDeposits.push({
              id: i,
              owner: d.owner,
              principal: d.principal,
              principalFormatted: formatUnits(d.principal, USDC_DECIMALS),
              startTime: new Date(Number(d.startTime) * 1000),
              unlockTime,
              withdrawn: d.withdrawn,
              isUnlocked: now >= unlockTime,
            });
          }
        } catch {
          // Skip invalid deposits
        }
      }

      setDeposits(userDeposits);
    } catch (err) {
      console.error("Failed to fetch deposits:", err);
    } finally {
      setIsLoading(false);
    }
  }, [signer, address]);

  // One-click deposit (approve if needed + deposit)
  const deposit = useCallback(
    async (amountUsdc: number, durationSeconds: number) => {
      if (!signer) throw new Error("No signer");

      setTxPending(true);
      setTxStatus(null);

      try {
        const usdc = new Contract(CONTRACTS.USDC, ERC20_ABI, signer);
        const router = new Contract(CONTRACTS.VAULT_ROUTER, VAULT_ROUTER_ABI, signer);

        const amountWei = parseUnits(amountUsdc.toString(), USDC_DECIMALS);

        // Check allowance
        const currentAllowance = await usdc.allowance(await signer.getAddress(), CONTRACTS.VAULT_ROUTER);

        if (currentAllowance < amountWei) {
          setTxStatus("Approving USDC...");
          const approveTx = await usdc.approve(CONTRACTS.VAULT_ROUTER, amountWei);
          await approveTx.wait();
          setTxStatus("Approved! Now depositing...");
        }

        // Deposit
        setTxStatus("Depositing...");
        const depositTx = await router.deposit(amountWei, durationSeconds);
        const receipt = await depositTx.wait();

        setTxStatus("Deposit successful!");

        // Refresh data
        await refreshBalances();
        await refreshDeposits();

        return receipt;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transaction failed";
        setTxStatus(`Error: ${message}`);
        throw err;
      } finally {
        setTxPending(false);
      }
    },
    [signer, refreshBalances, refreshDeposits]
  );

  // Withdraw (normal)
  const withdraw = useCallback(
    async (depositId: number) => {
      if (!signer) throw new Error("No signer");

      setTxPending(true);
      setTxStatus("Withdrawing...");

      try {
        const vault = new Contract(CONTRACTS.TIMELOCK_VAULT, TIMELOCK_VAULT_ABI, signer);
        const tx = await vault.withdraw(depositId);
        await tx.wait();

        setTxStatus("Withdrawal successful!");
        await refreshBalances();
        await refreshDeposits();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Withdrawal failed";
        setTxStatus(`Error: ${message}`);
        throw err;
      } finally {
        setTxPending(false);
      }
    },
    [signer, refreshBalances, refreshDeposits]
  );

  // Emergency withdraw (10% penalty)
  const emergencyWithdraw = useCallback(
    async (depositId: number) => {
      if (!signer) throw new Error("No signer");

      setTxPending(true);
      setTxStatus("Emergency withdrawing (10% penalty)...");

      try {
        const vault = new Contract(CONTRACTS.TIMELOCK_VAULT, TIMELOCK_VAULT_ABI, signer);
        const tx = await vault.emergencyWithdraw(depositId);
        await tx.wait();

        setTxStatus("Emergency withdrawal successful!");
        await refreshBalances();
        await refreshDeposits();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Emergency withdrawal failed";
        setTxStatus(`Error: ${message}`);
        throw err;
      } finally {
        setTxPending(false);
      }
    },
    [signer, refreshBalances, refreshDeposits]
  );

  // Auto-refresh on mount and when signer changes
  useEffect(() => {
    if (signer && address) {
      refreshBalances();
      refreshDeposits();
    }
  }, [signer, address, refreshBalances, refreshDeposits]);

  return {
    usdcBalance,
    allowance,
    deposits,
    isLoading,
    txPending,
    txStatus,
    deposit,
    withdraw,
    emergencyWithdraw,
    refreshBalances,
    refreshDeposits,
  };
}
