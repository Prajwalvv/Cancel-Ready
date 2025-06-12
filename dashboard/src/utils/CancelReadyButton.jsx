import { useState } from 'react';
import { Button } from '../components/ui/button'; // Adjust this import based on your UI library

/**
 * CancelReady Button Component
 * Redirects to the cancel page which handles the cancellation process
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User object with email or uid
 * @param {string} props.vendorKey - Your CancelReady vendor key
 * @param {string} props.cancelUrl - Base URL for the cancel page (default: https://cancelready.web.app/cancel)
 * @param {string} props.buttonText - Text to display on the button
 * @param {string} props.buttonColor - Color of the cancel button
 * @param {string} props.supportEmail - Support email for manual cancellations
 * @param {boolean} props.testMode - Whether to use test mode
 */
export function CancelReadyButton({ 
  user, 
  vendorKey, 
  cancelUrl = "https://cancelready.web.app/cancel",
  buttonText = "Cancel subscription", 
  buttonColor = "#f97316",
  supportEmail,
  testMode = false
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [message, setMessage] = useState('');

  // Redirect to the cancel page which will handle the API call
  const handleCancellation = () => {
    if (!user || !vendorKey) {
      setStatus('error');
      setMessage('Missing required user information or vendor key');
      return;
    }
    
    setIsLoading(true);
    setStatus(null);
    setMessage('');
    
    const userId = user.email || user.uid || '';
    console.log(`Redirecting to cancel page for user: ${userId}`);
    
    // Construct the URL to the cancel page with all necessary parameters
    const fullCancelUrl = `${cancelUrl}?vendorKey=${encodeURIComponent(vendorKey)}&userId=${encodeURIComponent(userId)}${testMode ? '&testMode=true' : ''}`;
    
    // Open the cancel page in a new window
    const cancelWindow = window.open(fullCancelUrl, '_blank');
    
    // If the window was blocked, show an error
    if (!cancelWindow || cancelWindow.closed || typeof cancelWindow.closed === 'undefined') {
      setIsLoading(false);
      setStatus('error');
      setMessage('Popup was blocked. Please allow popups for this site and try again.');
      return;
    }
    
    // Show success message after the window is opened
    setIsLoading(false);
    setStatus('success');
    setMessage('Cancellation page opened. Please complete the process in the new window.');
    setShowConfirm(false);
  };

  // Show confirmation dialog
  const showConfirmation = () => {
    setShowConfirm(true);
  };

  // Cancel confirmation
  const cancelConfirmation = () => {
    setShowConfirm(false);
  };

  // Handle manual cancellation via email
  const handleManualCancellation = () => {
    if (!user) return;
    
    // Use provided support email or fall back to a placeholder
    const emailTo = supportEmail || 'support@example.com';
    
    window.open(
      `mailto:${emailTo}?subject=Cancel%20My%20Subscription&body=Vendor%20Key:%20${encodeURIComponent(vendorKey)}%0D%0AUser%20ID:%20${encodeURIComponent(user?.email || user?.uid || '')}`,
      '_blank'
    );
  };

  return (
    <div className="mt-6">
      {!showConfirm && status !== 'success' && (
        <Button 
          variant="outline" 
          className="w-full" 
          style={{ backgroundColor: buttonColor, color: 'white', fontWeight: 'normal' }}
          onClick={showConfirmation}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : buttonText}
        </Button>
      )}
      
      {/* Confirmation dialog */}
      {showConfirm && status !== 'success' && (
        <div className="p-4 border border-gray-200 rounded-md shadow-sm">
          <h3 className="text-base font-medium mb-2">Confirm Cancellation</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={cancelConfirmation}
              disabled={isLoading}
            >
              No, keep it
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1" 
              onClick={handleCancellation}
              disabled={isLoading}
            >
              Yes, cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Success message */}
      {status === 'success' && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h3 className="text-lg font-medium text-green-800">Cancellation Successful</h3>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      )}
      
      {/* Error message */}
      {status === 'error' && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 mt-3">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      )}
      
      {/* Alternative method for technical issues - only show if supportEmail is provided */}
      {supportEmail && (
        <div className="mt-4 text-center">
          <button 
            className="text-xs text-gray-500 hover:text-gray-700 underline"
            onClick={handleManualCancellation}
          >
            Having technical issues? Contact support directly
          </button>
        </div>
      )}
    </div>
  );
}
