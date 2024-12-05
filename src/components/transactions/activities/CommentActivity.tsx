import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Save, X } from 'lucide-react';
import type { TransactionActivity } from '../../../types';

interface CommentActivityProps {
  activity: TransactionActivity;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (content: string, date: Date) => void;
  showEditButton: boolean;
}

export function CommentActivity({
  activity,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  showEditButton,
}: CommentActivityProps) {
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
            {isEditing ? (
              <>
                <button
                  onClick={() => onSaveEdit(editContent, new Date(editDate))}
                  className="text-green-600 hover:text-green-900"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={onStartEdit}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
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
          <div className="text-sm text-gray-700">{activity.content}</div>
        )}
      </div>
    </div>
  );
}