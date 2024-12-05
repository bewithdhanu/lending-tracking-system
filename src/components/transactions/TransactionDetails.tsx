import React from 'react';
import { format, differenceInMonths } from 'date-fns';
import { Transaction, Contact } from '../../types';
import { calculateInterest, formatCurrency, formatInterestRate } from '../../lib/calculations';

interface TransactionDetailsProps {
  transaction: Transaction;
  contact: Contact | null;
  calculationType: 'percentage' | 'per100';
  onEdit: () => void;
}

export function TransactionDetails({ 
  transaction, 
  contact, 
  calculationType,
  onEdit 
}: TransactionDetailsProps) {
  // Calculate pending months
  const startDate = new Date(transaction.startDate);
  const today = new Date();
  const totalMonths = differenceInMonths(today, startDate);

  // Calculate paid months from activities
  const paidMonths = transaction.activities
    ?.filter(a => a.type === 'payment')
    .reduce((sum, a) => sum + (a.interestMonths || 0), 0) || 0;

  // Calculate pending months
  const pendingMonths = Math.max(0, totalMonths - paidMonths);

  // Calculate pending interest
  const pendingInterest = calculateInterest(
    transaction,
    calculationType,
    today,
    pendingMonths
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {transaction.type === 'lending' ? 'Lending to' : 'Borrowing from'}{' '}
            {contact?.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Created on {format(new Date(transaction.createdAt), 'PPP')}
          </p>
        </div>
        {transaction.status !== 'completed' && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit Details
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Principal Amount</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatCurrency(transaction.amount, transaction.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatInterestRate(transaction.interestRate, calculationType)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Pending Months of Interest</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {pendingMonths} {pendingMonths === 1 ? 'month' : 'months'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Pending Interest to Pay</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatCurrency(pendingInterest, transaction.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : transaction.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {transaction.status}
              </span>
            </dd>
          </div>
          {transaction.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}