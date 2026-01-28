import React, { useState } from 'react';
import './CopyField.css';

interface CopyFieldProps {
  value: string;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export function CopyField({
  value,
  label,
  placeholder = 'Enter value',
  readOnly = true,
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      {label && <div className="copy-field__label">{label}</div>}
      <div className="copy-field">
        <input
          className="copy-field__input"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={() => undefined}
        />
        <button className="copy-field__button" onClick={handleCopy} disabled={!value}>
          Copy
        </button>
        {copied && <span className="copy-field__status">Copied</span>}
      </div>
    </div>
  );
}
