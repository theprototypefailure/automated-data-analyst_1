import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">Zero-config business intelligence</div>
        <h1>
          Drop a file.<br />
          <span className="grad">Get the business story.</span>
        </h1>
        <p>
          ADA turns CSV and Excel data into an executive dashboard, explains what changed,
          identifies the driver, and recommends the next move—without making you configure a BI tool.
        </p>
        <div className="proof-row">
          <span className="proof-pill">
            <strong>01</strong> Automatic schema detection
          </span>
          <span className="proof-pill">
            <strong>02</strong> Traceable calculations
          </span>
          <span className="proof-pill">
            <strong>03</strong> Decision-ready actions
          </span>
        </div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  return (
    <section className="how-grid">
      <article className="how-card">
        <div className="how-number">01 · DROP</div>
        <h3>Any business file</h3>
        <p>Upload CSV or Excel. ADA cleans common issues and detects the metric, date, segment, and identifiers.</p>
      </article>
      <article className="how-card">
        <div className="how-number">02 · TRACE</div>
        <h3>Facts before opinions</h3>
        <p>Every trend, driver, concentration signal, and exception exposes its calculation.</p>
      </article>
      <article className="how-card">
        <div className="how-number">03 · DECIDE</div>
        <h3>Actions, not chart clutter</h3>
        <p>Interpretation stays separate from evidence, with the highest-value investigation first.</p>
      </article>
    </section>
  );
};
