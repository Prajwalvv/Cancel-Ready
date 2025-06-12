import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

// API endpoints documentation
const endpoints = [
  {
    id: 'initialization',
    name: 'Initialization',
    description: 'Initialize the CancelReady library',
    method: 'CancelReady.init(config)',
    params: [
      { name: 'vendorKey', type: 'string', required: true, description: 'Your unique vendor identifier' },
      { name: 'userId', type: 'string', required: true, description: 'Current user\'s unique identifier that MUST match how the user is stored in your payment processor. For Stripe, this should match the ID stored in subscription metadata. For Paddle, this should match the ID stored in the passthrough field.' },
      { name: 'buttonText', type: 'string', required: false, description: 'Custom text for the cancel button', default: '"Cancel subscription"' },
      { name: 'buttonColor', type: 'string', required: false, description: 'HEX color code for the button', default: '"#ef4444"' },
      { name: 'testMode', type: 'boolean', required: false, description: 'Enable test mode (no actual cancellations)', default: 'false' },
      { name: 'modalTitle', type: 'string', required: false, description: 'Custom title for the cancellation modal', default: '"Cancel Your Subscription"' },
      { name: 'modalMessage', type: 'string', required: false, description: 'Custom message in the cancellation modal', default: '"Are you sure you want to cancel?"' },
      { name: 'confirmButtonText', type: 'string', required: false, description: 'Text for the confirm button in modal', default: '"Yes, Cancel Now"' },
      { name: 'cancelButtonText', type: 'string', required: false, description: 'Text for the cancel button in modal', default: '"No, Keep My Subscription"' },
      { name: 'apiUrl', type: 'string', required: false, description: 'Custom API endpoint for cancellation requests', default: '"https://api.cancelready.com/cancel"' },
      { name: 'onSuccess', type: 'function', required: false, description: 'Callback function after successful cancellation', default: 'null' },
      { name: 'onError', type: 'function', required: false, description: 'Callback function after failed cancellation', default: 'null' },
      { name: 'collectFeedback', type: 'boolean', required: false, description: 'Enable cancellation reason collection', default: 'false' },
      { name: 'feedbackOptions', type: 'array', required: false, description: 'Array of predefined cancellation reasons', default: '[]' },
    ]
  },
  {
    id: 'cancel',
    name: 'Manual Cancellation',
    description: 'Programmatically trigger the cancellation flow',
    method: 'CancelReady.cancel(options)',
    params: [
      { name: 'skipConfirmation', type: 'boolean', required: false, description: 'Skip the confirmation modal', default: 'false' },
      { name: 'reason', type: 'string', required: false, description: 'Pre-filled cancellation reason', default: 'null' },
      { name: 'metadata', type: 'object', required: false, description: 'Additional data to include with cancellation', default: '{}' },
    ]
  },
  {
    id: 'update',
    name: 'Update Configuration',
    description: 'Update CancelReady configuration after initialization',
    method: 'CancelReady.updateConfig(config)',
    params: [
      { name: 'config', type: 'object', required: true, description: 'Configuration object with properties to update' },
    ]
  },
  {
    id: 'destroy',
    name: 'Destroy Instance',
    description: 'Remove CancelReady from the page',
    method: 'CancelReady.destroy()',
    params: []
  },
  {
    id: 'events',
    name: 'Event Listeners',
    description: 'Subscribe to CancelReady events',
    method: 'CancelReady.on(event, callback)',
    params: [
      { name: 'event', type: 'string', required: true, description: 'Event name to listen for (e.g., "cancel:success", "cancel:error", "modal:open", "modal:close")' },
      { name: 'callback', type: 'function', required: true, description: 'Function to call when the event occurs' },
    ]
  },
];

