import React from 'react';
import './VisuallyHidden.css';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: 'span' | 'div';
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children, as: Component = 'span' }) => {
  return <Component className="visually-hidden">{children}</Component>;
};
