import { format } from 'date-fns';
import { AggregationType } from './types';
import { formatCurrency } from '../calculations';

export function getDateFormat(type: AggregationType, date: Date): string {
  switch (type) {
    case 'day':
      return format(date, 'MMM d');
    case 'week':
      return format(date, 'MMM d');
    case 'month':
      return format(date, 'MMM yyyy');
    case 'year':
      return format(date, 'yyyy');
    default:
      return format(date, 'MMM d');
  }
}

export function formatChartValue(value: number, currency: string = 'INR'): string {
  return formatCurrency(Math.abs(value), currency);
}