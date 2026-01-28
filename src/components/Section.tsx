import React from 'react';
import './Section.css';

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, description, children, className = '' }) => {
  return (
    <section className={`section ${className}`}>
      {(title || description) && (
        <div className="section-header">
          {title && <h2 className="section-title">{title}</h2>}
          {description && <p className="section-description">{description}</p>}
        </div>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
};
