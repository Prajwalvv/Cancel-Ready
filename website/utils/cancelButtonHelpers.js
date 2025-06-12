/**
 * Helper functions for CancelReady button integration
 * This file provides examples and utilities for integrating the CancelReady button
 * in different JavaScript environments.
 */

/**
 * Initialize a CancelReady button with the given options
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.targetDivId - ID of the div where the button will be placed
 * @param {string} options.vendorKey - Your CancelReady vendor key
 * @param {string} options.subscriptionId - The end user's subscription ID
 * @param {string} options.paymentProvider - Payment provider ('stripe' or 'paddle')
 * @param {string} [options.buttonText] - Custom text for the button
 * @param {boolean} [options.testMode] - Whether to run in test mode
 * @param {Function} [options.onSuccess] - Callback for successful cancellations
 * @param {Function} [options.onError] - Callback for cancellation errors
 */
export function initCancelReadyButton(options) {
  const { targetDivId, vendorKey, subscriptionId, paymentProvider, ...otherOptions } = options;

  // Ensure the target div exists or create it
  let targetElement = document.getElementById(targetDivId);
  if (!targetElement) {
    console.warn("CancelReady: Target div '" + targetDivId + "' not found. Creating one.");
    targetElement = document.createElement('div');
    targetElement.id = targetDivId;
    // Append it to a suitable place, e.g., document.body or a specific container
    // This might need adjustment based on your site structure.
    document.body.appendChild(targetElement);
  }

  if (window.CancelReady) {
    window.CancelReady.init({
      targetId: '#' + targetDivId, // Or pass targetElement directly if API supports
      vendorKey,
      subscriptionId,
      paymentProvider,
      ...otherOptions
    });
  } else {
    console.error('CancelReady script not loaded yet.');
  }
}

/**
 * Get the example usage code snippet for the vanilla JS implementation
 * @returns {string} Example code as a string
 */
export function getVanillaJSExample() {
  return `// Example Usage:
initCancelReadyButton({
  targetDivId: 'cr-target-div',
  vendorKey: 'YOUR_VENDOR_KEY',
  subscriptionId: 'USER_SUBSCRIPTION_ID',
  paymentProvider: 'stripe',
  buttonText: 'Request Cancellation'
});`;
}

/**
 * Get the React component example code for CancelReady integration
 * @returns {string} React component code as a string
 */
export function getReactComponentExample() {
  return `import React, { useEffect, useRef } from 'react';

// 1. Ensure CancelReady script is loaded in your main HTML file:
// <script src="https://cancelready.web.app/cancel"></script>

const CancelButton = ({ vendorKey, subscriptionId, paymentProvider, buttonText, testMode, onSuccess, onError }) => {
  const targetEl = useRef(null);

  useEffect(() => {
    if (window.CancelReady && targetEl.current) {
      window.CancelReady.init({
        targetElement: targetEl.current, // Pass the DOM element directly
        vendorKey,
        subscriptionId,
        paymentProvider,
        buttonText,
        testMode,
        onSuccess,
        onError
      });
    } else if (!window.CancelReady) {
      console.error('CancelReady script not loaded yet.');
    }
  }, [vendorKey, subscriptionId, paymentProvider, buttonText, testMode, onSuccess, onError]);

  return <div ref={targetEl}></div>; // CancelReady will populate this div
};

export default CancelButton;`;
}

/**
 * Get the script tag needed to load CancelReady
 * @returns {string} HTML script tag
 */
export function getCancelReadyScriptTag() {
  return `<script src="https://cancelready.web.app/cancel"></script>`;
}
