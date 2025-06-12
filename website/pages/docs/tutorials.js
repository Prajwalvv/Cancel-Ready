import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

// Tutorial data
const tutorials = [
  {
    id: 'react',
    title: 'Integrating with React',
    description: 'Learn how to add CancelReady to a React application',
    difficulty: 'Beginner',
    timeEstimate: '10 minutes',
    content: `
      <h2>Integrating CancelReady with React</h2>
      <p>This tutorial will guide you through the process of adding CancelReady to a React application.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>A React application (Create React App or any other React setup)</li>
        <li>A CancelReady account with a vendor key</li>
      </ul>
      
      <h3>Step 1: Install Dependencies</h3>
      <p>No additional dependencies are required for basic integration.</p>
      
      <h3>Step 2: Create a CancelReady Component</h3>
      <div class="code-block">
        <pre>
// CancelButton.jsx
import { useEffect, useRef } from 'react';

const CancelButton = ({ userId, vendorKey, customOptions = {} }) => {
  const cancelButtonRef = useRef(null);
  
  useEffect(() => {
    // Load the CancelReady script
    const script = document.createElement('script');
    script.src = 'https://cancelready.com/cancelkit.min.js';
    script.async = true;
    script.onload = () => {
      // Initialize CancelReady once the script is loaded
      if (window.CancelReady && cancelButtonRef.current) {
        window.CancelReady.init({
          vendorKey,
          userId,
          ...customOptions
        });
      }
    };
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (window.CancelReady) {
        window.CancelReady.destroy();
      }
      document.body.removeChild(script);
    };
  }, [userId, vendorKey, customOptions]);
  
  return <div id="ck-target" ref={cancelButtonRef}></div>;
};

export default CancelButton;
        </pre>
      </div>
      
      <h3>Step 3: User ID Mapping (Critical)</h3>
      <div class="alert-block">
        <p><strong>Important:</strong> The <code>userId</code> you provide to CancelReady must match exactly how you've stored the user identifier in your payment processor when creating the subscription.</p>
      </div>
      
      <h4>For Stripe Users:</h4>
      <div class="code-block">
        <pre>
// When creating a subscription in Stripe
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: 'price_123' }],
  metadata: {
    userId: user.id  // MUST MATCH the userId you pass to CancelReady
  }
});
        </pre>
      </div>
      
      <h4>For Paddle Users:</h4>
      <div class="code-block">
        <pre>
// When creating a subscription in Paddle
const subscription = await paddle.createSubscription({
  planId: 'plan_123',
  customerId: paddleCustomerId,
  passthrough: JSON.stringify({
    userId: user.id  // MUST MATCH the userId you pass to CancelReady
  })
});
        </pre>
      </div>
      
      <h3>Step 4: Use the Component in Your App</h3>
      <div class="code-block">
        <pre>
// YourAccountPage.jsx
import CancelButton from './CancelButton';

const AccountPage = ({ user }) => {
  return (
    <div className="account-page">
      <h1>Your Account</h1>
      
      {/* Other account settings */}
      
      <div className="subscription-section">
        <h2>Subscription</h2>
        <p>Current Plan: {user.plan}</p>
        <p>Billing Cycle: {user.billingCycle}</p>
        
        {/* Add the CancelReady button */}
        <CancelButton 
          userId={user.id}  // MUST match the ID stored in payment processor
          vendorKey="your_vendor_key"
          customOptions={{
            buttonText: "Cancel my subscription",
            buttonColor: "#ef4444",
            testMode: process.env.NODE_ENV !== 'production'
          }}
        />
      </div>
    </div>
  );
};

export default AccountPage;
        </pre>
      </div>
      
      <h3>Step 4: Handle Cancellation Events (Optional)</h3>
      <p>You can listen for cancellation events to perform additional actions:</p>
      <div class="code-block">
        <pre>
// Enhanced CancelButton.jsx with event handling
import { useEffect, useRef } from 'react';

const CancelButton = ({ userId, vendorKey, onSuccess, onError, customOptions = {} }) => {
  const cancelButtonRef = useRef(null);
  
  useEffect(() => {
    // Load the CancelReady script
    const script = document.createElement('script');
    script.src = 'https://cancelready.com/cancelkit.min.js';
    script.async = true;
    script.onload = () => {
      // Initialize CancelReady once the script is loaded
      if (window.CancelReady && cancelButtonRef.current) {
        window.CancelReady.init({
          vendorKey,
          userId,
          ...customOptions
        });
        
        // Set up event listeners
        if (onSuccess) {
          window.CancelReady.on('cancel:success', onSuccess);
        }
        
        if (onError) {
          window.CancelReady.on('cancel:error', onError);
        }
      }
    };
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (window.CancelReady) {
        window.CancelReady.destroy();
      }
      document.body.removeChild(script);
    };
  }, [userId, vendorKey, customOptions, onSuccess, onError]);
  
  return <div id="ck-target" ref={cancelButtonRef}></div>;
};

export default CancelButton;
        </pre>
      </div>
      
      <h3>Testing Your Integration</h3>
      <p>To test your integration:</p>
      <ol>
        <li>Set <code>testMode: true</code> in your customOptions</li>
        <li>Render the CancelButton component</li>
        <li>Click the "Cancel subscription" button</li>
        <li>Verify that the cancellation modal appears</li>
        <li>Complete the cancellation flow</li>
        <li>Check your CancelReady dashboard to confirm the test cancellation was recorded</li>
      </ol>
    `
  },
  {
    id: 'nextjs',
    title: 'Adding CancelReady to Next.js',
    description: 'Implement CancelReady in a Next.js application',
    difficulty: 'Beginner',
    timeEstimate: '15 minutes',
    content: `
      <h2>Adding CancelReady to Next.js</h2>
      <p>This tutorial shows how to integrate CancelReady with a Next.js application.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>A Next.js application</li>
        <li>A CancelReady account with a vendor key</li>
      </ul>
      
      <h3>Step 1: Create a Script Loader Component</h3>
      <div class="code-block">
        <pre>
// components/CancelReadyScript.js
import { useEffect } from 'react';
import Script from 'next/script';

export default function CancelReadyScript({ vendorKey, userId, options = {} }) {
  useEffect(() => {
    // Initialize CancelReady when the component mounts and the script is loaded
    if (window.CancelReady) {
      window.CancelReady.init({
        vendorKey,
        userId,
        ...options
      });
    }
    
    // Clean up when the component unmounts
    return () => {
      if (window.CancelReady) {
        window.CancelReady.destroy();
      }
    };
  }, [vendorKey, userId, options]);

  return (
    <Script
      src="https://cancelready.com/cancelkit.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.CancelReady) {
          window.CancelReady.init({
            vendorKey,
            userId,
            ...options
          });
        }
      }}
    />
  );
}
        </pre>
      </div>
      
      <h3>Step 2: Create a Cancel Button Component</h3>
      <div class="code-block">
        <pre>
// components/CancelButton.js
import { useEffect } from 'react';
import CancelReadyScript from './CancelReadyScript';

export default function CancelButton({ userId, vendorKey, options = {} }) {
  return (
    <>
      <CancelReadyScript 
        vendorKey={vendorKey}
        userId={userId}
        options={options}
      />
      <div id="ck-target"></div>
    </>
  );
}
        </pre>
      </div>
      
      <h3>Step 3: User ID Mapping (Critical)</h3>
      <div class="alert-block">
        <p><strong>Important:</strong> The <code>userId</code> you provide to CancelReady must match exactly how you've stored the user identifier in your payment processor when creating the subscription.</p>
      </div>
      
      <h4>For Stripe Users:</h4>
      <div class="code-block">
        <pre>
// When creating a subscription in Stripe
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: 'price_123' }],
  metadata: {
    userId: session.user.id  // MUST MATCH the userId you pass to CancelReady
  }
});
        </pre>
      </div>
      
      <h4>For Paddle Users:</h4>
      <div class="code-block">
        <pre>
// When creating a subscription in Paddle
const subscription = await paddle.createSubscription({
  planId: 'plan_123',
  customerId: paddleCustomerId,
  passthrough: JSON.stringify({
    userId: session.user.id  // MUST MATCH the userId you pass to CancelReady
  })
});
        </pre>
      </div>
      
      <h3>Step 4: Use the Component in Your Pages</h3>
      <div class="code-block">
        <pre>
// pages/account.js
import { useSession } from 'next-auth/react';
import CancelButton from '../components/CancelButton';

export default function AccountPage() {
  const { data: session } = useSession();
  
  if (!session) {
    return <p>Please sign in to view your account.</p>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Account</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
        <p className="mb-2">Plan: Premium</p>
        <p className="mb-4">Next billing date: June 25, 2025</p>
        
        <CancelButton 
          userId={session.user.id}  // MUST match the ID stored in payment processor
          vendorKey={process.env.NEXT_PUBLIC_CANCELKIT_VENDOR_KEY}
          options={{
            buttonText: "Cancel my subscription",
            buttonColor: "#ef4444",
            testMode: process.env.NODE_ENV !== 'production'
          }}
        />
      </div>
    </div>
  );
}
        </pre>
      </div>
      
      <h3>Step 4: Environment Variables</h3>
      <p>Create a <code>.env.local</code> file in your project root:</p>
      <div class="code-block">
        <pre>
# .env.local
NEXT_PUBLIC_CANCELREADY_VENDOR_KEY=your_vendor_key
        </pre>
      </div>
      
      <h3>Testing Your Integration</h3>
      <p>To test your integration:</p>
      <ol>
        <li>Run your Next.js app in development mode</li>
        <li>Navigate to your account page</li>
        <li>Verify that the "Cancel subscription" button appears</li>
        <li>Click the button and complete the cancellation flow</li>
        <li>Check your CancelReady dashboard to confirm the test cancellation was recorded</li>
      </ol>
    `
  },
  {
    id: 'wordpress',
    title: 'CancelReady for WordPress',
    description: 'Add CancelReady to a WordPress site with WooCommerce',
    difficulty: 'Intermediate',
    timeEstimate: '20 minutes',
    content: `
      <h2>Integrating CancelReady with WordPress and WooCommerce</h2>
      <p>This tutorial will show you how to add CancelReady to a WordPress site with WooCommerce subscriptions.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>A WordPress website</li>
        <li>WooCommerce and WooCommerce Subscriptions plugins installed and activated</li>
        <li>A CancelReady account with a vendor key</li>
      </ul>
      
      <h3>Step 1: Create a Simple Plugin</h3>
      <p>Create a new folder in your <code>wp-content/plugins</code> directory called <code>cancelready-integration</code>.</p>
      <p>Inside this folder, create a file named <code>cancelready-integration.php</code>:</p>
      <div class="code-block">
        <pre>
<?php
/**
 * Plugin Name: CancelReady Integration
 * Description: Integrates CancelReady with WooCommerce Subscriptions
 * Version: 1.0.0
 * Author: Your Name
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Enqueue CancelReady script
function cancelready_enqueue_scripts() {
    // Only enqueue on the My Account page
    if (is_account_page()) {
        wp_enqueue_script('cancelready', 'https://cancelready.com/cancelkit.min.js', array(), '1.0.0', true);
        
        // Add initialization script
        wp_add_inline_script('cancelready', '
            document.addEventListener("DOMContentLoaded", function() {
                if (typeof CancelReady !== "undefined" && document.getElementById("ck-target")) {
                    CancelReady.init({
                        vendorKey: "' . esc_js(get_option('cancelready_vendor_key')) . '",
                        userId: "' . esc_js(get_current_user_id()) . '", // WordPress user ID must match payment processor
                        buttonText: "Cancel subscription",
                        buttonColor: "#96588a", // WooCommerce purple
                        testMode: ' . (defined('WP_DEBUG') && WP_DEBUG ? 'true' : 'false') . '
                    });
                }
            });
        ');
    }
}
add_action('wp_enqueue_scripts', 'cancelready_enqueue_scripts');

// Add settings page
function cancelready_add_settings_page() {
    add_submenu_page(
        'woocommerce',
        'CancelReady Settings',
        'CancelReady',
        'manage_options',
        'cancelready-settings',
        'cancelready_settings_page'
    );
}
add_action('admin_menu', 'cancelready_add_settings_page');

// Settings page content
function cancelready_settings_page() {
    // Save settings
    if (isset($_POST['cancelready_vendor_key'])) {
        update_option('cancelready_vendor_key', sanitize_text_field($_POST['cancelready_vendor_key']));
        echo '<div class="notice notice-success"><p>Settings saved.</p></div>';
    }
    
    $vendor_key = get_option('cancelready_vendor_key', '');
    ?>
    <div class="wrap">
        <h1>CancelReady Settings</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row">Vendor Key</th>
                    <td>
                        <input type="text" name="cancelready_vendor_key" value="<?php echo esc_attr($vendor_key); ?>" class="regular-text">
                        <p class="description">Enter your CancelReady vendor key from your dashboard.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Add cancel button to My Subscriptions table
function cancelready_add_cancel_button($actions, $subscription) {
    // Only add the button if the subscription is active
    if ($subscription->get_status() === 'active') {
        echo '<div id="ck-target" data-subscription-id="' . esc_attr($subscription->get_id()) . '"></div>';
    }
    
    return $actions;
}
add_filter('woocommerce_my_account_my_subscriptions_actions', 'cancelready_add_cancel_button', 10, 2);
        </pre>
      </div>
      
      <h3>Step 2: Activate the Plugin</h3>
      <p>Go to your WordPress admin dashboard and activate the "CancelReady Integration" plugin.</p>
      
      <h3>Step 3: User ID Mapping (Critical)</h3>
      <div class="alert-block">
        <p><strong>Important:</strong> For successful cancellations, you must ensure that the WordPress user ID matches the identifier stored in your payment processor.</p>
      </div>
      
      <h4>For WooCommerce Subscriptions with Stripe:</h4>
      <div class="code-block">
        <pre>
// Add this to your functions.php or a custom plugin
add_filter('woocommerce_stripe_subscription_metadata', 'add_user_id_to_stripe_metadata', 10, 2);

function add_user_id_to_stripe_metadata($metadata, $order) {
    // Add WordPress user ID to Stripe metadata
    $user_id = $order->get_user_id();
    if ($user_id) {
        $metadata['userId'] = $user_id; // MUST match the userId used in CancelReady
    }
    return $metadata;
}
        </pre>
      </div>
      
      <h4>For WooCommerce Subscriptions with Paddle:</h4>
      <div class="code-block">
        <pre>
// Add this to your functions.php or a custom plugin
add_filter('woocommerce_paddle_subscription_params', 'add_user_id_to_paddle_passthrough', 10, 2);

function add_user_id_to_paddle_passthrough($params, $order) {
    // Add WordPress user ID to Paddle passthrough
    $user_id = $order->get_user_id();
    if ($user_id) {
        $passthrough = isset($params['passthrough']) ? json_decode($params['passthrough'], true) : [];
        $passthrough['userId'] = $user_id; // MUST match the userId used in CancelReady
        $params['passthrough'] = json_encode($passthrough);
    }
    return $params;
}
        </pre>
      </div>
      
      <h3>Step 4: Configure the Plugin</h3>
      <ol>
        <li>Navigate to WooCommerce > CancelReady in your WordPress admin menu</li>
        <li>Enter your CancelReady vendor key</li>
        <li>Click "Save Changes"</li>
      </ol>
      
      <h3>Step 4: Test the Integration</h3>
      <ol>
        <li>Log in to your WordPress site as a customer with an active subscription</li>
        <li>Go to My Account > Subscriptions</li>
        <li>Verify that the "Cancel subscription" button appears next to each active subscription</li>
        <li>Test the cancellation flow</li>
        <li>Check your CancelReady dashboard to confirm the test cancellation was recorded</li>
      </ol>
      
      <h3>Customization Options</h3>
      <p>You can customize the button appearance by modifying the CancelReady.init options in the plugin file:</p>
      <div class="code-block">
        <pre>
CancelReady.init({
    vendorKey: "' . esc_js(get_option('cancelready_vendor_key')) . '",
    userId: "' . esc_js(get_current_user_id()) . '",
    buttonText: "Cancel your subscription", // Customize button text
    buttonColor: "#96588a", // Customize button color
    modalTitle: "Cancel Your WooCommerce Subscription", // Custom modal title
    modalMessage: "Are you sure you want to cancel your subscription?", // Custom message
    testMode: ' . (defined('WP_DEBUG') && WP_DEBUG ? 'true' : 'false') . '
});
        </pre>
      </div>
    `
  }
];

