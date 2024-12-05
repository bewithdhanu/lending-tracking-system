export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  settings: {
    interestCalculation: 'percentage' | 'per100';
  };
};

export type Contact = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  referralId?: string;
  isDisabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionType = 'lending' | 'borrowing';
export type TransactionStatus = 'pending' | 'active' | 'completed' | 'overdue';
export type PaymentFrequency = 'one-time' | 'weekly' | 'monthly' | 'yearly';

export type TransactionActivity = {
  id: string;
  type: 'payment' | 'comment';
  content?: string;
  amount?: number;
  interestMonths?: number;
  includedPrincipal?: boolean;
  createdAt: Date;
  userId: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  contactId: string;
  interestRate: number;
  startDate: Date;
  status: TransactionStatus;
  notes?: string;
  activities?: TransactionActivity[];
  createdAt: Date;
  updatedAt: Date;
};