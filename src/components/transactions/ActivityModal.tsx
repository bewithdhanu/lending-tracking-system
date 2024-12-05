import React from 'react';
import { X } from 'lucide-react';
import { PaymentForm } from './PaymentForm';
import { Transaction, TransactionActivity } from '../../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'payment' | 'comment';
  transaction: Transaction;
  activityToEdit?: TransactionActivity;
  onSubmit: (data: any) => void;
}

export function ActivityModal({
  isOpen,
  onClose,
  type,
  transaction,
  activityToEdit,
  onSubmit,
}: ActivityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {type === 'payment' 
                  ? (activityToEdit ? 'Edit Payment' : 'Record Payment')
                  : (activityToEdit ? 'Edit Comment' : 'Add Comment')
                }
              </h3>

              <div className="mt-4">
                {type === 'payment' ? (
                  <PaymentForm
                    transaction={transaction}
                    activityToEdit={activityToEdit}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                  />
                ) : (
                  <CommentForm
                    activityToEdit={activityToEdit}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CommentFormProps {
  activityToEdit?: TransactionActivity;
  onSubmit: (data: { content: string; activityDate: Date }) => void;
  onCancel: () => void;
}

function CommentForm({ activityToEdit, onSubmit, onCancel }: CommentFormProps) {
  const [content, setContent] = React.useState(activityToEdit?.content || '');
  const [activityDate, setActivityDate] = React.useState(
    activityToEdit 
      ? new Date(activityToEdit.createdAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content,
      activityDate: new Date(activityDate),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comment Date and Time
        </label>
        <input
          type="datetime-local"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add your comment..."
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {activityToEdit ? 'Update Comment' : 'Add Comment'}
        </button>
      </div>
    </form>
  );
}