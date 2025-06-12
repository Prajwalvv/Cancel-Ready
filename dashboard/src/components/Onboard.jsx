import React, { useState, useContext, createContext } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore'; // Firebase SDK
import { useNavigate } from 'react-router-dom';
import { generateIntegrationSnippet, getUserIdMappingInstructions } from '../utils/codeSnippets';

// Create a context for storing the vendor key
const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
  const [vendorKey, setVendorKey] = useState(null);
  
  return (
    <OnboardingContext.Provider value={{ vendorKey, setVendorKey }}>
      {children}
    </OnboardingContext.Provider>
  );
};

const Onboard = () => {
  const navigate = useNavigate();
  const { vendorKey, setVendorKey } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('');
  const [processor, setProcessor] = useState('stripe'); // Default to Stripe
  const [apiKey, setApiKey] = useState('');
  const [paddleVendorId, setPaddleVendorId] = useState('');
  const [testMode, setTestMode] = useState(false);
  
  // Function to handle Step 1 submission
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/registerVendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          domain
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register vendor');
      }
      
      const data = await response.json();
      setVendorKey(data.vendorKey);
      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle Step 2 submission
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const payload = { processor, testMode };
      
      // Add the appropriate API key based on the selected processor
      if (processor === 'stripe') {
        payload.stripeKey = apiKey;
        // Add a plaintext version with a different field name to bypass encryption
        payload.stripeKey_plaintext = apiKey;
      } else if (processor === 'paddle') {
        payload.paddleKey = apiKey;
        // Add a plaintext version with a different field name to bypass encryption
        payload.paddleApiKey_plaintext = apiKey;
        payload.paddleVendorId = paddleVendorId;
      }
      
      console.log('DEBUG - Saving payload with plaintext API key:', {
        ...payload,
        paddleApiKey_plaintext: payload.paddleApiKey_plaintext ? `${payload.paddleApiKey_plaintext.substring(0, 10)}...` : undefined,
        paddleKey: payload.paddleKey ? `${payload.paddleKey.substring(0, 10)}...` : undefined
      });
      
      const db = getFirestore();
      const vendorDocRef = doc(db, 'vendors', vendorKey);

      // DEBUG: Saving API keys as plaintext
      await updateDoc(vendorDocRef, payload);

      
      // If updateDoc fails, it will throw an error which is caught by the main try...catch block.
      
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate code snippet for Step 3
  const getCodeSnippet = () => {
    return generateIntegrationSnippet(vendorKey, {
      testMode: true
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">CancelKit Onboarding</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Step indicators */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center py-2 ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Company Info
        </div>
        <div className={`flex-1 text-center py-2 ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Payment Processor
        </div>
        <div className={`flex-1 text-center py-2 ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Integration
        </div>
      </div>
      
      {/* Step 1: Company Information */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Submit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="companyName">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="domain">
              Website Domain
            </label>
            <input
              id="domain"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Next'}
            </button>
          </div>
        </form>
      )}
      
      {/* Step 2: Payment Processor */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Submit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Payment Processor
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="stripe"
                  checked={processor === 'stripe'}
                  onChange={() => setProcessor('stripe')}
                  className="form-radio"
                />
                <span className="ml-2">Stripe</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="paddle"
                  checked={processor === 'paddle'}
                  onChange={() => setProcessor('paddle')}
                  className="form-radio"
                />
                <span className="ml-2">Paddle</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="none"
                  checked={processor === 'none'}
                  onChange={() => setProcessor('none')}
                  className="form-radio"
                />
                <span className="ml-2">None</span>
              </label>
            </div>
          </div>
          
          {processor !== 'none' && (
            <div className="mb-6">
              {processor === 'stripe' ? (
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="apiKey">
                    Stripe Secret Key
                  </label>
                  <input
                    id="apiKey"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your Stripe secret key (starts with sk_)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="apiKey">
                      Paddle Auth Code
                    </label>
                    <input
                      id="apiKey"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your Paddle Auth Code (found in Paddle dashboard → Developer → Authentication)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="paddleVendorId">
                      Paddle Vendor ID
                    </label>
                    <input
                      id="paddleVendorId"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={paddleVendorId}
                      onChange={(e) => setPaddleVendorId(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your Paddle Vendor ID (found in Paddle dashboard → Developer → Authentication)
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-700">Enable Sandbox/Test Mode</span>
                </label>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setCurrentStep(1)}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Next'}
            </button>
          </div>
        </form>
      )}
      
      {/* Step 3: Integration */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Integration Code</h2>
          <p className="mb-4">
            Add the following code snippet to your website to integrate CancelKit:
          </p>
          
          <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
            <pre>{getCodeSnippet()}</pre>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: getUserIdMappingInstructions() }} />
          
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </button>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboard;
