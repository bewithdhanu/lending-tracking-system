import React, { useState } from 'react';
import { format } from 'date-fns';
import { DollarSign, Edit, Save, X } from 'lucide-react';
import type { TransactionActivity, Transaction } from '../../../types';
import { formatCurrency } from '../../../lib/calculations';

interface PaymentActivityProps {
  activity: TransactionActivity;
  transaction: Transaction;
  isEditing: boolean;
  onSaveEdit: (content: string, date: Date) => void;
  showEditButton: boolean;
}

export function PaymentActivity({
  activity,
  transaction,
  isEditing,
  onSaveEdit,
  showEditButton,
}: PaymentActivityProps) {
  const [editContent, setEditContent] = useState(activity.content || '');
  const [editDate, setEditDate] = useState(
    new Date(activity.createdAt).toISOString().slice(0, 16)
  );

  return (
    <div className="min-w-0 flex-1">
      <div className="flex justify-between items-center">
        <div>
          {isEditing ? (
            <input
              type="datetime-local"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-0.5 text-sm text-gray-500">
              {format(new Date(activity.createdAt), 'PPp')}
            </p>
          )}
        </div>
        {showEditButton && (
          <div className="flex space-x-2">
            <button
              onClick={() => onSaveEdit(editContent, new Date(editDate))}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit className="h-5 w-5" />
              </button>
          </div>
        )}
      </div>
      <div className="mt-2">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        ) : (
          <div className="text-sm text-gray-700">
            {activity.content}
            {activity.amount && (
              <p className="mt-1 font-medium text-green-600">
                Amount: {formatCurrency(activity.amount, transaction.currency)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}