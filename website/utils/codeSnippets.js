/**
 * Generates a standardized integration code snippet for CancelReady.
 * This snippet includes loading the cancelready.js script and initializing CancelReady.
 * @param {string} vendorKey - The vendor's unique key.
 * @param {('stripe'|'paddle')} [selectedPaymentProvider='paddle'] - The payment provider to show in the snippet.
 * @param {Object} [options={}] - Optional configuration settings.
 * @param {string} [options.buttonText] - Optional text for the cancel button if handled by CancelReady.js.
 * @param {string} [options.buttonColor] - Optional color for the cancel button.
 * @param {boolean} [options.testMode] - Optional flag for test mode.
 * @param {boolean} [options.customBranding] - Optional flag for custom branding.
 * @returns {string} - The formatted HTML/JavaScript code snippet.
 */
export function generateIntegrationSnippet(vendorKey, selectedPaymentProvider = 'paddle', options = {}) {
  const {
    buttonText,    // Optional
    buttonColor,   // Optional
    testMode,      // Optional
    customBranding // Optional
  } = options;

  const paymentProviderValue = selectedPaymentProvider;
  let subscriptionIdComment = '';
  if (selectedPaymentProvider === 'stripe') {
    subscriptionIdComment = "For Stripe: This is the Stripe Subscription ID (e.g., 'sub_xxxxxxxxxxxxxx'). Populate this dynamically for each user.";
  } else if (selectedPaymentProvider === 'paddle') {
    subscriptionIdComment = "For Paddle: This is the Paddle Subscription ID. Populate this dynamically for each user.";
  }

  let snippet = `<!-- CancelReady Cancel Button - Just copy and paste this code where you want the button to appear -->
<button 
  onclick="window.open('https://cancelready.web.app/cancel?vendorKey=${vendorKey}&subscriptionId=THE_END_USERS_ACTUAL_SUBSCRIPTION_ID&paymentProvider=${paymentProviderValue}${testMode ? '&testMode=true' : ''}${customBranding ? '&customBranding=true' : ''}', '_blank')"
  style="background-color: ${buttonColor || '#ef4444'}; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: system-ui, -apple-system, sans-serif; font-size: 14px;"
  onmouseover="this.style.opacity='0.9'"
  onmouseout="this.style.opacity='1'"
>
  ${buttonText || 'Cancel subscription'}
</button>

<!-- That's it! Just replace THE_END_USERS_ACTUAL_SUBSCRIPTION_ID with the user's actual subscription ID -->
<!-- Example for Stripe: sub_1234567890 -->
<!-- Example for Paddle: sub_123456 -->

<!-- No JavaScript initialization required! -->`;

  // No need for additional JavaScript parameters since we're using a direct button
  return snippet;
}

/**
 * Generates HTML for the user ID mapping instructions
 * @returns {string} - HTML for the instructions
 */
export function getUserIdMappingInstructions() {
  return `
<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
  <p class="text-sm text-yellow-700">
    <strong>Important:</strong> Replace <code>YOUR_USER_ID</code> with the user identifier that matches exactly how you've stored it in your payment processor:
  </p>
  <ul class="list-disc ml-5 mt-2 text-sm text-yellow-700">
    <li>For <strong>Stripe</strong>: Use the same ID stored in subscription metadata as 'userId'</li>
    <li>For <strong>Paddle</strong>: Use the same ID stored in subscription passthrough field as 'userId'</li>
  </ul>
  <p class="text-sm text-yellow-700 mt-2">
    If the user IDs don't match exactly, cancellation requests will fail.
  </p>
</div>`;
}
