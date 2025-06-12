import { useState, useEffect, useContext } from 'react';
import { logOut, db } from '../../lib/firebase';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { AuthContext } from '../_app';
import { useRouter } from 'next/router';
import { generateIntegrationSnippet, getUserIdMappingInstructions } from '../../utils/codeSnippets';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';

// Import dashboard components
import CodeSnippetModal from '../../components/dashboard/CodeSnippetModal';
import CancellationList from '../../components/dashboard/CancellationList';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

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

// Dashboard content component
function DashboardContent({ user }) {
  // State management
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorKey, setVendorKey] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [showOnboardingWarning, setShowOnboardingWarning] = useState(false);
  const [buttonSettings, setButtonSettings] = useState({
    buttonText: 'Cancel subscription',
    buttonColor: '#ef4444',
    testMode: true,
    customBranding: false
  });
  const router = useRouter();
  const [selectedProviderForSnippet, setSelectedProviderForSnippet] = useState('stripe');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) {
          setError('No valid user');
          setLoading(false);
          return;
        }
        
        console.log('Fetching vendor data for user:', user.uid);
        
        // Query Firestore for vendors associated with this user
        const vendorsRef = collection(db, 'vendors');
        const q = query(vendorsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.warn('No vendor data found for user');
          console.log('Redirecting to onboarding page...');
          // Redirect to onboarding page if no vendor data is found
          router.push('/onboard');
          return;
        }
        
        // Get the first vendor document
        const vendorDoc = querySnapshot.docs[0];
        const vendorKey = vendorDoc.id;
        const vendorData = vendorDoc.data();
        
        console.log('Found vendor data from Firestore:', vendorData);
        console.log('Vendor key (document ID):', vendorKey);
        
        // Set the vendor key
        setVendorKey(vendorKey);
        
        // Set the company data from Firestore
        setCompanyData({
          ...vendorData,
          vendorKey: vendorKey
        });
        
        // Fetch cancellations using the vendor key
        fetchCancellations(vendorKey);
        
        // Set button settings from Firestore data
        setButtonSettings({
          buttonText: vendorData.buttonText || 'Cancel subscription',
          buttonColor: vendorData.buttonColor || '#ef4444',
          testMode: vendorData.testMode !== false, // Default to true if not specified
          customBranding: vendorData.customBranding || false
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vendor data from Firestore:', err);
        setError('Failed to load vendor data');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, router]);

  const fetchCancellations = async (vendorKey) => {
    try {
      setLoading(true);
      
      console.log('Fetching cancellations for vendor key:', vendorKey);
      
      // Query Firestore for cancellations associated with this vendor key
      // Using 'cancels' collection as per Firestore security rules
      const cancelsRef = collection(db, 'cancels');
      // Simplified query that doesn't require a composite index
      const q = query(
        cancelsRef, 
        where('vendorkey', '==', vendorKey) // Note: field might be 'vendorkey' (lowercase) based on rules
        // Removed orderBy to avoid needing a composite index
      );
      const querySnapshot = await getDocs(q);
      
      const cancellationData = [];
      querySnapshot.forEach((doc) => {
        cancellationData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Fetched cancellation data:', cancellationData);
      
      setCancellations(cancellationData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cancellations from Firestore:', err);
      setError('Failed to load cancellation data');
      setLoading(false);
    }
  };

  // This function is no longer needed as we get all data from Firestore
  // Keeping it as a stub for backward compatibility
  const fetchCompanyData = async (vendorKey) => {
    console.log('Using vendor data from Firestore instead of API');
    return null;
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const generateCodeSnippet = () => {
    // Pass parameters correctly according to the function signature
    // generateIntegrationSnippet(vendorKey, selectedPaymentProvider, options)
    return generateIntegrationSnippet(
      vendorKey,
      selectedProviderForSnippet,
      {
        buttonText: buttonSettings.buttonText,
        buttonColor: buttonSettings.buttonColor,
        testMode: buttonSettings.testMode,
        customBranding: buttonSettings.customBranding
      }
    );
  };

  const handleViewCodeSnippet = () => {
    setShowCodeSnippet(true);
  };

  const handleCloseCodeSnippet = () => {
    setShowCodeSnippet(false);
  };

  const handleCopyCodeSnippet = () => {
    const snippet = generateCodeSnippet();
    navigator.clipboard.writeText(snippet).then(
      () => {
        alert('Code snippet copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy code snippet. Please try manually selecting and copying the code.');
      }
    );
  };

  const handleButtonSettingChange = (name, value) => {
    setButtonSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const vendorRef = doc(db, 'vendors', vendorKey);
      
      await updateDoc(vendorRef, {
        buttonText: buttonSettings.buttonText,
        buttonColor: buttonSettings.buttonColor,
        testMode: buttonSettings.testMode,
        customBranding: buttonSettings.customBranding
      });
      
      alert('Settings saved successfully!');
      
      // Update the company data in state
      setCompanyData(prevData => ({
        ...prevData,
        buttonText: buttonSettings.buttonText,
        buttonColor: buttonSettings.buttonColor,
        testMode: buttonSettings.testMode,
        customBranding: buttonSettings.customBranding
      }));
    } catch (err) {
      console.error('Error saving button settings:', err);
      alert('Failed to save settings. Please try again.');
    }
  };

  // Function to handle exporting data
  const handleExportData = () => {
    // This would be implemented to export cancellation data
    alert('Export CSV functionality will be implemented');
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {loading ? (
          <div className="flex justify-center items-center p-16">
            <div className="text-center">
              <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading dashboard data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">Error Loading Data</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Header */}
            <DashboardHeader 
              companyData={companyData}
              vendorKey={vendorKey}
              handleViewCodeSnippet={() => setShowCodeSnippet(true)}
              handleExportData={handleExportData}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Cancellation Records
                    </h3>
                  </div>
                  <div className="p-6">
                    {/* Use the CancellationList component */}
                    <CancellationList 
                      cancellations={cancellations}
                      loading={loading}
                      error={error}
                    />
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Actions
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <button
                      type="button"
                      onClick={() => setShowCodeSnippet(true)}
                      className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Get Code Snippet
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (companyData) {
                          setShowOnboardingWarning(true);
                        } else {
                          router.push('/onboard');
                        }
                      }}
                      className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Edit Onboarding Info
                    </button>
                    

                  </div>
                </div>
              </div>
            </div>
            
            {/* Code Snippet Modal */}
            {showCodeSnippet && (
              <CodeSnippetModal
                showCodeSnippet={showCodeSnippet}
                handleCloseCodeSnippet={() => setShowCodeSnippet(false)}
                handleCopyCodeSnippet={handleCopyCodeSnippet}
                generateCodeSnippet={generateCodeSnippet}
                selectedProviderForSnippet={selectedProviderForSnippet}
                setSelectedProviderForSnippet={setSelectedProviderForSnippet}
                buttonSettings={buttonSettings}
                handleButtonSettingChange={handleButtonSettingChange}
                handleSaveSettings={handleSaveSettings}
                colorOptions={colorOptions}
              />
            )}
            
            {/* Warning Popup for Onboarding Settings */}
            {showOnboardingWarning && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            Warning: Changing Onboarding Settings
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Changing your onboarding settings will create a new vendor ID and delete your current configuration data. This action cannot be undone. Are you sure you want to continue?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOnboardingWarning(false);
                          router.push('/onboard');
                        }}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Yes, Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOnboardingWarning(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Main Dashboard component with authentication check
function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    router.push('/login?redirect=/dashboard');
    return null;
  }

  return (
    <Layout>
      <DashboardContent user={user} />
    </Layout>
  );
}

// Protected page component
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
