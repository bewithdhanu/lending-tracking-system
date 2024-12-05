import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TransactionModal } from './transactions/TransactionModal';
import { formatCurrency } from '../lib/calculations';
import { DateRangeFilter, type DateRange } from './common/DateRangeFilter';
import { FinancialChart } from './dashboard/FinancialChart';
import { ContactPerformanceCard, calculateContactPerformance } from './dashboard/ContactPerformanceCard';
import { PendingInterestTransactions } from './dashboard/PendingInterestTransactions';
import { RecentActivities } from './dashboard/RecentActivities';

export function Dashboard() {
  const { transactions, contacts, user } = useStore();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    label: 'This Month',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  // Calculate global metrics
  const totalLent = transactions
    .filter((t) => t.type === 'lending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBorrowed = transactions
    .filter((t) => t.type === 'borrowing')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeTransactions = transactions.filter(t => t.status !== 'completed').length;
  const netBalance = totalLent - totalBorrowed;

  // Calculate contact performance
  const contactPerformance = calculateContactPerformance(contacts, transactions);
  
  // Get top 10 most timely and delayed contacts
  const sortedContacts = [...contactPerformance]
    .filter(p => p.totalTransactions > 0)
    .sort((a, b) => a.avgPaymentDelay - b.avgPaymentDelay);

  const timelyContacts = sortedContacts.slice(0, 10);
  const delayedContacts = sortedContacts.reverse().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Lent</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalLent, 'INR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Borrowed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalBorrowed, 'INR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Net Balance</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(netBalance, 'INR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Transactions</dt>
                  <dd className="text-lg font-medium text-gray-900">{activeTransactions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Chart */}
      <FinancialChart 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Contact Performance Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContactPerformanceCard
          title="Most Timely Paying Contacts"
          icon={<Clock className="h-5 w-5 text-green-600" />}
          contacts={timelyContacts}
          colorClass="bg-green-100"
        />

        <ContactPerformanceCard
          title="Most Delayed Paying Contacts"
          icon={<AlertCircle className="h-5 w-5 text-red-600" />}
          contacts={delayedContacts}
          colorClass="bg-red-100"
        />
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PendingInterestTransactions />
        <RecentActivities />
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
}