/**
 * Generates a standardized integration code snippet for CancelReady
 * @param {string} vendorKey - The vendor's unique key
 * @param {Object} options - Optional configuration settings
 * @returns {string} - The formatted code snippet
 */
export function generateIntegrationSnippet(vendorKey, options = {}) {
  const {
    buttonText = 'Cancel subscription',
    buttonColor = '#ef4444',
    testMode = false,
    customBranding = false,
    modalTitle = '',
    modalMessage = '',
  } = options;

  let snippet = `<!-- CancelReady Integration -->
<script src="https://cdn.cancelready.com/cancelkit.min.js"></script>

<!-- Add this div where you want the cancel button to appear -->
<div id="cr-target"></div>

<script>
  // Initialize CancelReady
  CancelReady.init({
    vendorKey: "${vendorKey}",
    // IMPORTANT: Replace YOUR_USER_ID with the user identifier that matches
    // how you've stored them in your payment processor:
    // - For Stripe: Use the same ID stored in subscription metadata as 'userId'
    // - For Paddle: Use the same ID stored in subscription passthrough field as 'userId'
    userId: "YOUR_USER_ID",`;

  // Add optional parameters if provided
  if (buttonText) {
    snippet += `\n    buttonText: "${buttonText}",`;
  }
  
  if (buttonColor) {
    snippet += `\n    buttonColor: "${buttonColor}",`;
  }
  
  if (testMode !== undefined) {
    snippet += `\n    testMode: ${testMode},`;
  }

  // Add custom branding if enabled
  if (customBranding && modalTitle) {
    snippet += `\n    modalTitle: "${modalTitle}",`;
  }
  
  if (customBranding && modalMessage) {
    snippet += `\n    modalMessage: "${modalMessage}",`;
  }

  // Remove trailing comma and close the snippet
  snippet = snippet.replace(/,\s*$/, '');
  snippet += `\n  });\n</script>`;

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
