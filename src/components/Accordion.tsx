import React, { useState } from 'react';
import './Accordion.css';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="accordion">
      {items.map(item => (
        <div key={item.id} className="accordion-item">
          <button className="accordion-header" onClick={() => toggle(item.id)}>
            <span>{item.title}</span>
            <span className={`accordion-icon ${openItems.includes(item.id) ? 'open' : ''}`}>▼</span>
          </button>
          {openItems.includes(item.id) && (
            <div className="accordion-content">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};
