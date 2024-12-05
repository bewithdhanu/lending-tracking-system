import React from 'react';
import { ArrowLeft, Trash2, XCircle, RefreshCw } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionHeaderProps {
  transaction: Transaction;
  onBack: () => void;
  onDelete: () => void;
  onClose: () => void;
  onReopen: () => void;
}

export function TransactionHeader({ 
  transaction, 
  onBack, 
  onDelete, 
  onClose,
  onReopen 
}: TransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Transactions
      </button>
      <div className="space-x-4">
        {transaction.status === 'completed' ? (
          <button
            onClick={onReopen}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reopen Transaction
          </button>
        ) : (
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Close Transaction
          </button>
        )}
        <button
          onClick={onDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Transaction
        </button>
      </div>
    </div>
  );
}