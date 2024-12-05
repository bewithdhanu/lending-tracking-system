import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MessageSquare, DollarSign } from 'lucide-react';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionActivity } from '../components/transactions/TransactionActivity';
import { ActivityModal } from '../components/transactions/ActivityModal';
import { TransactionHeader } from '../components/transactions/TransactionHeader';
import { TransactionDetails } from '../components/transactions/TransactionDetails';
import { generateId } from '../lib/utils';

export function TransactionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, contacts, user, updateTransaction, removeTransaction } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [activityModal, setActivityModal] = useState<{
    isOpen: boolean;
    type: 'payment' | 'comment';
    activityToEdit?: any;
  }>({
    isOpen: false,
    type: 'payment',
  });

  const transaction = transactions.find(t => t.id === id);
  const contact = transaction ? contacts.find(c => c.id === transaction.contactId) : null;

  if (!transaction || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Transaction not found</p>
        <button
          onClick={() => navigate('/transactions')}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Return to Transactions
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      removeTransaction(transaction.id);
      navigate('/transactions');
    }
  };

  const handleCloseTransaction = () => {
    if (window.confirm('Are you sure you want to close this transaction?')) {
      const updatedActivities = [
        ...(transaction.activities || []),
        {
          id: generateId(),
          type: 'comment',
          content: 'Transaction closed',
          createdAt: new Date(),
          userId: user.id,
        },
      ];

      updateTransaction(transaction.id, {
        status: 'completed',
        activities: updatedActivities,
        updatedAt: new Date(),
      });
    }
  };

  const handleReopenTransaction = () => {
    if (window.confirm('Are you sure you want to reopen this transaction?')) {
      const updatedActivities = [
        ...(transaction.activities || []),
        {
          id: generateId(),
          type: 'comment',
          content: 'Transaction reopened',
          createdAt: new Date(),
          userId: user.id,
        },
      ];

      updateTransaction(transaction.id, {
        status: 'active',
        activities: updatedActivities,
        updatedAt: new Date(),
      });
    }
  };

  const handleActivitySubmit = (data: any) => {
    const { activityToEdit } = activityModal;
    
    if (activityToEdit) {
      // Update existing activity
      const updatedActivities = transaction.activities?.map(activity =>
        activity.id === activityToEdit.id
          ? {
              ...activity,
              ...data,
              createdAt: data.activityDate || data.createdAt,
            }
          : activity
      );

      updateTransaction(transaction.id, {
        activities: updatedActivities,
        updatedAt: new Date(),
        ...(data.includePrincipal && { status: 'completed' }),
      });
    } else {
      // Create new activity
      const newActivity = {
        id: generateId(),
        type: activityModal.type,
        ...(activityModal.type === 'payment' ? {
          amount: data.amount,
          interestMonths: data.interestMonths,
          includedPrincipal: data.includePrincipal,
        } : {}),
        content: activityModal.type === 'payment' ? data.comment : data.content,
        createdAt: data.activityDate,
        userId: user.id,
      };

      const updatedActivities = [
        ...(transaction.activities || []),
        newActivity,
      ];

      updateTransaction(transaction.id, {
        activities: updatedActivities,
        updatedAt: new Date(),
        ...(data.includePrincipal && { status: 'completed' }),
      });
    }

    setActivityModal({ isOpen: false, type: 'payment' });
    setEditingActivity(null);
  };

  return (
    <div className="space-y-6">
      <TransactionHeader
        transaction={transaction}
        onBack={() => navigate('/transactions')}
        onDelete={handleDelete}
        onClose={handleCloseTransaction}
        onReopen={handleReopenTransaction}
      />

      {/* Transaction Details Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {isEditing ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Edit Transaction</h2>
              <TransactionForm
                transaction={transaction}
                onSuccess={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <TransactionDetails
              transaction={transaction}
              contact={contact}
              calculationType={user.settings.interestCalculation}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Activity</h3>
            {transaction.status !== 'completed' && (
              <div className="flex space-x-4">
                <button
                  onClick={() => setActivityModal({ isOpen: true, type: 'comment' })}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Add Comment
                </button>
                <button
                  onClick={() => setActivityModal({ isOpen: true, type: 'payment' })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Record Payment
                </button>
              </div>
            )}
          </div>

          <TransactionActivity
            transaction={transaction}
            onEdit={(activityId, newContent, newDate) => {
              const activity = transaction.activities?.find(a => a.id === activityId);
              if (activity) {
                setActivityModal({
                  isOpen: true,
                  type: activity.type,
                  activityToEdit: activity,
                });
              }
            }}
            editingActivityId={editingActivity}
            setEditingActivityId={setEditingActivity}
          />
        </div>
      </div>

      <ActivityModal
        isOpen={activityModal.isOpen}
        onClose={() => setActivityModal({ isOpen: false, type: 'payment' })}
        type={activityModal.type}
        transaction={transaction}
        activityToEdit={activityModal.activityToEdit}
        onSubmit={handleActivitySubmit}
      />
    </div>
  );
}