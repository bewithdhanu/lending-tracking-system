import { ChartType, AggregationType, DateRangePreset } from './types';

export const chartTypes: { label: string; value: ChartType }[] = [
  { label: 'Area', value: 'area' },
  { label: 'Bar', value: 'bar' },
];

export const aggregationTypes: { label: string; value: AggregationType }[] = [
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' },
];

export const chartCategories = [
  'Lending',
  'Lending Payments',
  'Borrowing',
  'Borrowing Payments',
  'Net',
];

export const chartColors = [
  'emerald',
  'emerald',
  'rose',
  'rose',
  'blue',
];

export const dateRangePresets: DateRangePreset[] = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: -1 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last 180 Days', days: 180 },
  { label: 'Last 365 Days', days: 365 },
  { label: 'All Time', days: -2 }, // Special value for all time
];