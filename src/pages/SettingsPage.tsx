import React from 'react';
import { useStore } from '../store/useStore';
import { calculateInterest, calculateTotalAmount, formatCurrency, convertInterestRate } from '../lib/calculations';

export function SettingsPage() {
  const { user, updateUserSettings, transactions, updateTransaction } = useStore();

  const handleInterestTypeChange = (type: 'percentage' | 'per100') => {
    const oldType = user?.settings?.interestCalculation || 'percentage';
    
    // Update all transactions with converted interest rates
    transactions.forEach(transaction => {
      const newRate = convertInterestRate(transaction.interestRate, oldType, type);
      updateTransaction(transaction.id, { interestRate: newRate });
    });

    // Update user settings
    updateUserSettings({ interestCalculation: type });
  };

  // Example calculation for demonstration
  const exampleTransaction = {
    id: 'example',
    userId: user?.id || '',
    type: 'lending',
    amount: 1000,
    currency: 'INR',
    contactId: '',
    interestRate: user?.settings?.interestCalculation === 'percentage' ? 24 : 2,
    startDate: new Date(),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const calculationType = user?.settings?.interestCalculation || 'percentage';
  const amounts = calculateTotalAmount(exampleTransaction, calculationType);
  const interestAmount = calculateInterest(exampleTransaction, calculationType);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Account Information
          </h3>
          <div className="mt-6 max-w-xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Interest Calculation Settings
          </h3>
          <div className="mt-6 max-w-xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interest Calculation Method
              </label>
              <div className="mt-2 space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="percentage"
                    name="interest-type"
                    checked={calculationType === 'percentage'}
                    onChange={() => handleInterestTypeChange('percentage')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="percentage" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">
                      Percentage Based
                    </span>
                    <span className="block text-sm text-gray-500">
                      Calculate interest as a percentage of the principal amount per year
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="per100"
                    name="interest-type"
                    checked={calculationType === 'per100'}
                    onChange={() => handleInterestTypeChange('per100')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="per100" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">
                      Per 100 Per Month
                    </span>
                    <span className="block text-sm text-gray-500">
                      Calculate interest based on rate per 100 units per month
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Example Calculation
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Principal Amount: {formatCurrency(exampleTransaction.amount, exampleTransaction.currency)}</p>
                <p>Interest Rate: {exampleTransaction.interestRate}{calculationType === 'percentage' ? '% per year' : ' per 100 per month'}</p>
                <p>Duration: 12 months</p>
                <p className="text-indigo-600 font-medium">
                  Interest Amount: {formatCurrency(interestAmount, exampleTransaction.currency)}
                </p>
                <p className="text-indigo-600 font-medium">
                  Total Amount: {formatCurrency(amounts.total, exampleTransaction.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}