// REST API endpoints
const restEndpoints = [
  {
    id: 'post-cancel',
    name: 'POST /cancel',
    description: 'Process a cancellation request',
    url: 'https://api.cancelready.com/cancel',
    method: 'POST',
    note: 'The userId parameter must match exactly how the user is identified in your payment processor. For Stripe, this should match the ID stored in subscription metadata. For Paddle, this should match the ID stored in the passthrough field.',
    headers: [
      { name: 'Content-Type', value: 'application/json', required: true },
      { name: 'Authorization', value: 'Bearer YOUR_API_KEY', required: true },
    ],
    body: {
      vendorKey: 'your_vendor_key',
      userId: 'user_123',  // MUST match how user is stored in payment processor
      subscriptionId: 'sub_456',
      reason: 'No longer needed',
      metadata: {
        plan: 'premium',
        billingCycle: 'monthly'
      }
    },
    response: {
      success: true,
      cancellationId: 'can_789',
      message: 'Subscription successfully cancelled',
      effectiveDate: '2025-05-25T00:00:00Z'
    }
  },
  {
    id: 'get-cancellations',
    name: 'GET /cancellations',
    description: 'Retrieve cancellation records',
    url: 'https://api.cancelready.com/cancellations',
    method: 'GET',
    headers: [
      { name: 'Authorization', value: 'Bearer YOUR_API_KEY', required: true },
    ],
    queryParams: [
      { name: 'vendorKey', required: true, description: 'Your vendor key' },
      { name: 'startDate', required: false, description: 'Filter by start date (ISO format)' },
      { name: 'endDate', required: false, description: 'Filter by end date (ISO format)' },
      { name: 'limit', required: false, description: 'Number of records to return (default: 50, max: 100)' },
      { name: 'offset', required: false, description: 'Pagination offset' },
    ],
    response: {
      cancellations: [
        {
          id: 'can_789',
          vendorKey: 'your_vendor_key',
          userId: 'user_123',
          subscriptionId: 'sub_456',
          reason: 'No longer needed',
          status: 'completed',
          timestamp: '2025-05-24T15:30:00Z',
          metadata: {
            plan: 'premium',
            billingCycle: 'monthly'
          }
        }
      ],
      total: 1,
      limit: 50,
      offset: 0
    }
  },
  {
    id: 'get-reports',
    name: 'GET /reports',
    description: 'Retrieve compliance reports',
    url: 'https://api.cancelready.com/reports',
    method: 'GET',
    headers: [
      { name: 'Authorization', value: 'Bearer YOUR_API_KEY', required: true },
    ],
    queryParams: [
      { name: 'vendorKey', required: true, description: 'Your vendor key' },
      { name: 'year', required: false, description: 'Filter by year (e.g., 2025)' },
      { name: 'month', required: false, description: 'Filter by month (1-12)' },
    ],
    response: {
      reports: [
        {
          id: 'rep_123',
          vendorKey: 'your_vendor_key',
          year: 2025,
          month: 5,
          url: 'https://storage.cancelready.com/reports/your_vendor_key/2025-05.pdf',
          generatedAt: '2025-06-01T00:00:00Z'
        }
      ]
    }
  }
];

