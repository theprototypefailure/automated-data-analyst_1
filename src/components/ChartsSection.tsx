import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import { BusinessBrief } from '../types';
import { formatNumber } from '../lib/analytics';
import { TrendingUp, BarChart2, GitCommit, Grid, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ChartsSectionProps {
  brief: BusinessBrief;
  onSegmentClick?: (segment: string) => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ brief, onSegmentClick }) => {
  const [activeTab, setActiveTab] = useState<'trend' | 'segments' | 'waterfall' | 'heatmap'>('trend');

  const { trend, forecast, segments, waterfall, heatmap, roles, anomalies } = brief;
  const measureName = roles.measure || 'Measure';

  // Merge trend and forecast for continuous chart
  const combinedTrendData = [
    ...trend.map((t) => ({
      period: t.period,
      Actual: t.value,
      Fitted: t.fitted,
      anomaly: t.anomaly,
      isForecast: false,
    })),
    ...forecast.map((f) => ({
      period: f.period,
      Forecast: f.fitted,
      ForecastLower: f.lower,
      ForecastUpper: f.upper,
      ForecastRange: [f.lower, f.upper],
      isForecast: true,
    })),
  ];

  return (
    <div className="bg-white/95 rounded-2xl border border-ada-line shadow-sm overflow-hidden my-6">
      {/* Navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-ada-line bg-slate-50/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('trend')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'trend'
                ? 'bg-white text-ada-accent shadow-xs border border-ada-line'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <TrendingUp size={14} />
            <span>Trend & Forecast</span>
            {anomalies.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-red-100 text-red-700 rounded-full font-bold">
                {anomalies.length} flag{anomalies.length > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('segments')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'segments'
                ? 'bg-white text-ada-accent shadow-xs border border-ada-line'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BarChart2 size={14} />
            <span>Segment Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('waterfall')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'waterfall'
                ? 'bg-white text-ada-accent shadow-xs border border-ada-line'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GitCommit size={14} />
            <span>Movement Waterfall</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'heatmap'
                ? 'bg-white text-ada-accent shadow-xs border border-ada-line'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Grid size={14} />
            <span>Segment × Period Heatmap</span>
          </button>
        </div>

        <div className="text-[11px] font-medium text-ada-muted pr-2">
          {activeTab === 'trend' && 'Robust Theil-Sen Baseline & Calibrated Anomalies'}
          {activeTab === 'segments' && 'Click a segment to drill down & regroup'}
          {activeTab === 'waterfall' && 'Driver decomposition of latest period change'}
          {activeTab === 'heatmap' && 'Matrix concentration of segment volume over time'}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* TAB 1: TREND & FORECAST */}
        {activeTab === 'trend' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-ada-ink">
                  {measureName} Trajectory & Guarded Forecast
                </h3>
                <p className="text-xs text-ada-muted">
                  Points outside the calibrated band are flagged as statistically significant outliers.
                </p>
              </div>

              {anomalies.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
                  <AlertTriangle size={13} className="text-amber-600" />
                  <span>
                    {anomalies.length} anomaly period detected: {anomalies.map((a) => a.period).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 17, 22, 0.06)" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: '#667085' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#667085' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => formatNumber(val, measureName)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="bg-ada-ink text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-white/10 min-w-44">
                          <div className="font-bold border-b border-white/10 pb-1 text-ada-lime">{label}</div>
                          {item.Actual !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-300">Observed {measureName}:</span>
                              <span className="font-bold">{formatNumber(item.Actual, measureName)}</span>
                            </div>
                          )}
                          {item.Fitted !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-300">Robust Baseline:</span>
                              <span className="text-slate-200">{formatNumber(item.Fitted, measureName)}</span>
                            </div>
                          )}
                          {item.Forecast !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-300">Guarded Forecast:</span>
                              <span className="font-bold text-ada-accent">{formatNumber(item.Forecast, measureName)}</span>
                            </div>
                          )}
                          {item.anomaly && (
                            <div className="mt-1 pt-1 border-t border-white/10 text-amber-300 font-semibold flex items-center gap-1">
                              <AlertTriangle size={11} />
                              <span>Anomaly ({item.anomaly.severity}x MAD)</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                  />
                  {/* Fitted baseline */}
                  <Line
                    type="monotone"
                    dataKey="Fitted"
                    stroke="#98a2b3"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Robust Baseline"
                  />
                  {/* Observed Actual values */}
                  <Line
                    type="monotone"
                    dataKey="Actual"
                    stroke="#635bff"
                    strokeWidth={2.5}
                    name={`Observed ${measureName}`}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.anomaly) {
                        return (
                          <circle
                            key={`anom-${cx}-${cy}`}
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill="#d6455d"
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }
                      return (
                        <circle
                          key={`dot-${cx}-${cy}`}
                          cx={cx}
                          cy={cy}
                          r={3.5}
                          fill="#635bff"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                  {/* Forecast Line */}
                  <Line
                    type="monotone"
                    dataKey="Forecast"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    name="Guarded Forecast"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: SEGMENTS BREAKDOWN */}
        {activeTab === 'segments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-ada-ink">
                  {measureName} by {roles.dimension || 'Segment'}
                </h3>
                <p className="text-xs text-ada-muted">
                  Click any segment bar to drill into its sub-components and filter the analysis.
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={segments}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(15, 17, 22, 0.06)" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#667085' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(val) => formatNumber(val, measureName)}
                  />
                  <YAxis
                    type="category"
                    dataKey="segment"
                    tick={{ fontSize: 12, fill: '#0e0f13', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="bg-ada-ink text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-white/10 min-w-44">
                          <div className="font-bold text-ada-lime">{item.segment}</div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Total {measureName}:</span>
                            <span className="font-bold">{formatNumber(item.total, measureName)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Share of Total:</span>
                            <span className="font-semibold text-ada-accent">{item.share}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Record Count:</span>
                            <span>{item.count.toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
                            Click to drill down into this segment
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="total"
                    radius={[0, 8, 8, 0]}
                    onClick={(data) => {
                      if (data && data.segment && onSegmentClick) {
                        onSegmentClick(data.segment);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {segments.map((entry, index) => {
                      const colors = ['#635bff', '#0e8f6e', '#b5761b', '#d64a73', '#98a2b3'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: MOVEMENT WATERFALL */}
        {activeTab === 'waterfall' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-ada-ink">
                  Period Movement Waterfall
                </h3>
                <p className="text-xs text-ada-muted">
                  Decomposing the change between the most recent two periods by individual segment contribution.
                </p>
              </div>
            </div>

            {waterfall.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Waterfall Visual List */}
                <div className="space-y-2">
                  {waterfall.map((item, idx) => {
                    const isTotal = item.isStart || item.isEnd;
                    const isPositive = item.delta >= 0;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          isTotal
                            ? 'bg-slate-50 border-slate-200 font-bold text-ada-ink'
                            : 'bg-white border-ada-line text-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {!isTotal && (
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </span>
                          )}
                          <span className={isTotal ? 'font-bold' : 'font-medium'}>{item.name}</span>
                        </div>

                        <div className="text-right">
                          <div
                            className={`font-mono ${
                              isTotal
                                ? 'font-bold text-slate-900 text-sm'
                                : isPositive
                                ? 'text-emerald-700 font-bold text-xs'
                                : 'text-amber-700 font-bold text-xs'
                            }`}
                          >
                            {!isTotal && (isPositive ? '+' : '')}
                            {formatNumber(item.delta, measureName)}
                          </div>
                          {isTotal && item.total !== undefined && (
                            <div className="text-[10px] text-ada-muted">Period Total</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Waterfall Bar visualization */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterfall} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 17, 22, 0.06)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#667085' }}
                        tickLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#667085' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => formatNumber(val, measureName)}
                      />
                      <Tooltip
                        formatter={(val: any) => [formatNumber(Number(val), measureName), 'Shift']}
                      />
                      <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                        {waterfall.map((entry, index) => {
                          let color = '#635bff';
                          if (entry.isStart || entry.isEnd) color = '#1e293b';
                          else if (entry.delta >= 0) color = '#0e8f6e';
                          else color = '#b5761b';
                          return <Cell key={`bar-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-ada-muted">
                Insufficient periods to build a movement waterfall (requires at least 2 dated periods).
              </div>
            )}
          </div>
        )}

        {/* TAB 4: HEATMAP */}
        {activeTab === 'heatmap' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-ada-ink">
                  Segment × Period Matrix
                </h3>
                <p className="text-xs text-ada-muted">
                  Color intensity indicates the magnitude of {measureName} in each period.
                </p>
              </div>
            </div>

            {heatmap.periods.length > 0 && heatmap.segments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-ada-line bg-slate-50">
                      <th className="p-2.5 font-bold text-ada-ink">{roles.dimension || 'Segment'}</th>
                      {heatmap.periods.map((p) => (
                        <th key={p} className="p-2.5 font-bold text-center text-slate-700">
                          {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmap.segments.map((seg) => {
                      const rowVals = heatmap.periods.map((p) => heatmap.matrix[seg]?.[p] || 0);
                      const maxRowVal = Math.max(...rowVals, 1);
                      return (
                        <tr key={seg} className="border-b border-ada-line hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-ada-ink whitespace-nowrap">{seg}</td>
                          {heatmap.periods.map((p) => {
                            const val = heatmap.matrix[seg]?.[p] || 0;
                            const intensity = Math.min(1, Math.max(0.05, val / maxRowVal));
                            return (
                              <td key={p} className="p-2 text-center">
                                <div
                                  style={{
                                    backgroundColor: `rgba(99, 91, 255, ${intensity * 0.75 + 0.05})`,
                                    color: intensity > 0.6 ? '#ffffff' : '#0e0f13',
                                  }}
                                  className="px-2 py-1.5 rounded-lg font-mono font-semibold transition-all hover:scale-105"
                                  title={`${seg} in ${p}: ${formatNumber(val, measureName)}`}
                                >
                                  {formatNumber(val, measureName)}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-ada-muted">
                Matrix requires both a valid Date column and a Dimension segment column.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
