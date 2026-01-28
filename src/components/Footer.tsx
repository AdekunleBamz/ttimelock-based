import React from 'react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
        <div className="footer-content">
          <p>
            Built on <strong>Base</strong> • Contracts verified on{" "}
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              BaseScan
            </a>
          </p>
          <div className="footer-links">
            <a
              href="https://github.com/AdekunleBamz/ttimelock-based"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
  );
}