export default function ApiReference() {
  const [activeEndpoint, setActiveEndpoint] = useState('initialization');

  return (
    <Layout title="API Reference - CancelReady">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <div className="flex items-center space-x-2 text-sm text-primary-100 mb-2">
              <Link href="/docs" className="hover:text-white">Documentation</Link>
              <ChevronRightIcon className="h-4 w-4" />
              <span>API Reference</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">API Reference</h1>
            <p className="text-primary-100 max-w-3xl">
              Comprehensive documentation for the CancelReady JavaScript library and REST API.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8">
                <h2 className="text-xs font-semibold text-secondary-900 uppercase tracking-wider mb-3">
                  JavaScript Library
                </h2>
                <nav className="space-y-1 mb-8">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`flex items-center px-4 py-2 w-full text-left text-sm rounded-md ${
                        activeEndpoint === endpoint.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      {endpoint.name}
                    </button>
                  ))}
                </nav>
                
                <h2 className="text-xs font-semibold text-secondary-900 uppercase tracking-wider mb-3">
                  REST API
                </h2>
                <nav className="space-y-1">
                  {restEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`flex items-center px-4 py-2 w-full text-left text-sm rounded-md ${
                        activeEndpoint === endpoint.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      {endpoint.name}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 p-4 bg-secondary-50 rounded-md">
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">Need help?</h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    Can't find what you're looking for?
                  </p>
                  <Link
                    href="/support"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Contact Support →
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* JavaScript Library Endpoints */}
              {endpoints.map((endpoint) => (
                activeEndpoint === endpoint.id && (
                  <div key={endpoint.id}>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">{endpoint.name}</h2>
                    <p className="text-secondary-600 mb-6">{endpoint.description}</p>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-3">Method Signature</h3>
                      <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">{endpoint.method}</pre>
                      </div>
                    </div>
                    
                    {endpoint.params.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-3">Parameters</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Required
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Default
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                              {endpoint.params.map((param, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                    {param.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                    <code className="bg-secondary-100 px-2 py-1 rounded text-secondary-800">
                                      {param.type}
                                    </code>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                    {param.required ? (
                                      <span className="text-red-600">Yes</span>
                                    ) : (
                                      <span className="text-secondary-500">No</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                    {param.default || '-'}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-secondary-600">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-3">Example</h3>
                      <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          {endpoint.id === 'initialization' && `// Initialize CancelReady with basic configuration
CancelReady.init({
  vendorKey: 'your_vendor_key',
  userId: 'current_user_id',
  buttonText: 'Cancel my subscription',
  buttonColor: '#3b82f6',
  testMode: false,
  onSuccess: function(data) {
    console.log('Cancellation successful:', data);
  },
  onError: function(error) {
    console.error('Cancellation failed:', error);
  }
});`}
                          {endpoint.id === 'cancel' && `// Trigger cancellation programmatically
document.getElementById('cancel-button').addEventListener('click', function() {
  CancelReady.cancel({
    skipConfirmation: false,
    reason: 'Moving to a different service',
    metadata: {
      currentPlan: 'premium',
      userSince: '2024-10-15'
    }
  });
});`}
                          {endpoint.id === 'update' && `// Update configuration after initialization
CancelReady.updateConfig({
  buttonText: 'Cancel your plan',
  buttonColor: '#10b981',
  modalTitle: 'We hate to see you go!',
  collectFeedback: true,
  feedbackOptions: [
    'Too expensive',
    'Not using enough',
    'Found a better alternative',
    'Missing features',
    'Other'
  ]
});`}
                          {endpoint.id === 'destroy' && `// Remove CancelReady from the page
// This is useful when navigating away or when the component unmounts
CancelReady.destroy();`}
                          {endpoint.id === 'events' && `// Listen for cancellation events
CancelReady.on('modal:open', function() {
  console.log('Cancellation modal opened');
  // Track analytics event
  analytics.track('cancellation_modal_opened');
});

CancelReady.on('cancel:success', function(data) {
  console.log('Subscription cancelled successfully', data);
  // Redirect to feedback page
  window.location.href = '/feedback?cancellation_id=' + data.cancellationId;
});

CancelReady.on('cancel:error', function(error) {
  console.error('Cancellation failed', error);
  // Show custom error message
  showErrorNotification('Unable to process your cancellation. Please contact support.');
});`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            {endpoint.id === 'initialization' && 'The init method should be called only once per page. If you need to update the configuration later, use the updateConfig method.'}
                            {endpoint.id === 'cancel' && 'When skipConfirmation is set to true, the cancellation will be processed immediately without showing the confirmation modal. Use with caution.'}
                            {endpoint.id === 'update' && 'The updateConfig method only updates the properties you specify. Other properties will retain their current values.'}
                            {endpoint.id === 'destroy' && 'After calling destroy(), you\'ll need to call init() again if you want to re-initialize CancelReady.'}
                            {endpoint.id === 'events' && 'Event listeners persist until CancelReady.destroy() is called or the page is unloaded.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
              
              {/* REST API Endpoints */}
              {restEndpoints.map((endpoint) => (
                activeEndpoint === endpoint.id && (
                  <div key={endpoint.id}>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">{endpoint.name}</h2>
                    <p className="text-secondary-600 mb-6">{endpoint.description}</p>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-3">Endpoint</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                          {endpoint.method}
                        </span>
                        <code className="text-sm bg-secondary-100 px-2 py-1 rounded">{endpoint.url}</code>
                      </div>
                    </div>
                    
                    {endpoint.headers.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-3">Headers</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Value
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Required
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                              {endpoint.headers.map((header, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                    {header.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                    <code className="bg-secondary-100 px-2 py-1 rounded text-secondary-800">
                                      {header.value}
                                    </code>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                    {header.required ? (
                                      <span className="text-red-600">Yes</span>
                                    ) : (
                                      <span className="text-secondary-500">No</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-3">Query Parameters</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Required
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                              {endpoint.queryParams.map((param, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                    {param.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                    {param.required ? (
                                      <span className="text-red-600">Yes</span>
                                    ) : (
                                      <span className="text-secondary-500">No</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-secondary-600">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {endpoint.body && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-3">Request Body</h3>
                        {endpoint.note && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                            <p className="text-sm text-yellow-700">
                              <strong>Important:</strong> {endpoint.note}
                            </p>
                          </div>
                        )}
                        <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                          <pre className="text-sm">{JSON.stringify(endpoint.body, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-3">Response</h3>
                      <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">{JSON.stringify(endpoint.response, null, 2)}</pre>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-3">Example Request</h3>
                      <div className="bg-secondary-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          {endpoint.method === 'POST' && `// Using fetch API
fetch('${endpoint.url}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(endpoint.body, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                          
                          {endpoint.method === 'GET' && `// Using fetch API
fetch('${endpoint.url}?vendorKey=your_vendor_key${endpoint.id === 'get-reports' ? '&year=2025&month=5' : '&startDate=2025-05-01T00:00:00Z&endDate=2025-05-25T23:59:59Z&limit=50&offset=0'}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            {endpoint.id === 'post-cancel' && 'This endpoint requires authentication with a valid API key. Cancellations are processed immediately and cannot be undone.'}
                            {endpoint.id === 'get-cancellations' && 'This endpoint supports pagination. Use the limit and offset parameters to navigate through large result sets.'}
                            {endpoint.id === 'get-reports' && 'Monthly reports are generated on the 1st day of the following month. Reports are available in PDF format.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
