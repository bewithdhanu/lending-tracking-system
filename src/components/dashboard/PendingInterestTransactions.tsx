import React from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInMonths } from 'date-fns';
import { useStore } from '../../store/useStore';
import { calculateInterest, formatCurrency } from '../../lib/calculations';
import { ContactLink } from '../common/ContactLink';

export function PendingInterestTransactions() {
  const { transactions, contacts, user } = useStore();
  const navigate = useNavigate();
  const calculationType = user?.settings?.interestCalculation || 'percentage';

  const transactionsWithPendingInterest = transactions
    .filter(t => t.status !== 'completed')
    .map(transaction => {
      const startDate = new Date(transaction.startDate);
      const totalMonths = differenceInMonths(new Date(), startDate);
      const paidMonths = transaction.activities
        ?.filter(a => a.type === 'payment')
        .reduce((sum, a) => sum + (a.interestMonths || 0), 0) || 0;
      const pendingMonths = Math.max(0, totalMonths - paidMonths);
      const pendingInterest = calculateInterest(transaction, calculationType, new Date(), pendingMonths);
      
      return {
        ...transaction,
        pendingMonths,
        pendingInterest,
        contact: contacts.find(c => c.id === transaction.contactId),
      };
    })
    .filter(t => t.pendingMonths >= 10)
    .sort((a, b) => b.pendingMonths - a.pendingMonths)
    .slice(0, 5);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Transactions with Pending Interest (10+ months)
      </h3>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          {transactionsWithPendingInterest.map((transaction) => (
            <li
              key={transaction.id}
              className="py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/transactions/${transaction.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <ContactLink contactId={transaction.contactId}>
                    {transaction.contact?.name || 'Unknown Contact'}
                  </ContactLink>
                  <p className="text-sm text-gray-500">
                    {transaction.pendingMonths} months pending
                  </p>
                </div>
                <div className="text-sm text-red-600 font-medium">
                  {formatCurrency(transaction.pendingInterest, transaction.currency)}
                </div>
              </div>
            </li>
          ))}
          {transactionsWithPendingInterest.length === 0 && (
            <li className="py-4 text-center text-gray-500">
              No transactions with long-pending interest
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}