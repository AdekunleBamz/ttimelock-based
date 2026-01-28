import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "📋" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
      title={copied ? "Copied!" : "Copy to clipboard"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        opacity: copied ? 1 : 0.7,
        transition: "opacity 0.2s",
        padding: "4px",
      }}
    >
      {copied ? "✓" : label}
    </button>
  );
}
