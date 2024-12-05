import React from 'react';
import { useStore } from '../../store/useStore';
import { format, isAfter } from 'date-fns';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const transactions = useStore((state) => state.transactions);
  
  const notifications = transactions
    .filter((transaction) => {
      const today = new Date();
      const dueDate = new Date(transaction.dueDate);
      return (
        (transaction.status === 'pending' || transaction.status === 'active') &&
        isAfter(today, dueDate)
      );
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((transaction) => (
              <li key={transaction.id} className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type === 'lending' ? 'Payment due from' : 'Payment due to'}{' '}
                    {transaction.personName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: {transaction.currency} {transaction.amount}
                  </p>
                  <p className="text-sm text-red-600">
                    Due date: {format(new Date(transaction.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}