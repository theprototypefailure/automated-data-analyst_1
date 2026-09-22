import React from 'react';
import { ColumnRoles } from '../types';
import { Calendar, DollarSign, Layers, X, SlidersHorizontal } from 'lucide-react';

interface DatasetBarProps {
  datasetName: string;
  rowCount: number;
  roles: ColumnRoles;
  availableColumns: string[];
  onRoleChange: (newRoles: ColumnRoles) => void;
  drillDownFilter: { dimension: string; value: string } | null;
  onClearDrillDown: () => void;
  onOpenAudit: () => void;
}

export const DatasetBar: React.FC<DatasetBarProps> = ({
  datasetName,
  rowCount,
  roles,
  availableColumns,
  onRoleChange,
  drillDownFilter,
  onClearDrillDown,
  onOpenAudit,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-ada-line shadow-sm mb-4">
      {/* Dataset & Roles Info */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-sm text-ada-ink mr-1">{datasetName}</span>
        <span className="text-xs text-ada-muted font-medium bg-slate-100 px-2 py-0.5 rounded-md">
          {rowCount.toLocaleString()} rows
        </span>

        {/* Role Chips with Selector overrides */}
        <div className="flex flex-wrap items-center gap-1.5 ml-2">
          {/* Measure */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-ada-accent-soft text-ada-accent rounded-lg border border-ada-accent/20 text-xs font-bold">
            <DollarSign size={11} className="shrink-0" />
            <span className="text-[10px] text-ada-accent/70 uppercase">Measure:</span>
            <select
              value={roles.measure || ''}
              onChange={(e) => onRoleChange({ ...roles, measure: e.target.value || null })}
              className="bg-transparent font-bold text-ada-accent focus:outline-none cursor-pointer"
            >
              <option value="">None</option>
              {availableColumns.map((c) => (
                <option key={c} value={c} className="text-slate-800">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold">
            <Calendar size={11} className="shrink-0" />
            <span className="text-[10px] text-emerald-600/70 uppercase">Date:</span>
            <select
              value={roles.date || ''}
              onChange={(e) => onRoleChange({ ...roles, date: e.target.value || null })}
              className="bg-transparent font-bold text-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="">None</option>
              {availableColumns.map((c) => (
                <option key={c} value={c} className="text-slate-800">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-xs font-bold">
            <Layers size={11} className="shrink-0" />
            <span className="text-[10px] text-amber-700/70 uppercase">Segment:</span>
            <select
              value={roles.dimension || ''}
              onChange={(e) => onRoleChange({ ...roles, dimension: e.target.value || null })}
              className="bg-transparent font-bold text-amber-800 focus:outline-none cursor-pointer"
            >
              <option value="">None</option>
              {availableColumns.map((c) => (
                <option key={c} value={c} className="text-slate-800">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Drilldown & Actions */}
      <div className="flex items-center gap-2">
        {drillDownFilter && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ada-ink text-white rounded-lg text-xs font-semibold shadow-sm animate-pulse">
            <span>Filtered: <strong>{drillDownFilter.dimension}</strong> = "{drillDownFilter.value}"</span>
            <button
              type="button"
              onClick={onClearDrillDown}
              className="hover:text-ada-lime transition-colors p-0.5 rounded-full"
              title="Clear drilldown filter"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenAudit}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-ada-line rounded-lg text-xs font-semibold transition-all shadow-2xs hover:border-slate-300"
        >
          <SlidersHorizontal size={12} />
          <span>Data Audit & Export</span>
        </button>
      </div>
    </div>
  );
};
