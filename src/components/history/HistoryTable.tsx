import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { DollarSign, MessageSquare } from 'lucide-react';
import type { TransactionActivity, Transaction, Contact } from '../../types';
import { formatCurrency } from '../../lib/calculations';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../common/Pagination';
import { useNavigate } from 'react-router-dom';
import { ContactLink } from '../common/ContactLink';

interface HistoryTableProps {
  activities: (TransactionActivity & { 
    transaction: Transaction;
    contact: Contact | undefined;
  })[];
}

export function HistoryTable({ activities }: HistoryTableProps) {
  const navigate = useNavigate();
  const {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(activities);

  // Reset scroll position when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [currentPage]);

  const handleActivityClick = (activity: TransactionActivity & { transaction: Transaction }) => {
    navigate(`/transactions/${activity.transaction.id}?activityId=${activity.id}`);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedItems.map((activity) => (
            <tr 
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(activity.createdAt), 'PPp')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ContactLink contactId={activity.transaction.contactId}>
                  {activity.contact?.name || 'Unknown Contact'}
                </ContactLink>
                <div className="text-sm text-gray-500">
                  {activity.transaction.type}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.type === 'payment'
                    ? activity.transaction.type === 'lending'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {activity.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {activity.type === 'payment' ? (
                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-900">{activity.content}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {activity.type === 'payment' && activity.amount && (
                  <span className={activity.transaction.type === 'lending' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(activity.amount, activity.transaction.currency)}
                  </span>
                )}
              </td>
            </tr>
          ))}
          {activities.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No activities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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