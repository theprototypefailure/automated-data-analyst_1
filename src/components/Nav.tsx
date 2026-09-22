import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export const Nav: React.FC = () => {
  return (
    <nav className="ada-nav" aria-label="Primary navigation">
      <div className="ada-brand">
        <div className="ada-mark">A</div>
        <div>
          <div className="ada-wordmark">ADA</div>
          <div className="ada-nav-note">Automated Data Analyst</div>
        </div>
      </div>
      <div className="nav-actions">
        <span className="trust-chip">
          <span className="trust-dot"></span>
          Deterministic core · AI optional
        </span>
        <a
          className="nav-link"
          href="https://github.com/theprototypefailure/automated-data-analyst_1"
          target="_blank"
          rel="noreferrer"
        >
          <span>GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </nav>
  );
};
