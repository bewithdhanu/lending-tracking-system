import React from 'react';

export function GoalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Financial Goals</h1>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Coming Soon
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              The financial goals feature is currently under development. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}