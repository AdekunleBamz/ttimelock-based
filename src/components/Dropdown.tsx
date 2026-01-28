import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected?.label || placeholder}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map(option => (
            <li key={option.value} className={value === option.value ? 'selected' : ''} onClick={() => { onChange(option.value); setIsOpen(false); }}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
