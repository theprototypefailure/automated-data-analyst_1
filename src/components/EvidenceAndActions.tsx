import React from 'react';
import { Evidence, Recommendation } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';

interface EvidenceAndActionsProps {
  evidence: Evidence[];
  recommendations: Recommendation[];
}

export const EvidenceAndActions: React.FC<EvidenceAndActionsProps> = ({
  evidence,
  recommendations,
}) => {
  return (
    <div className="space-y-8 my-6">
      {/* SECTION 1: RECOMMENDATIONS */}
      <div>
        <div className="section-heading flex items-center justify-between mb-4">
          <div>
            <div className="section-kicker flex items-center gap-1">
              <Compass size={13} />
              <span>Next Steps & Recommendations</span>
            </div>
            <h2>Decision-Ready Actions</h2>
            <p>Interpretation separated from factual evidence. Focus on highest-impact levers first.</p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="recommendation">
              <div className="recommendation-top flex items-center gap-2 mb-1">
                <span
                  className={`priority ${
                    rec.priority === 'HIGH'
                      ? 'bg-ada-red text-white'
                      : rec.priority === 'MEDIUM'
                      ? 'bg-ada-amber text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {rec.priority} PRIORITY
                </span>
                <h3>{rec.title}</h3>
              </div>
              <p>{rec.action}</p>
              <div className="why">
                <strong>Rationale:</strong> {rec.rationale}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: EVIDENCE LEDGER */}
      <div>
        <div className="section-heading flex items-center justify-between mb-4">
          <div>
            <div className="section-kicker flex items-center gap-1">
              <ShieldCheck size={13} />
              <span>Facts Before Opinions</span>
            </div>
            <h2>Evidence Ledger</h2>
            <p>Every finding carries its underlying mathematical calculation for complete auditability.</p>
          </div>
        </div>

        <div className="evidence-grid">
          {evidence.map((item, idx) => {
            let toneCls = '';
            if (item.tone === 'positive') toneCls = 'positive';
            else if (item.tone === 'negative') toneCls = 'negative';
            else if (item.tone === 'warning') toneCls = 'warning';

            return (
              <div key={idx} className={`evidence ${toneCls}`}>
                <div className="evidence-value">{item.value}</div>
                <h3>{item.title}</h3>
                <p>{item.statement}</p>
                <div className="calculation">{item.calculation}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
