import React, { useEffect, useRef } from 'react';
import { MessageSquare, DollarSign } from 'lucide-react';
import type { Transaction } from '../../types';
import { useStore } from '../../store/useStore';
import { PaymentActivity } from './activities/PaymentActivity';
import { CommentActivity } from './activities/CommentActivity';
import { useLocation } from 'react-router-dom';

interface TransactionActivityProps {
  transaction: Transaction;
  onEdit: (activityId: string, newContent: string, newDate: Date) => void;
  editingActivityId: string | null;
  setEditingActivityId: (id: string | null) => void;
}

export function TransactionActivity({
  transaction,
  onEdit,
  editingActivityId,
  setEditingActivityId,
}: TransactionActivityProps) {
  const { user } = useStore();
  const location = useLocation();
  const targetActivityId = new URLSearchParams(location.search).get('activityId');
  const targetRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (targetActivityId && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add highlight animation class
      targetRef.current.classList.add('highlight-activity');
      
      // Remove highlight class after animation
      const timeout = setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.classList.remove('highlight-activity');
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [targetActivityId]);

  if (!transaction.activities?.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No activity yet
      </div>
    );
  }

  // Sort activities by datetime in descending order (newest first)
  const sortedActivities = [...transaction.activities].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flow-root">
      <style>
        {`
          @keyframes highlightFade {
            0% { background-color: rgba(79, 70, 229, 0.1); }
            100% { background-color: transparent; }
          }
          .highlight-activity {
            animation: highlightFade 3s ease-out;
          }
        `}
      </style>
      <ul role="list" className="-mb-8">
        {sortedActivities.map((activity, activityIdx) => (
          <li 
            key={activity.id}
            ref={activity.id === targetActivityId ? targetRef : null}
            className={`relative ${activity.id === targetActivityId ? 'rounded-lg' : ''}`}
          >
            <div className="relative pb-8">
              {activityIdx !== sortedActivities.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      activity.type === 'payment'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {activity.type === 'payment' ? (
                      <DollarSign className="h-5 w-5 text-white" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-white" />
                    )}
                  </span>
                </div>
                {activity.type === 'payment' ? (
                  <PaymentActivity
                    activity={activity}
                    transaction={transaction}
                    isEditing={editingActivityId === activity.id}
                    onStartEdit={() => setEditingActivityId(activity.id)}
                    onCancelEdit={() => setEditingActivityId(null)}
                    onSaveEdit={(content, date) => onEdit(activity.id, content, date)}
                    showEditButton={transaction.status !== 'completed'}
                  />
                ) : (
                  <CommentActivity
                    activity={activity}
                    isEditing={editingActivityId === activity.id}
                    onStartEdit={() => setEditingActivityId(activity.id)}
                    onCancelEdit={() => setEditingActivityId(null)}
                    onSaveEdit={(content, date) => onEdit(activity.id, content, date)}
                    showEditButton={transaction.status !== 'completed'}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}