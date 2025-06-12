import React from 'react';
import { useRouter } from 'next/router';

/**
 * Component for the dashboard header section
 * Contains the vendor info, export data button, and view code snippet button
 */
const DashboardHeader = ({ 
  companyData, 
  vendorKey, 
  handleViewCodeSnippet, 
  handleExportData = () => console.log('Export data feature not implemented') 
}) => {
  const router = useRouter();
  
  return (
    <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Dashboard
        </h2>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
            </svg>
            Vendor: <span className="ml-1 font-medium text-gray-900">{vendorKey}</span>
          </div>
          {companyData && companyData.company && (
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z" clipRule="evenodd" />
              </svg>
              Company: <span className="ml-1 font-medium text-gray-900">{companyData.company}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 sm:mt-0 sm:ml-4">
        <button
          type="button"
          onClick={handleExportData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Export Data
        </button>
        <button
          type="button"
          onClick={handleViewCodeSnippet}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Code Snippet
        </button>

      </div>
    </div>
  );
};

export default DashboardHeader;
