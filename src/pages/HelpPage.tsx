import React from 'react';

export function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-medium text-gray-900">Getting Started</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Welcome to LendTrack! This application helps you manage your personal lending
                  and borrowing activities. Here's how to get started:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Use the Dashboard to view your overall financial status</li>
                  <li>Add new transactions from the Transactions page</li>
                  <li>Track your lending history in the History section</li>
                  <li>Set and monitor financial goals</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-900">FAQ</h3>
              <div className="mt-2 space-y-4">
                <details className="group">
                  <summary className="list-none">
                    <div className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 hover:text-indigo-600">
                      How do I add a new transaction?
                      <span className="ml-6 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <div className="mt-2 text-sm text-gray-500">
                    Navigate to the Transactions page and click the "New Transaction" button.
                    Fill in the required details and submit the form.
                  </div>
                </details>

                <details className="group">
                  <summary className="list-none">
                    <div className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 hover:text-indigo-600">
                      How are notifications handled?
                      <span className="ml-6 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <div className="mt-2 text-sm text-gray-500">
                    You'll receive notifications for upcoming payments and overdue transactions.
                    Check the notification bell icon in the top right corner for updates.
                  </div>
                </details>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Need additional help? Contact our support team at{' '}
                  <a
                    href="mailto:support@lendtrack.com"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    support@lendtrack.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}