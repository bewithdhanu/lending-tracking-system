import React from 'react';
import { Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { isAfter, isBefore, addDays } from 'date-fns';

export function NotificationBadge() {
  const transactions = useStore((state) => state.transactions);
  
  const notifications = transactions.filter((transaction) => {
    const today = new Date();
    const dueDate = new Date(transaction.dueDate);
    const warningDate = addDays(dueDate, -3); // 3 days before due date
    
    return (
      (transaction.status === 'pending' || transaction.status === 'active') &&
      (isAfter(today, dueDate) || // Overdue
        (isAfter(today, warningDate) && isBefore(today, dueDate))) // Due soon
    );
  });

  return (
    <div className="relative">
      <Bell className="h-6 w-6" />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
          {notifications.length}
        </span>
      )}
    </div>
  );
}