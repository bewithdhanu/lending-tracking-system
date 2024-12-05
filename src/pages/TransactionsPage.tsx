import React, { useState, useEffect } from 'react';
import { TransactionsList } from '../components/TransactionsList';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { useStore } from '../store/useStore';
import { PlusCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { Transaction, TransactionType, TransactionStatus, Contact } from '../types';
import type { DateRange } from '../components/common/DateRangeFilter';
import { getTransactionDateRange } from '../lib/chartUtils';

export function TransactionsPage() {
  const location = useLocation();
  const { transactions, contacts } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>();
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  // Get min and max dates from transactions once
  const dateRange = React.useMemo(() => getTransactionDateRange(transactions), [transactions]);

  const [filters, setFilters] = useState<{
    dateRange: DateRange;
    type: TransactionType | null;
    status: TransactionStatus | null;
  }>(() => ({
    dateRange: {
      start: dateRange.minDate,
      end: dateRange.maxDate,
      label: 'All Time'
    },
    type: null,
    status: null,
  }));

  // Handle contact filtering from location state
  useEffect(() => {
    const state = location.state as { contactId?: string };
    if (state?.contactId) {
      const contact = contacts.find(c => c.id === state.contactId);
      if (contact) {
        setSelectedContacts([contact]);
        // Set date range to All Time when navigating from contact
        setFilters(prev => ({
          ...prev,
          dateRange: {
            start: dateRange.minDate,
            end: dateRange.maxDate,
            label: 'All Time'
          }
        }));
      }
      // Clear the location state to prevent persisting the filter
      window.history.replaceState({}, document.title);
    }
  }, [location.state, contacts, dateRange]);

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      // Contact filter
      if (selectedContacts.length > 0 && !selectedContacts.some(c => c.id === transaction.contactId)) {
        return false;
      }
      
      // Type filter
      if (filters.type !== null && transaction.type !== filters.type) {
        return false;
      }
      
      // Status filter
      if (filters.status !== null && transaction.status !== filters.status) {
        return false;
      }
      
      // Date range filter
      const transactionDate = new Date(transaction.startDate);
      if (filters.dateRange.start && transactionDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && transactionDate > filters.dateRange.end) {
        return false;
      }
      
      return true;
    });
  }, [transactions, selectedContacts, filters]);

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionToEdit(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Transaction
        </button>
      </div>

      <TransactionFilters
        contacts={contacts}
        selectedContacts={selectedContacts}
        onContactsChange={setSelectedContacts}
        dateRange={filters.dateRange}
        type={filters.type}
        status={filters.status}
        onDateRangeChange={(dateRange) =>
          setFilters((prev) => ({ ...prev, dateRange }))
        }
        onTypeChange={(type) =>
          setFilters((prev) => ({ ...prev, type }))
        }
        onStatusChange={(status) =>
          setFilters((prev) => ({ ...prev, status }))
        }
      />

      <TransactionsList 
        transactions={filteredTransactions} 
        onEdit={handleEdit}
      />
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}