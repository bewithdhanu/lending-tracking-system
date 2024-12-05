import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Transaction, TransactionActivity } from '../../types';
import { calculateInterest, formatCurrency } from '../../lib/calculations';

interface PaymentFormProps {
  transaction: Transaction;
  activityToEdit?: TransactionActivity;
  onSubmit: (data: {
    interestMonths: number;
    amount: number;
    includePrincipal: boolean;
    comment: string;
    activityDate: Date;
  }) => void;
  onCancel: () => void;
}

export function PaymentForm({ transaction, activityToEdit, onSubmit, onCancel }: PaymentFormProps) {
  const { user } = useStore();
  const [interestMonths, setInterestMonths] = useState(activityToEdit?.interestMonths || 1);
  const [includePrincipal, setIncludePrincipal] = useState(activityToEdit?.includedPrincipal || false);
  const [activityDate, setActivityDate] = useState(
    activityToEdit 
      ? new Date(activityToEdit.createdAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (interestMonths <= 0) return;
    
    const calculationType = user?.settings?.interestCalculation || 'percentage';
    let interestAmount = 0;

    if (calculationType === 'percentage') {
      // Calculate monthly interest based on annual rate
      const monthlyRate = transaction.interestRate / 12 / 100;
      interestAmount = transaction.amount * monthlyRate * interestMonths;
    } else {
      // Per 100 per month calculation
      interestAmount = (transaction.amount / 100) * transaction.interestRate * interestMonths;
    }

    const totalAmount = includePrincipal ? interestAmount + transaction.amount : interestAmount;
    setCalculatedAmount(totalAmount);

    // Generate comment based on calculation
    const interestText = user?.settings?.interestCalculation === 'percentage' 
      ? `${transaction.interestRate}% per year`
      : `${transaction.interestRate} per 100 per month`;

    const defaultComment = `Interest payment for ${interestMonths} month(s) at ${interestText}` + 
      (includePrincipal ? ' including principal amount' : '') +
      `. Total amount: ${formatCurrency(totalAmount, transaction.currency)}`;
    
    setComment(activityToEdit?.content || defaultComment);
  }, [interestMonths, includePrincipal, transaction, user?.settings?.interestCalculation, activityToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interestMonths <= 0) return;

    onSubmit({
      interestMonths,
      amount: calculatedAmount,
      includePrincipal,
      comment,
      activityDate: new Date(activityDate),
    });
  };

  const getPaymentSummary = () => {
    const calculationType = user?.settings?.interestCalculation || 'percentage';
    const interestAmount = calculationType === 'percentage'
      ? transaction.amount * (transaction.interestRate / 12 / 100) * interestMonths
      : (transaction.amount / 100) * transaction.interestRate * interestMonths;

    return (
      <div className="space-y-2 text-sm text-gray-600">
        <p>Interest Rate: {transaction.interestRate}
          {calculationType === 'percentage' ? '% per year' : ' per 100 per month'}
        </p>
        <p>Number of Months: {interestMonths}</p>
        <p>Interest Amount: {formatCurrency(interestAmount, transaction.currency)}</p>
        {includePrincipal && (
          <p>Principal Amount: {formatCurrency(transaction.amount, transaction.currency)}</p>
        )}
        <p className="text-base font-semibold text-gray-900">
          Total Payment: {formatCurrency(calculatedAmount, transaction.currency)}
        </p>
        {includePrincipal && (
          <p className="text-sm text-green-600">
            Transaction will be marked as completed upon payment
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Months for Interest Payment
        </label>
        <input
          type="number"
          min="1"
          value={interestMonths}
          onChange={(e) => setInterestMonths(parseInt(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="includePrincipal"
          checked={includePrincipal}
          onChange={(e) => setIncludePrincipal(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="includePrincipal" className="ml-2 block text-sm text-gray-700">
          Include Principal Amount and Close Transaction
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Summary
        </label>
        {getPaymentSummary()}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payment Date and Time
        </label>
        <input
          type="datetime-local"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add details about this payment..."
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {activityToEdit ? 'Update Payment' : 'Record Payment'}
        </button>
      </div>
    </form>
  );
}