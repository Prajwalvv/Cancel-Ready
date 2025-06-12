/**
 * CancelReady - A lightweight subscription cancellation widget
 * v1.0.0
 */
(function() {
  // Configuration object that can be overridden by the user
  const config = {
    vendorKey: null,
    userId: null,
    buttonText: 'Cancel subscription',
    buttonColor: '#ef4444',
    modalTitle: 'Cancel Subscription',
    modalMessage: 'Are you sure you want to cancel your subscription?',
    confirmButtonText: 'Yes, cancel',
    cancelButtonText: 'No, keep it',
    apiUrl: 'https://api.cancelready.com/cancel',
    successMessage: 'Your subscription has been successfully canceled.',
    errorMessage: 'Failed to cancel subscription. Please try again or contact support.',
    testMode: false
  };

  // Inject Tailwind CSS if not already present
  function injectTailwindCSS() {
    if (!document.getElementById('tailwind-css')) {
      const tailwindCDN = document.createElement('script');
      tailwindCDN.src = 'https://cdn.tailwindcss.com';
      tailwindCDN.id = 'tailwind-css';
      document.head.appendChild(tailwindCDN);
    }
  }

  // Create and inject the button into the target div
  function injectButton() {
    const targetDiv = document.getElementById('cr-target');
    if (!targetDiv) return;

    const button = document.createElement('button');
    button.textContent = config.buttonText;
    button.className = 'cr-button text-white font-medium py-2 px-4 rounded';
    button.style.backgroundColor = config.buttonColor;
    button.style.cursor = 'pointer';
    button.onmouseover = function() {
      this.style.opacity = '0.9';
    };
    button.onmouseout = function() {
      this.style.opacity = '1';
    };
    button.addEventListener('click', openModal);
    targetDiv.appendChild(button);
  }

  // Create and open the confirmation modal
  function openModal() {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'cr-modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'cr-modal bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto';
    
    // Modal header
    const header = document.createElement('div');
    header.className = 'text-lg font-bold mb-4';
    header.textContent = config.modalTitle;
    
    // Modal message
    const message = document.createElement('p');
    message.className = 'mb-6 text-gray-600';
    message.textContent = config.modalMessage;
    
    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-end space-x-3';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100';
    cancelButton.textContent = config.cancelButtonText;
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(backdrop);
    });
    
    // Confirm button
    const confirmButton = document.createElement('button');
    confirmButton.className = 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600';
    confirmButton.textContent = config.confirmButtonText;
    confirmButton.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      cancelSubscription();
    });
    
    // Assemble modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    modal.appendChild(header);
    modal.appendChild(message);
    modal.appendChild(buttonContainer);
    backdrop.appendChild(modal);
    
    // Add to DOM
    document.body.appendChild(backdrop);
  }

  // Send cancellation request to API
  function cancelSubscription() {
    if (!config.vendorKey || !config.userId) {
      showToast(config.errorMessage + ' Missing vendorKey or userId.', 'error');
      return;
    }

    fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vendorKey: config.vendorKey,
        userId: config.userId
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      showToast(config.successMessage, 'success');
    })
    .catch(error => {
      showToast(config.errorMessage, 'error');
      console.error('Error canceling subscription:', error);
    });
  }

  // Show toast notification
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `cr-toast fixed bottom-4 right-4 py-2 px-4 rounded shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }

  // Initialize CancelReady
  function init(userConfig = {}) {
    // Merge user configuration with defaults
    Object.assign(config, userConfig);
    
    // Inject Tailwind CSS
    injectTailwindCSS();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectButton);
    } else {
      injectButton();
    }
  }

  // Expose the init function globally
  window.CancelReady = {
    init: init
  };
})();
