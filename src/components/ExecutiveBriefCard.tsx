import React from 'react';
import { BusinessBrief } from '../types';

interface ExecutiveBriefCardProps {
  brief: BusinessBrief;
}

export const ExecutiveBriefCard: React.FC<ExecutiveBriefCardProps> = ({ brief }) => {
  return (
    <article className="brief">
      <div className="brief-top">
        <span className="signal-orb"></span>
        <span className="eyebrow">Executive Brief</span>
      </div>
      <h2>{brief.headline}</h2>
      <p>{brief.summary}</p>
      <div className="brief-trust flex items-center justify-between">
        <span>DETERMINISTIC VERIFICATION · CALCULATIONS SHOWN UNDER EVERY NUMBER</span>
        <span className="text-[11px] opacity-75">
          {brief.roles.measure || 'Records'} by {brief.roles.dimension || 'Segment'} over {brief.roles.date || 'Time'}
        </span>
      </div>
    </article>
  );
};
