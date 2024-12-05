import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryTable } from '../components/history/HistoryTable';
import { useLocation } from 'react-router-dom';
import type { Contact } from '../types';
import type { DateRange } from '../components/common/DateRangeFilter';
import { startOfMonth, endOfMonth } from 'date-fns';
import { getTransactionDateRange } from '../lib/chartUtils';

export function HistoryPage() {
  const location = useLocation();
  const { transactions, contacts } = useStore();
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const { minDate, maxDate } = React.useMemo(() => getTransactionDateRange(transactions), [transactions]);

  const [dateRange, setDateRange] = useState<DateRange>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
    label: 'This Month'
  });

  // Handle contact filtering from location state
  useEffect(() => {
    const state = location.state as { contactId?: string };
    if (state?.contactId) {
      const contact = contacts.find(c => c.id === state.contactId);
      if (contact) {
        setSelectedContacts([contact]);
        // Set date range to All Time when navigating from contact
        setDateRange({
          start: minDate,
          end: maxDate,
          label: 'All Time'
        });
      }
      // Clear the location state to prevent persisting the filter
      window.history.replaceState({}, document.title);
    }
  }, [location.state, contacts, minDate, maxDate]);

  // Get all activities from all transactions with memoization
  const allActivities = React.useMemo(() => {
    return transactions.flatMap(transaction => 
      (transaction.activities || []).map(activity => ({
        ...activity,
        transaction,
        contact: contacts.find(c => c.id === transaction.contactId),
      }))
    );
  }, [transactions, contacts]);

  // Apply filters with memoization
  const filteredActivities = React.useMemo(() => {
    return allActivities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      
      // Contact filter
      if (selectedContacts.length > 0 && !selectedContacts.some(c => c.id === activity.transaction.contactId)) {
        return false;
      }
      
      // Date range filter
      if (dateRange.start && activityDate < dateRange.start) {
        return false;
      }
      
      if (dateRange.end && activityDate > dateRange.end) {
        return false;
      }
      
      return true;
    });
  }, [allActivities, selectedContacts, dateRange]);

  // Sort by date (newest first) with memoization
  const sortedActivities = React.useMemo(() => {
    return [...filteredActivities].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredActivities]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Transaction History</h1>

      <HistoryFilters
        contacts={contacts}
        selectedContacts={selectedContacts}
        onContactsChange={setSelectedContacts}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <HistoryTable activities={sortedActivities} />
    </div>
  );
}