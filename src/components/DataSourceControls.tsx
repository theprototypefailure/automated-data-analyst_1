import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { UploadCloud, FileSpreadsheet, Check, Sparkles, AlertCircle } from 'lucide-react';
import { DataRow } from '../types';
import { makeDemoData } from '../lib/demoData';

interface DataSourceControlsProps {
  currentDataset: string;
  onDataLoaded: (rows: DataRow[], datasetName: string) => void;
  rowLimit: number;
  onRowLimitChange: (limit: number) => void;
}

export const DataSourceControls: React.FC<DataSourceControlsProps> = ({
  currentDataset,
  onDataLoaded,
  rowLimit,
  onRowLimitChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSampleClick = async (sampleName: string) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      if (sampleName === 'Deterministic Demo') {
        const rows = makeDemoData(17, Math.min(rowLimit, 1800));
        onDataLoaded(rows, 'Deterministic Demo');
      } else {
        const fileMap: Record<string, string> = {
          'SaaS Subscriptions': '/samples/saas-subscriptions.csv',
          'Ecommerce Orders': '/samples/ecommerce-orders.csv',
          'Support Tickets': '/samples/support-tickets.csv',
        };
        const path = fileMap[sampleName];
        if (!path) throw new Error('Unknown sample dataset');

        const resp = await fetch(path);
        if (!resp.ok) throw new Error(`Failed to load ${sampleName}`);
        const text = await resp.text();

        Papa.parse<DataRow>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          preview: rowLimit,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              onDataLoaded(results.data, sampleName);
            } else {
              setErrorMessage('Sample file contained no rows.');
            }
          },
          error: (err: any) => {
            setErrorMessage(`CSV parse error: ${err.message}`);
          },
        });
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error loading sample dataset.');
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setLoading(true);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse<DataRow>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        preview: rowLimit,
        complete: (results) => {
          setLoading(false);
          if (results.data && results.data.length > 0) {
            onDataLoaded(results.data, file.name);
          } else {
            setErrorMessage('Uploaded CSV contained no readable records.');
          }
        },
        error: (err) => {
          setLoading(false);
          setErrorMessage(`Error parsing CSV: ${err.message}`);
        },
      });
    } else if (ext === 'xlsx' || ext === 'xls' || ext === 'xlsm') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json<DataRow>(worksheet, {
            defval: null,
            raw: false,
          });

          setLoading(false);
          if (json && json.length > 0) {
            const limited = json.slice(0, rowLimit);
            onDataLoaded(limited, file.name);
          } else {
            setErrorMessage('Uploaded spreadsheet had no data in the first sheet.');
          }
        } catch (err: any) {
          setLoading(false);
          setErrorMessage(`Excel parse error: ${err.message}`);
        }
      };
      reader.onerror = () => {
        setLoading(false);
        setErrorMessage('Failed to read file.');
      };
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false);
      setErrorMessage('Unsupported format. Please upload a .csv or .xlsx file.');
    }
  };

  const samples = [
    { name: 'Deterministic Demo', badge: '1.8k rows' },
    { name: 'SaaS Subscriptions', badge: 'MRR & Churn' },
    { name: 'Ecommerce Orders', badge: 'Net Revenue' },
    { name: 'Support Tickets', badge: 'Resolution' },
  ];

  return (
    <div className="space-y-4 my-4">
      {/* Sample Pills & Limit */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white/70 backdrop-blur-md rounded-2xl border border-ada-line shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-ada-muted uppercase tracking-wider pl-2 pr-1">Samples:</span>
          {samples.map((s) => {
            const isActive = currentDataset === s.name;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => handleSampleClick(s.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  isActive
                    ? 'bg-ada-ink text-white border-ada-ink shadow-sm'
                    : 'bg-white hover:bg-ada-accent-soft/50 text-slate-700 border-ada-line hover:border-ada-accent/40'
                }`}
              >
                <span>{s.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {s.badge}
                </span>
                {isActive && <Check size={12} className="text-ada-lime" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pr-2 text-xs text-ada-muted">
          <label htmlFor="row-limit-select" className="font-medium">Row cap:</label>
          <select
            id="row-limit-select"
            value={rowLimit}
            onChange={(e) => onRowLimitChange(Number(e.target.value))}
            className="bg-white border border-ada-line rounded-lg px-2 py-1 text-slate-800 text-xs font-semibold focus:outline-none focus:border-ada-accent cursor-pointer"
          >
            <option value={1000}>1,000</option>
            <option value={5000}>5,000</option>
            <option value={25000}>25,000</option>
            <option value={250000}>250,000</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop File Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer p-6 rounded-2xl border-2 border-dashed transition-all text-center ${
          isDragging
            ? 'border-ada-accent bg-ada-accent-soft/40 shadow-md scale-[1.005]'
            : 'border-slate-300 hover:border-ada-accent/60 bg-white/80 hover:bg-white shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.xlsm"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-ada-accent-soft text-ada-accent flex items-center justify-center shadow-inner">
            <UploadCloud size={24} />
          </div>
          <div className="text-sm font-semibold text-slate-800">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-ada-accent animate-pulse">
                <Sparkles size={16} /> Analyzing file and inferring business schema...
              </span>
            ) : (
              <>
                Drop a <span className="text-ada-accent">CSV</span> or{' '}
                <span className="text-ada-accent">Excel</span> file here, or{' '}
                <span className="underline decoration-ada-accent/50 underline-offset-2">browse</span>
              </>
            )}
          </div>
          <p className="text-xs text-ada-muted max-w-md">
            Up to 25 MB. Fully processed in-browser with zero external server upload of raw rows.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
