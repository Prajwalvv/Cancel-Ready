import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../_app';
import { logOut, db } from '../../lib/firebase';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import { FaSignOutAlt, FaSpinner, FaUser, FaBuilding, FaGlobe, FaCreditCard, FaPalette, FaExclamationTriangle } from 'react-icons/fa';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Settings() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showOnboardingWarning, setShowOnboardingWarning] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    domain: '',
    paymentProcessor: '',
    vendorKey: '',
    stripeKey: null,
    paddleApiKey: null,
    paddleVendorId: '',
    createdAt: null
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!user) {
        console.log('No user available, skipping data fetch');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching company info for user:', user.uid);
        
        // Query Firestore for vendors associated with this user
        const vendorsRef = collection(db, 'vendors');
        const q = query(vendorsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.warn('No vendor data found for user');
          setLoading(false);
          return;
        }
        
        // Get the first vendor document
        const vendorDoc = querySnapshot.docs[0];
        const vendorKey = vendorDoc.id;
        const vendorData = vendorDoc.data();
        
        console.log('Found vendor data from Firestore:', vendorData);
        console.log('Vendor key (document ID):', vendorKey);
        
        // Set company info from Firestore data
        setCompanyInfo({
          companyName: vendorData.companyName || '',
          domain: vendorData.domain || '',
          paymentProcessor: vendorData.processor || '',
          vendorKey: vendorKey,
          stripeKey: vendorData.stripeKey || null,
          paddleApiKey: vendorData.paddleApiKey || null,
          paddleVendorId: vendorData.paddleVendorId || '',
          createdAt: vendorData.createdAt ? new Date(vendorData.createdAt.seconds * 1000) : null
        });
      } catch (error) {
        console.error('Error fetching company info from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [user]);

  const handleSignOut = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaUser className="mr-3 text-blue-600" />
                  Account Settings
                </h1>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <FaSpinner className="animate-spin text-blue-500 text-3xl" />
              </div>
            ) : (
              <div className="px-6 py-5 divide-y divide-gray-200">
                <div className="py-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                        <FaBuilding className="mr-2 text-blue-500" />
                        Company Name
                      </div>
                      <p className="text-gray-900 font-medium text-lg">{companyInfo.companyName || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                        <FaGlobe className="mr-2 text-blue-500" />
                        Domain
                      </div>
                      <p className="text-gray-900 font-medium text-lg">{companyInfo.domain || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                        <FaCreditCard className="mr-2 text-blue-500" />
                        Payment Processor
                      </div>
                      <p className="text-gray-900 font-medium text-lg">{companyInfo.paymentProcessor || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                        <FaUser className="mr-2 text-blue-500" />
                        Vendor Key
                      </div>
                      <p className="text-gray-900 font-medium text-lg break-all">{companyInfo.vendorKey || 'Not set'}</p>
                    </div>
                    
                    {companyInfo.paymentProcessor === 'paddle' && companyInfo.paddleVendorId && (
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                          <FaCreditCard className="mr-2 text-blue-500" />
                          Paddle Vendor ID
                        </div>
                        <p className="text-gray-900 font-medium text-lg">{companyInfo.paddleVendorId}</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                        <FaUser className="mr-2 text-blue-500" />
                        API Keys
                      </div>
                      <p className="text-gray-900 font-medium">
                        {companyInfo.stripeKey || companyInfo.paddleApiKey ? 
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Configured</span> : 
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Not Configured</span>
                        }
                      </p>
                    </div>
                    
                    {companyInfo.createdAt && (
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                          <FaUser className="mr-2 text-blue-500" />
                          Created At
                        </div>
                        <p className="text-gray-900 font-medium">
                          {companyInfo.createdAt.toLocaleDateString()} {companyInfo.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="py-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Account Actions</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowOnboardingWarning(true)}
                      className="flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 hover:shadow"
                    >
                      <FaBuilding className="mr-2 text-blue-500" />
                      Update Company Information
                    </button>
                    
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 hover:shadow"
                    >
                      <FaUser className="mr-2" />
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Warning Modal for Onboarding */}
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
                            Warning: Changing Company Information
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Changing your company information will create a new vendor ID and delete your current configuration data. This action cannot be undone. Are you sure you want to continue?
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
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  );
}
