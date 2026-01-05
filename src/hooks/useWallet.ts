import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { BASE_MAINNET } from "../config/contracts";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectChain = chainId === BASE_MAINNET.chainId;

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));

      const signer = await provider.getSigner();
      setSigner(signer);
      setAddress(accounts[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const switchToBase = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_MAINNET.chainIdHex }],
      });
    } catch (switchError: unknown) {
      // Chain not added, try to add it
      if (switchError && typeof switchError === "object" && "code" in switchError && switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BASE_MAINNET.chainIdHex,
                chainName: BASE_MAINNET.name,
                nativeCurrency: BASE_MAINNET.nativeCurrency,
                rpcUrls: [BASE_MAINNET.rpcUrl],
                blockExplorerUrls: [BASE_MAINNET.blockExplorer],
              },
            ],
          });
        } catch {
          setError("Failed to add Base network");
        }
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setChainId(null);
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accts = accounts as string[];
      if (accts.length === 0) {
        disconnect();
      } else {
        setAddress(accts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return {
    address,
    signer,
    chainId,
    isConnecting,
    isConnected: !!address,
    isCorrectChain,
    error,
    connect,
    switchToBase,
    disconnect,
  };
}
