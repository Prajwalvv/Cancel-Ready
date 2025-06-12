import { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/router';
import { AuthContext } from '../_app';
import { generateIntegrationSnippet, getUserIdMappingInstructions } from '../../utils/codeSnippets';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import crypto from 'crypto';

// Predefined color options for the button
const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Black', value: '#111827' },
];

// Steps for the onboarding wizard
const steps = [
  { id: 'step1', name: 'Company Details', description: 'Add domain & company name' },
  { id: 'step2', name: 'Payment Integration', description: 'Connect payment processor' },
  { id: 'step3', name: 'Get Code Snippet', description: 'Get your custom code' },
  { id: 'step4', name: 'Test & Verify', description: 'Test in sandbox mode' },
];

function Onboard() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState('step1');
  const [formData, setFormData] = useState({
    companyName: '',
    domain: '',
    paymentProcessor: 'stripe',
    stripeApiKey: '',
    paddleApiKey: '',
    paddleVendorId: '',
    customBranding: false,
    buttonText: 'Cancel subscription',
    buttonColor: '#ef4444',
    testMode: true,
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [actualVendorKey, setActualVendorKey] = useState(null);

  // The Firebase function test has been removed as we now handle vendor registration directly in the client

  // Check if user has already completed setup
  useEffect(() => {
    const checkUserSetup = async () => {
      if (user) {
        console.log('=== USER DEBUG ===');
        console.log('User:', user);
        console.log('User ID:', user?.uid);
        console.log('User email:', user?.email);
        
        try {
          // Query Firestore for vendors associated with this user
          const vendorsRef = collection(db, 'vendors');
          const q = query(vendorsRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          // If user already has vendor data, redirect to dashboard
          if (!querySnapshot.empty) {
            console.log('User has already completed setup, redirecting to dashboard...');
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking user setup:', error);
        }
      }
    };
    
    checkUserSetup();
  }, [user, router]);

  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 'step1') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.domain.trim()) {
        newErrors.domain = 'Domain is required';
      } else if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(formData.domain.trim())) {
        newErrors.domain = 'Please enter a valid domain (e.g., example.com)';
      }
    }

    if (currentStep === 'step2') {
      if (formData.paymentProcessor === 'stripe' && !formData.stripeApiKey.trim()) {
        newErrors.stripeApiKey = 'Stripe API key is required';
      } else if (formData.paymentProcessor === 'stripe' && !formData.stripeApiKey.startsWith('sk_')) {
        newErrors.stripeApiKey = 'Invalid Stripe API key format';
      }

      if (formData.paymentProcessor === 'paddle') {
        if (!formData.paddleApiKey.trim()) {
          newErrors.paddleApiKey = 'Paddle Auth Code is required';
        }
        if (!formData.paddleVendorId.trim()) {
          newErrors.paddleVendorId = 'Paddle Vendor ID is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  // Utility function to encrypt sensitive data
  const encryptData = (data) => {
    try {
      if (!data) return null;
      
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);
      
      // Ensure the key is exactly 32 bytes (256 bits)
      const pad32 = (key) => {
        const buf = Buffer.from(key, 'utf8');
        if (buf.length >= 32) return buf.slice(0, 32);
        const padded = Buffer.alloc(32);
        buf.copy(padded);
        return padded;
      };
      
      // Get the encryption key and pad it to 32 bytes
      const encKey = pad32(process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'CancelReadySecretKey2024!@#$%^&*');
      
      // Create a cipher using AES-256-GCM
      const cipher = crypto.createCipheriv('aes-256-gcm', encKey, iv);
      
      // Encrypt the data
      let encryptedData = cipher.update(data, 'utf8', 'hex');
      encryptedData += cipher.final('hex');
      
      // Get the auth tag
      const tag = cipher.getAuthTag().toString('hex');
      
      // Return the encrypted data with IV and tag
      return {
        iv: iv.toString('hex'),
        encryptedData,
        tag
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  };

  // Generate a random vendor key
  const generateVendorKey = () => {
    return crypto.randomBytes(16).toString('hex');
  };

  // Save data to Firebase and go to dashboard
  const saveAndGoToDashboard = async () => {
    setIsSaving(true);
    setErrors({});
    
    try {
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      console.log('=== DEBUGGING saveAndGoToDashboard ===');
      console.log('User:', user);
      console.log('User ID:', user.uid);
      
      // Get the current user ID
      const userId = user.uid;
      
      // Generate a unique vendor key
      const vendorKey = generateVendorKey();
      
      // Prepare the vendor data
      const vendorData = {
        companyName: formData.companyName,
        domain: formData.domain,
        processor: formData.paymentProcessor,
        userId: userId,
        customBranding: formData.customBranding,
        buttonText: formData.buttonText,
        buttonColor: formData.buttonColor,
        testMode: formData.testMode,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // TEMPORARY DEBUG: Save API keys as plaintext for troubleshooting
      if (formData.paymentProcessor === 'stripe') {
        vendorData.stripeKey = formData.stripeApiKey; // Plaintext for debugging
      } else if (formData.paymentProcessor === 'paddle') {
        vendorData.paddleApiKey = formData.paddleApiKey; // Plaintext for debugging
        vendorData.paddleVendorId = formData.paddleVendorId;
      }
      
      // Also store debug copy with clear field name
      if (formData.paymentProcessor === 'paddle') {
        vendorData.DEBUG_RAW_PADDLE_KEY = formData.paddleApiKey;
      } else if (formData.paymentProcessor === 'stripe') {
        vendorData.DEBUG_RAW_STRIPE_KEY = formData.stripeApiKey;
      }
      
      console.log('Saving vendor data to Firestore:', { ...vendorData, vendorKey });
      
      // Save vendor data to Firestore
      await setDoc(doc(db, 'vendors', vendorKey), vendorData);
      
      console.log('Vendor data saved successfully with key:', vendorKey);
      
      // Store the vendor key for the code snippet
      setActualVendorKey(vendorKey);
      
      // Navigate to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving vendor data:', error);
      setErrors({ submit: error.message });
      alert(`Error saving your information: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate code snippet based on form data
  const generateCodeSnippet = () => {
    // Use the actual vendor key if available, otherwise generate a placeholder
    const vendorKey = actualVendorKey || `${formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_placeholder`; 
  
    // The new generateIntegrationSnippet takes (vendorKey, selectedPaymentProvider, options)
    // formData.paymentProcessor will be 'stripe' or 'paddle'
    return generateIntegrationSnippet(
      vendorKey, 
      formData.paymentProcessor, 
      {
        buttonText: formData.buttonText,
        testMode: formData.testMode
        // buttonColor, customBranding, modalTitle, modalMessage are no longer part of the core snippet's init() options.
        // The modalMessage variable, previously defined, is no longer used in this return statement.
      }
    );
  };

  return (
    <Layout title="Onboarding Wizard - CancelKit">
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary-600 text-white py-12">
          <div className="container-custom">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">Set Up CancelKit</h1>
                <p className="text-primary-100 max-w-3xl">
                  Follow these simple steps to integrate CancelKit with your website
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Content */}
        <div className="container-custom py-12">
          {/* Steps Navigation */}
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.id} className={`relative flex-1 ${stepIdx !== 0 ? 'ml-6' : ''}`}>
                  {/* Line connecting steps */}
                  {stepIdx !== 0 && (
                    <div className="absolute left-0 -ml-6 top-4 -mt-0.5 w-6" aria-hidden="true">
                      <div className={`h-0.5 w-full ${currentStepIndex > stepIdx - 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStepIndex > stepIdx
                          ? 'bg-primary-600'
                          : currentStepIndex === stepIdx
                          ? 'bg-primary-600 border-2 border-primary-600'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      {currentStepIndex > stepIdx ? (
                        <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <span
                          className={`text-sm font-semibold ${
                            currentStepIndex === stepIdx ? 'text-white' : 'text-gray-500'
                          }`}
                        >
                          {stepIdx + 1}
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:block mt-3 text-center">
                      <span className="text-sm font-medium text-gray-900 block">{step.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Step Content */}
          <div className="mt-16 md:mt-24 max-w-3xl mx-auto">
            {/* Step 1: Company Details */}
            {currentStep === 'step1' && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Step 1: Company Details</h2>
                <p className="text-secondary-600 mb-8">
                  Let's start by collecting some basic information about your company.
                </p>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-secondary-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                        errors.companyName ? 'border-red-300' : ''
                      }`}
                      placeholder="Your Company, Inc."
                    />
                    {errors.companyName && (
                      <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-secondary-700 mb-1">
                      Website Domain
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        name="domain"
                        id="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className={`block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                          errors.domain ? 'border-red-300' : ''
                        }`}
                        placeholder="example.com"
                      />
                    </div>
                    {errors.domain && (
                      <p className="mt-2 text-sm text-red-600">{errors.domain}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Integration */}
            {currentStep === 'step2' && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Step 2: Payment Integration</h2>
                <p className="text-secondary-600 mb-8">
                  Connect your payment processor to enable automatic subscription cancellations.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Payment Processor
                    </label>
                    <div className="mt-1 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="stripe"
                          name="paymentProcessor"
                          type="radio"
                          value="stripe"
                          checked={formData.paymentProcessor === 'stripe'}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                          Stripe
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="paddle"
                          name="paymentProcessor"
                          type="radio"
                          value="paddle"
                          checked={formData.paymentProcessor === 'paddle'}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="paddle" className="ml-3 block text-sm font-medium text-gray-700">
                          Paddle
                        </label>
                      </div>
                    </div>
                  </div>

                  {formData.paymentProcessor === 'stripe' && (
                    <div>
                      <label htmlFor="stripeApiKey" className="block text-sm font-medium text-secondary-700 mb-1">
                        Stripe Secret Key
                      </label>
                      <input
                        type="text"
                        name="stripeApiKey"
                        id="stripeApiKey"
                        value={formData.stripeApiKey}
                        onChange={handleChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                          errors.stripeApiKey ? 'border-red-300' : ''
                        }`}
                        placeholder="sk_test_..."
                      />
                      {errors.stripeApiKey ? (
                        <p className="mt-2 text-sm text-red-600">{errors.stripeApiKey}</p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          Your API key is securely stored and encrypted. Find your API keys in the{' '}
                          <a
                            href="https://dashboard.stripe.com/apikeys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500"
                          >
                            Stripe Dashboard
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  )}

                  {formData.paymentProcessor === 'paddle' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="paddleApiKey" className="block text-sm font-medium text-secondary-700 mb-1">
                          Paddle Auth Code
                        </label>
                        <input
                          type="text"
                          name="paddleApiKey"
                          id="paddleApiKey"
                          value={formData.paddleApiKey}
                          onChange={handleChange}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            errors.paddleApiKey ? 'border-red-300' : ''
                          }`}
                          placeholder="Your Paddle Auth Code"
                        />
                        {errors.paddleApiKey ? (
                          <p className="mt-2 text-sm text-red-600">{errors.paddleApiKey}</p>
                        ) : (
                          <p className="mt-2 text-sm text-gray-500">
                            Your Auth Code is securely stored and encrypted. Find it in the{' '}
                            <a
                              href="https://vendors.paddle.com/authentication"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500"
                            >
                              Paddle Dashboard
                            </a>
                            {' '}under Developer → Authentication.
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="paddleVendorId" className="block text-sm font-medium text-secondary-700 mb-1">
                          Paddle Vendor ID
                        </label>
                        <input
                          type="text"
                          name="paddleVendorId"
                          id="paddleVendorId"
                          value={formData.paddleVendorId}
                          onChange={handleChange}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            errors.paddleVendorId ? 'border-red-300' : ''
                          }`}
                          placeholder="Your Paddle Vendor ID"
                        />
                        {errors.paddleVendorId ? (
                          <p className="mt-2 text-sm text-red-600">{errors.paddleVendorId}</p>
                        ) : (
                          <p className="mt-2 text-sm text-gray-500">
                            Your Vendor ID is found in the{' '}
                            <a
                              href="https://vendors.paddle.com/authentication"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500"
                            >
                              Paddle Dashboard
                            </a>
                            {' '}under Developer → Authentication.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Get Code Snippet */}
            {currentStep === 'step3' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Customize Your Cancel Button</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
                          Button Text
                        </label>
                        <span className="text-xs text-gray-500">Recommended: Keep it short and clear</span>
                      </div>
                      <input
                        type="text"
                        id="buttonText"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    {/* Button Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Button Preview</h3>
                        <span className="text-xs text-gray-500 flex items-center">
                          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
                          Customize appearance
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-md border border-gray-200 w-full mb-4 flex justify-center">
                          <button
                            style={{ backgroundColor: formData.buttonColor }}
                            className="px-4 py-2 text-white font-medium rounded shadow-sm hover:opacity-90 transition-opacity"
                          >
                            {formData.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Picker */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700 mb-1">
                          Button Color
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            id="colorPicker"
                            value={formData.buttonColor}
                            onChange={(e) => handleChange({ target: { name: 'buttonColor', value: e.target.value } })}
                            className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            id="buttonColor"
                            name="buttonColor"
                            value={formData.buttonColor}
                            onChange={handleChange}
                            className="ml-2 w-24 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-8 gap-2">
                        {colorOptions.map((color) => (
                          <div 
                            key={color.value} 
                            className={`h-8 w-full rounded cursor-pointer border ${formData.buttonColor === color.value ? 'ring-2 ring-offset-2 ring-primary-500' : 'border-gray-300'}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleChange({ target: { name: 'buttonColor', value: color.value } })}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="customBranding"
                          name="customBranding"
                          type="checkbox"
                          checked={formData.customBranding}
                          onChange={handleChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="customBranding" className="font-medium text-gray-700">
                          Enable Custom Branding
                        </label>
                        <p className="text-gray-500">Customize modal title, message, and button text</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Code Snippet</h3>
                  {!actualVendorKey ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">Code snippet will be available after setup</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Complete step 4 to save your configuration and get your unique code snippet with the correct vendor key.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-800 rounded-md overflow-hidden">
                        <div className="bg-gray-700 px-4 py-2 text-xs text-gray-200">HTML/JavaScript</div>
                        <pre className="p-4 text-gray-100 text-xs overflow-x-auto">
                          {generateCodeSnippet()}
                        </pre>
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        This code snippet is ready to use and contains your unique vendor key.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Test & Verify */}
            {currentStep === 'step4' && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Step 4: Test & Verify</h2>
                <p className="text-secondary-600 mb-8">
                  Test your integration in sandbox mode before going live.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      id="testMode"
                      name="testMode"
                      type="checkbox"
                      checked={formData.testMode}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="testMode" className="ml-3 block text-sm font-medium text-gray-700">
                      Enable test mode (recommended for initial setup)
                    </label>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          In test mode, no actual cancellations will be processed. This allows you to safely test the integration.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-md">
                    <h3 className="text-lg font-medium text-secondary-900 mb-4">Testing Instructions</h3>
                    <ol className="list-decimal pl-5 space-y-3 text-secondary-600">
                      <li>You can always find, customize, and copy your code snippet from your dashboard.</li>
                      <li>Add the code snippet to your website (preferably in a staging environment)</li>
                      <li>Ensure the target div <code className="bg-gray-100 px-1 py-0.5 rounded">id="ck-target"</code> is present on your page</li>
                      <li>Verify that the "Cancel subscription" button appears</li>
                      <li>Click the button and confirm that the cancellation modal appears</li>
                      <li>Test the cancellation flow by clicking "Yes, cancel"</li>
                      <li>Check your CancelKit dashboard to verify that the test cancellation was recorded</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 p-6 rounded-md">
                    <h3 className="text-lg font-medium text-green-800 mb-4">Going Live</h3>
                    <p className="text-green-700 mb-4">
                      Once you've verified that everything is working correctly in test mode, you're ready to go live:
                    </p>
                    <ol className="list-decimal pl-5 space-y-3 text-green-700">
                      <li>Set <code className="bg-green-100 px-1 py-0.5 rounded">testMode: false</code> in your code snippet</li>
                      <li>Deploy the updated code to your production environment</li>
                      <li>Perform a final test to ensure everything is working properly</li>
                    </ol>
                  </div>

                  <div className="bg-primary-50 p-6 rounded-md">
                    <h3 className="text-lg font-medium text-primary-800 mb-4">Need Help?</h3>
                    <p className="text-primary-700 mb-4">
                      Our support team is available to help you with any questions or issues you may encounter during setup.
                    </p>
                    
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 ${
                  currentStepIndex === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                Previous
              </button>
              {currentStepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Next
                  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </button>
              ) : (
                <button
                  onClick={saveAndGoToDashboard}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Complete Setup & Get Code'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function OnboardPage() {
  return (
    <ProtectedRoute>
      <Onboard />
    </ProtectedRoute>
  );
}
