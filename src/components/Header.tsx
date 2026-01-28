import { useState } from "react";
import { Tooltip } from "./Tooltip";
import "./Header.css";

interface WalletInfo {
// ... existing code ...
  switchToBase: () => Promise<void>;
}

interface HeaderProps {
  wallet: WalletInfo;
  ethBalance?: string;
}

export function Header({ wallet, ethBalance }: HeaderProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
// ... existing code ...
            <div className="address-badge">
              <span className="address">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </span>
              <Tooltip content={copySuccess ? "Copied!" : "Copy address"} position="bottom">
                <button
                  className="copy-btn"
                  onClick={handleCopy}
                  aria-label="Copy wallet address"
                >
                  {copySuccess ? "✅" : "📋"}
                </button>
              </Tooltip>
            </div>
            <Tooltip content="Disconnect wallet" position="bottom">
              <button
                className="disconnect-btn"
                onClick={wallet.disconnect}
                aria-label="Disconnect wallet"
              >
                ✕
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </header>
  );
}
