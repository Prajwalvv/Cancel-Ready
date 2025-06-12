import React from 'react';
import { FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { format } from 'date-fns';

/**
 * Component for displaying the list of cancellation records
 */
const CancellationList = ({ cancellations, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error loading cancellation data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cancellations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <FaChartBar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cancellations yet</h3>
          <p className="mt-1 text-sm text-gray-500">Cancellation records will appear here when users cancel their subscriptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {cancellations.map((cancellation) => (
          <li key={cancellation.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">{cancellation.userId || 'Unknown User'}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cancellation.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : cancellation.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cancellation.status || 'pending'}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                  <p className="text-sm text-gray-500">
                    {cancellation.timestamp 
                      ? format(new Date(cancellation.timestamp.seconds * 1000), 'MMM d, yyyy h:mm a')
                      : 'Unknown date'}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {cancellation.paymentProvider || 'Unknown provider'}
                  </p>
                </div>
                {cancellation.reason && (
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Reason: {cancellation.reason}</p>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CancellationList;
