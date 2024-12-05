import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/calculations';
import { ContactLink } from '../common/ContactLink';

export function RecentActivities() {
  const { transactions, contacts } = useStore();
  const navigate = useNavigate();

  const recentActivities = transactions
    .flatMap(transaction => 
      (transaction.activities || []).map(activity => ({
        ...activity,
        transaction,
        contact: contacts.find(c => c.id === transaction.contactId),
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleActivityClick = (transactionId: string, activityId: string) => {
    navigate(`/transactions/${transactionId}?activityId=${activityId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Recent Activities
      </h3>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li
              key={activity.id}
              className="py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleActivityClick(activity.transaction.id, activity.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <ContactLink contactId={activity.transaction.contactId}>
                    {activity.contact?.name || 'Unknown Contact'}
                  </ContactLink>
                  <p className="text-sm text-gray-500">
                    {activity.type === 'payment' ? 'Payment recorded' : 'Comment added'}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(activity.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              {activity.type === 'payment' && activity.amount && (
                <p className="mt-1 text-sm text-green-600">
                  Amount: {formatCurrency(activity.amount, activity.transaction.currency)}
                </p>
              )}
            </li>
          ))}
          {recentActivities.length === 0 && (
            <li className="py-4 text-center text-gray-500">
              No recent activities
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}