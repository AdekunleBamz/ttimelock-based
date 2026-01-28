import React, { useCallback } from 'react';
import './AmountInput.css';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  symbol?: string;
  balance?: string;
  maxAmount?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  decimals?: number;
}

export function AmountInput({
  value,
  onChange,
  label,
  symbol = 'USDC',
  balance,
  maxAmount,
  error,
  placeholder = '0.00',
  disabled = false,
  min = 0,
  decimals = 6,
}: AmountInputProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string
    if (newValue === '') {
      onChange('');
      return;
    }
    
    // Validate decimal format
    const regex = new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
    if (regex.test(newValue)) {
      onChange(newValue);
    }
  }, [onChange, decimals]);

  const handleMaxClick = useCallback(() => {
    if (maxAmount) {
      onChange(maxAmount);
    } else if (balance) {
      onChange(balance);
    }
  }, [onChange, maxAmount, balance]);

  const handleBlur = useCallback(() => {
    // Clean up value on blur (remove trailing zeros after decimal)
    if (value && value.includes('.')) {
      const cleaned = parseFloat(value).toString();
      if (!isNaN(parseFloat(cleaned))) {
        onChange(cleaned);
      }
    }
  }, [value, onChange]);

  return (
    <div className="amount-input">
      {label && <label className="amount-input__label">{label}</label>}
      
      <div className={`amount-input__wrapper ${error ? 'amount-input__wrapper--error' : ''}`}>
        <input
          type="text"
          inputMode="decimal"
          className="amount-input__field"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          aria-invalid={!!error}
          aria-describedby={error ? 'amount-error' : undefined}
        />
        
        {(balance || maxAmount) && (
          <button
            type="button"
            className="amount-input__max-btn"
            onClick={handleMaxClick}
            disabled={disabled}
          >
            MAX
          </button>
        )}
        
        <span className="amount-input__symbol">{symbol}</span>
      </div>
      
      <div className="amount-input__balance">
        {balance && (
          <span>
            Balance: <span className="amount-input__balance-value">{balance} {symbol}</span>
          </span>
        )}
        {error && <span id="amount-error" className="amount-input__error">{error}</span>}
      </div>
    </div>
  );
}
