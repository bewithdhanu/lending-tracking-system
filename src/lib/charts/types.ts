import type { Transaction } from '../../types';

export type AggregationType = 'day' | 'week' | 'month' | 'year';
export type ChartType = 'area' | 'bar';

export interface ChartData {
  date: string;
  lendingTransactions: number;
  borrowingTransactions: number;
  lendingPayments: number;
  borrowingPayments: number;
  cumulative: number;
}

export interface AggregationOptions {
  start: Date;
  end: Date;
  aggregationType: AggregationType;
}

export interface ChartConfig {
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
}

export interface DateRangePreset {
  label: string;
  days: number;
}