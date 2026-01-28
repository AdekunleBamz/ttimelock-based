import React, { useState } from 'react';
import './TooltipV2.css';

interface TooltipV2Props {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const TooltipV2: React.FC<TooltipV2Props> = ({ content, position = 'top', children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-v2-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`tooltip-v2 tooltip-v2-${position}`}>
          {content}
        </div>
      )}
    </div>
  );
};
