import React, { useState } from 'react';
import { ColumnRoles, DataRow, QueryAnswer } from '../types';
import { answerQuestion, getSuggestedQuestions } from '../lib/nlq';
import { MessageSquare, Search, Sparkles, HelpCircle } from 'lucide-react';

interface AskAdaSectionProps {
  rows: DataRow[];
  roles: ColumnRoles;
}

export const AskAdaSection: React.FC<AskAdaSectionProps> = ({ rows, roles }) => {
  const [query, setQuery] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState<QueryAnswer | null>(null);

  const suggested = getSuggestedQuestions(roles);

  const handleAsk = (questionText: string) => {
    if (!questionText.trim()) return;
    const ans = answerQuestion(questionText, rows, roles);
    setCurrentAnswer(ans);
    setQuery(questionText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(query);
  };

  return (
    <div className="bg-white/95 rounded-2xl border border-ada-line shadow-sm p-6 my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-ada-accent text-white flex items-center justify-center font-bold">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-ada-ink flex items-center gap-2">
              Ask ADA
              <span className="text-[10px] font-bold uppercase tracking-wider text-ada-accent bg-ada-accent-soft px-2 py-0.5 rounded-full">
                Deterministic Q&A
              </span>
            </h3>
            <p className="text-xs text-ada-muted">
              Ask a plain-English question. Get the exact number and the arithmetic calculation shown underneath.
            </p>
          </div>
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="relative mb-3">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-ada-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask about ${roles.measure || 'totals'}, ${roles.dimension || 'segments'}, or peak periods...`}
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-ada-line rounded-xl text-sm font-medium text-ada-ink placeholder:text-slate-400 focus:outline-none focus:border-ada-accent focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-1.5 bg-ada-ink hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
          >
            Ask
          </button>
        </div>
      </form>

      {/* Suggested Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <span className="text-[11px] font-bold text-ada-muted flex items-center gap-1 mr-1">
          <Sparkles size={11} className="text-ada-accent" /> Suggested:
        </span>
        {suggested.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(s)}
            className="text-xs font-medium bg-slate-100 hover:bg-ada-accent-soft text-slate-700 hover:text-ada-accent px-2.5 py-1 rounded-lg border border-transparent hover:border-ada-accent/30 transition-all text-left"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Answer Output */}
      {currentAnswer && (
        <div className="p-4 rounded-xl border border-ada-line bg-slate-50/70 animate-fadeIn">
          <div className="text-xs font-bold text-ada-accent uppercase tracking-wider mb-1">
            Question: "{currentAnswer.question}"
          </div>
          <div className="font-display text-2xl font-bold text-ada-ink tracking-tight my-1">
            {currentAnswer.headline}
          </div>
          <p className="text-sm text-slate-600 mb-3">{currentAnswer.explanation}</p>

          {/* Ranking breakdown if applicable */}
          {currentAnswer.dataPoints && currentAnswer.dataPoints.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 my-2">
              {currentAnswer.dataPoints.map((pt, i) => (
                <div key={i} className="p-2 bg-white rounded-lg border border-ada-line text-center">
                  <div className="text-[10px] text-ada-muted font-bold truncate">{pt.label}</div>
                  <div className="text-xs font-bold text-ada-ink font-mono">
                    {pt.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calculation Ledger */}
          <div className="flex items-center gap-1.5 text-xs text-ada-muted bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Calculation:</span>
            <span className="text-slate-800 break-all">{currentAnswer.calculation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
