export type DataRow = Record<string, any>;

export interface ColumnRoles {
  date: string | null;
  measure: string | null;
  dimension: string | null;
  identifier: string | null;
  numeric: string[];
  dimensions: string[];
}

export interface CleaningReport {
  originalRowCount: number;
  analyzedRowCount: number;
  droppedNullRows: number;
  convertedDateColumns: string[];
  convertedNumericColumns: string[];
}

export interface KPI {
  label: string;
  value: string;
  context: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface Evidence {
  kind: 'trend' | 'driver' | 'concentration' | 'anomaly' | 'volatility' | 'correlation';
  title: string;
  value: string;
  statement: string;
  calculation: string;
  tone: 'positive' | 'negative' | 'warning' | 'neutral';
  subject?: string;
}

export interface Recommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  action: string;
  rationale: string;
}

export interface Anomaly {
  period: string;
  value: number;
  expected: number;
  expectedLow: number;
  expectedHigh: number;
  direction: 'above' | 'below';
  severity: number;
}

export interface ForecastPoint {
  period: string;
  fitted: number;
  lower: number;
  upper: number;
  isForecast: boolean;
}

export interface TrendPoint {
  period: string;
  value: number;
  fitted?: number;
  anomaly?: Anomaly;
}

export interface SegmentPoint {
  segment: string;
  total: number;
  share: number;
  count: number;
  avg: number;
}

export interface WaterfallItem {
  name: string;
  delta: number;
  isStart?: boolean;
  isEnd?: boolean;
  total?: number;
}

export interface HeatmapCell {
  segment: string;
  period: string;
  value: number;
  normalized: number;
}

export interface BusinessBrief {
  headline: string;
  summary: string;
  roles: ColumnRoles;
  kpis: KPI[];
  evidence: Evidence[];
  recommendations: Recommendation[];
  trend: TrendPoint[];
  forecast: ForecastPoint[];
  segments: SegmentPoint[];
  waterfall: WaterfallItem[];
  heatmap: {
    periods: string[];
    segments: string[];
    matrix: Record<string, Record<string, number>>;
  };
  anomalies: Anomaly[];
}

export interface QueryAnswer {
  question: string;
  headline: string;
  explanation: string;
  calculation: string;
  type: 'scalar' | 'ranking' | 'trend' | 'breakdown';
  dataPoints?: Array<{ label: string; value: number }>;
}