export default function Tutorials() {
  const [activeTutorial, setActiveTutorial] = useState('react');

  // Find the current tutorial
  const currentTutorial = tutorials.find(tutorial => tutorial.id === activeTutorial);

  return (
    <Layout title="Tutorials - CancelReady Documentation">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <div className="flex items-center space-x-2 text-sm text-primary-100 mb-2">
              <Link href="/docs" className="hover:text-white">Documentation</Link>
              <ChevronRightIcon className="h-4 w-4" />
              <span>Tutorials</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Integration Tutorials</h1>
            <p className="text-primary-100 max-w-3xl">
              Step-by-step guides to help you integrate CancelReady with various platforms and frameworks.
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
                  Tutorials
                </h2>
                <nav className="space-y-1 mb-8">
                  {tutorials.map((tutorial) => (
                    <button
                      key={tutorial.id}
                      onClick={() => setActiveTutorial(tutorial.id)}
                      className={`flex items-center px-4 py-2 w-full text-left text-sm rounded-md ${
                        activeTutorial === tutorial.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      {tutorial.title}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 p-4 bg-secondary-50 rounded-md">
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">Need a custom integration?</h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    Our team can help with custom integrations for your specific platform or tech stack.
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
              {currentTutorial && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-secondary-900">{currentTutorial.title}</h2>
                    <div className="flex items-center mt-2 sm:mt-0 space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-secondary-100 text-secondary-800">
                        {currentTutorial.difficulty}
                      </span>
                      <span className="text-sm text-secondary-500">
                        {currentTutorial.timeEstimate}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-secondary-600 text-lg mb-8">
                    {currentTutorial.description}
                  </p>
                  
                  <div className="prose prose-primary max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: currentTutorial.content }} />
                  </div>
                  
                  <div className="mt-12 pt-6 border-t border-secondary-200">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Additional Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link 
                        href="/docs/api" 
                        className="flex items-center p-4 border border-secondary-200 rounded-md hover:bg-secondary-50"
                      >
                        <div>
                          <h4 className="text-secondary-900 font-medium">API Reference</h4>
                          <p className="text-secondary-500 text-sm">
                            Complete documentation of the CancelReady API
                          </p>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-secondary-400 ml-auto" />
                      </Link>
                      <Link 
                        href="/docs#faq" 
                        className="flex items-center p-4 border border-secondary-200 rounded-md hover:bg-secondary-50"
                      >
                        <div>
                          <h4 className="text-secondary-900 font-medium">FAQ</h4>
                          <p className="text-secondary-500 text-sm">
                            Answers to common questions about CancelReady
                          </p>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-secondary-400 ml-auto" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
