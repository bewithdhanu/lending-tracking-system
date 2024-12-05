import { Transaction } from '../types';
import { differenceInMonths, differenceInDays } from 'date-fns';

export function calculateInterest(
  transaction: Transaction,
  calculationType: 'percentage' | 'per100',
  toDate: Date = new Date(),
  months?: number
): number {
  const startDate = new Date(transaction.startDate);
  const monthsToCalculate = months ?? differenceInMonths(toDate, startDate);
  const days = differenceInDays(toDate, startDate);
  
  if (calculationType === 'percentage') {
    if (months !== undefined) {
      // Calculate for specific number of months using monthly rate
      const monthlyRate = transaction.interestRate / 12 / 100;
      return transaction.amount * monthlyRate * monthsToCalculate;
    }
    // Annual percentage rate calculation
    return (transaction.amount * (transaction.interestRate / 100) * (days / 365));
  } else {
    // Per 100 per month calculation
    return ((transaction.amount / 100) * transaction.interestRate * monthsToCalculate);
  }
}

export function convertInterestRate(
  rate: number,
  fromType: 'percentage' | 'per100',
  toType: 'percentage' | 'per100'
): number {
  if (fromType === toType) return rate;

  if (fromType === 'percentage' && toType === 'per100') {
    // Convert annual percentage to monthly per 100
    return +(rate / 12).toFixed(2);
  } else {
    // Convert monthly per 100 to annual percentage
    return +(rate * 12).toFixed(2);
  }
}

interface AmountCalculation {
  principal: number;
  interest: number;
  total: number;
  paid: number;
  remaining: number;
}

export function calculateTotalAmount(
  transaction: Transaction,
  calculationType: 'percentage' | 'per100'
): AmountCalculation {
  const interestAmount = calculateInterest(transaction, calculationType);
  const paidAmount = (transaction.activities || [])
    .filter(a => a.type === 'payment')
    .reduce((sum, a) => sum + (a.amount || 0), 0);
    
  const total = transaction.amount + interestAmount;
  
  return {
    principal: transaction.amount,
    interest: interestAmount,
    total: total,
    paid: paidAmount,
    remaining: total - paidAmount
  };
}

export function formatInterestRate(rate: number, calculationType: 'percentage' | 'per100'): string {
  if (calculationType === 'percentage') {
    return `${rate}% per year`;
  }
  return `${rate} per 100 per month`;
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}