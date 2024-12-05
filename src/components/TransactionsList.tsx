import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import type { Transaction } from '../types';
import { useStore } from '../store/useStore';
import { calculateTotalAmount, formatCurrency, formatInterestRate } from '../lib/calculations';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from './common/Pagination';
import { ContactLink } from './common/ContactLink';

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionsList({ transactions, onEdit }: TransactionsListProps) {
  const { user, contacts } = useStore();
  const navigate = useNavigate();
  const calculationType = user?.settings?.interestCalculation || 'percentage';

  const {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(transactions);

  const handleRowClick = (transaction: Transaction, e: React.MouseEvent) => {
    // If clicking the edit button, prevent row click
    if ((e.target as HTMLElement).closest('.edit-button')) {
      e.stopPropagation();
      onEdit?.(transaction);
      return;
    }
    navigate(`/transactions/${transaction.id}`);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Transactions
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {paginatedItems.map((transaction) => {
            const amounts = calculateTotalAmount(transaction, calculationType);
            const contact = contacts.find(c => c.id === transaction.contactId);
            
            return (
              <li 
                key={transaction.id}
                onClick={(e) => handleRowClick(transaction, e)}
                className="hover:bg-gray-50 cursor-pointer relative"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ContactLink contactId={transaction.contactId}>
                        {contact?.name || 'Unknown Contact'}
                      </ContactLink>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'lending'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      {onEdit && (
                        <button
                          onClick={(e) => handleRowClick(transaction, e)}
                          className="edit-button text-gray-400 hover:text-gray-500"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.startDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Principal: {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Interest Rate: {formatInterestRate(transaction.interestRate, calculationType)}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Total: {formatCurrency(amounts.total, transaction.currency)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          {transactions.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">
              No transactions found.
            </li>
          )}
        </ul>
      </div>
      {totalItems > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}