import React from 'react';
import './Link.css';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: 'default' | 'muted';
}

export const Link: React.FC<LinkProps> = ({ href, children, external = false, variant = 'default' }) => {
  return (
    <a
      href={href}
      className={`link link-${variant}`}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {children}
      {external && <span className="link-external">↗</span>}
    </a>
  );
};
