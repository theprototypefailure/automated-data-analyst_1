import React, { useEffect, useMemo, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero, HowItWorks } from './components/Hero';
import { DataSourceControls } from './components/DataSourceControls';
import { DatasetBar } from './components/DatasetBar';
import { ExecutiveBriefCard } from './components/ExecutiveBriefCard';
import { KpiCards } from './components/KpiCards';
import { ChartsSection } from './components/ChartsSection';
import { AskAdaSection } from './components/AskAdaSection';
import { EvidenceAndActions } from './components/EvidenceAndActions';
import { DataAuditDrawer } from './components/DataAuditDrawer';

import { ColumnRoles, DataRow } from './types';
import { makeDemoData } from './lib/demoData';
import { detectRoles } from './lib/schema';
import { analyzeDataset } from './lib/analytics';

export const App: React.FC = () => {
  const [datasetName, setDatasetName] = useState<string>('Deterministic Demo');
  const [rawRows, setRawRows] = useState<DataRow[]>(() => makeDemoData(17, 1800));
  const [rowLimit, setRowLimit] = useState<number>(25000);
  const [roles, setRoles] = useState<ColumnRoles>(() => detectRoles(makeDemoData(17, 1800)));
  const [drillDownFilter, setDrillDownFilter] = useState<{ dimension: string; value: string } | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);

  // When rawRows change, re-detect roles and reset drilldown
  const handleDataLoaded = (newRows: DataRow[], name: string) => {
    setDatasetName(name);
    setRawRows(newRows);
    setDrillDownFilter(null);
    const newRoles = detectRoles(newRows);
    setRoles(newRoles);
  };

  // Filter rows if drillDown is active
  const activeRows = useMemo(() => {
    if (!drillDownFilter) return rawRows;
    return rawRows.filter(
      (r) => String(r[drillDownFilter.dimension] || '') === drillDownFilter.value
    );
  }, [rawRows, drillDownFilter]);

  // Adjust roles if drilled down: if we drilled into the dimension, pick next available dimension
  const effectiveRoles = useMemo(() => {
    if (!drillDownFilter) return roles;
    if (roles.dimension === drillDownFilter.dimension) {
      // Pick next available dimension
      const nextDim = roles.dimensions.find((d) => d !== drillDownFilter.dimension) || null;
      return { ...roles, dimension: nextDim };
    }
    return roles;
  }, [roles, drillDownFilter]);

  // Compute analysis brief
  const brief = useMemo(() => {
    return analyzeDataset(activeRows, effectiveRoles);
  }, [activeRows, effectiveRoles]);

  const availableColumns = useMemo(() => {
    return rawRows.length > 0 ? Object.keys(rawRows[0]) : [];
  }, [rawRows]);

  const handleSegmentClick = (segment: string) => {
    if (roles.dimension && segment !== 'Other') {
      setDrillDownFilter({ dimension: roles.dimension, value: segment });
    }
  };

  return (
    <div className="min-h-screen text-ada-ink">
      <div className="block-container">
        {/* Navigation */}
        <Nav />

        {/* Hero Header */}
        <Hero />

        {/* Data Source & Sample Selector */}
        <DataSourceControls
          currentDataset={datasetName}
          onDataLoaded={handleDataLoaded}
          rowLimit={rowLimit}
          onRowLimitChange={setRowLimit}
        />

        {/* Dataset Control Bar */}
        <DatasetBar
          datasetName={datasetName}
          rowCount={activeRows.length}
          roles={effectiveRoles}
          availableColumns={availableColumns}
          onRoleChange={setRoles}
          drillDownFilter={drillDownFilter}
          onClearDrillDown={() => setDrillDownFilter(null)}
          onOpenAudit={() => setIsAuditOpen(true)}
        />

        {/* Executive Brief */}
        <ExecutiveBriefCard brief={brief} />

        {/* KPI Cards */}
        <KpiCards kpis={brief.kpis} />

        {/* Visualizations (Trend/Forecast, Segments, Waterfall, Heatmap) */}
        <ChartsSection brief={brief} onSegmentClick={handleSegmentClick} />

        {/* Ask ADA (Natural Language Query) */}
        <AskAdaSection rows={activeRows} roles={effectiveRoles} />

        {/* Evidence Ledger & Prioritized Recommendations */}
        <EvidenceAndActions
          evidence={brief.evidence}
          recommendations={brief.recommendations}
        />

        {/* How it works grid */}
        <HowItWorks />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-ada-line text-center text-xs text-ada-muted space-y-1">
          <p className="font-semibold text-slate-700">ADA: Automated Data Analyst</p>
          <p>Local, deterministic data analysis. Zero external telemetry or network leak of raw records.</p>
        </footer>

        {/* Data Audit Drawer Modal */}
        <DataAuditDrawer
          isOpen={isAuditOpen}
          onClose={() => setIsAuditOpen(false)}
          rows={activeRows}
          datasetName={datasetName}
          roles={effectiveRoles}
          brief={brief}
        />
      </div>
    </div>
  );
};
export default App;
