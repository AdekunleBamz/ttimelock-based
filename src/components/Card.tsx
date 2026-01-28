import React from "react";
import "./Card.css";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Card({ children, title, action, footer, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
