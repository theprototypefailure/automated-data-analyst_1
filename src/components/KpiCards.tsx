import React from 'react';
import { KPI } from '../types';

interface KpiCardsProps {
  kpis: KPI[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  return (
    <div className="kpi-grid">
      {kpis.map((kpi, idx) => {
        const toneClass =
          kpi.tone === 'positive' ? 'positive' : kpi.tone === 'negative' ? 'negative' : '';
        return (
          <div key={idx} className={`kpi-card ${toneClass}`}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-context">{kpi.context}</div>
          </div>
        );
      })}
    </div>
  );
};
