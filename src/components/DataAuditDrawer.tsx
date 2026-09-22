import React, { useState } from 'react';
import Papa from 'papaparse';
import { BusinessBrief, ColumnRoles, DataRow } from '../types';
import { X, Download, FileText, CheckCircle, Database } from 'lucide-react';

interface DataAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rows: DataRow[];
  datasetName: string;
  roles: ColumnRoles;
  brief: BusinessBrief;
}

export const DataAuditDrawer: React.FC<DataAuditDrawerProps> = ({
  isOpen,
  onClose,
  rows,
  datasetName,
  roles,
  brief,
}) => {
  if (!isOpen) return null;

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const previewRows = rows.slice(0, 10);

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cleaned-${datasetName.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMarkdown = () => {
    let md = `# Executive Brief: ${datasetName}\n\n`;
    md += `## ${brief.headline}\n\n`;
    md += `${brief.summary}\n\n`;

    md += `### Key Performance Indicators\n`;
    brief.kpis.forEach((k) => {
      md += `- **${k.label}**: ${k.value} (${k.context})\n`;
    });
    md += `\n`;

    md += `### Decision-Ready Actions & Recommendations\n`;
    brief.recommendations.forEach((r, i) => {
      md += `${i + 1}. **[${r.priority}] ${r.title}**\n   - Action: ${r.action}\n   - Rationale: ${r.rationale}\n\n`;
    });

    md += `### Evidence Ledger\n`;
    brief.evidence.forEach((e) => {
      md += `#### ${e.title} (${e.value})\n`;
      md += `${e.statement}\n`;
      md += `*Calculation: \`${e.calculation}\`*\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `executive-brief-${datasetName.toLowerCase().replace(/\s+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ada-line bg-slate-50">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-ada-accent" />
            <h2 className="font-display font-bold text-base text-ada-ink">
              Data Audit & Export ({datasetName})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cleaning Audit Card */}
          <div className="p-4 rounded-xl border border-ada-line bg-slate-50">
            <h3 className="font-bold text-xs uppercase text-ada-muted mb-2 tracking-wider">
              Cleaning & Schema Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-ada-muted font-bold">TOTAL ROWS</div>
                <div className="text-base font-bold text-ada-ink">{rows.length.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-ada-muted font-bold">DETECTED MEASURE</div>
                <div className="text-base font-bold text-ada-accent truncate">{roles.measure || 'None'}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-ada-muted font-bold">DETECTED DATE</div>
                <div className="text-base font-bold text-emerald-700 truncate">{roles.date || 'None'}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-ada-muted font-bold">DETECTED SEGMENT</div>
                <div className="text-base font-bold text-amber-800 truncate">{roles.dimension || 'None'}</div>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ada-ink hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Download size={14} />
              <span>Download Cleaned CSV</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-ada-line rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <FileText size={14} />
              <span>Export Executive Brief (.md)</span>
            </button>
          </div>

          {/* Data Sample Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs uppercase text-ada-muted tracking-wider">
                Sample Data Records (First {previewRows.length} rows)
              </h3>
            </div>
            <div className="overflow-x-auto border border-ada-line rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-ada-line">
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="p-2.5 font-bold text-slate-700 whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/70">
                      {columns.map((c) => (
                        <td key={c} className="p-2.5 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                          {r[c] !== null && r[c] !== undefined ? String(r[c]) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ada-line bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
