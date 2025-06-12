import { useState, useEffect } from 'react';
import { db, logOut } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import CancellationTable from './CancellationTable';
import ExportCSV from './ExportCSV';
import PDFArchive from './PDFArchive';
import { FaSignOutAlt, FaSpinner, FaExclamationTriangle, FaDatabase, FaFileAlt, FaChartBar } from 'react-icons/fa';

const Dashboard = ({ user }) => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorKey, setVendorKey] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user || !user.uid) {
          setError('No valid user');
          setLoading(false);
          return;
        }
        
        // Query Firestore for vendors where userId matches the current user's ID
        const vendorsRef = collection(db, 'vendors');
        const q = query(vendorsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('No vendor key associated with this account');
          setLoading(false);
          return;
        }
        
        // Get the first vendor document (there should only be one per user)
        const vendorDoc = querySnapshot.docs[0];
        const vendorKey = vendorDoc.id;
        
        setVendorKey(vendorKey);
        fetchCancellations(vendorKey);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    
    const fetchCancellations = async (vendorKey) => {
      try {
        setLoading(true);
        
        // Fetch cancellations from Firestore for the specific vendor key
        const cancelsRef = collection(db, 'cancels');
        const q = query(
          cancelsRef, 
          where('vendorkey', '==', vendorKey),
          orderBy('time', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const cancellationsData = [];
        
        querySnapshot.forEach((doc) => {
          cancellationsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setCancellations(cancellationsData);
      } catch (err) {
        console.error('Error fetching cancellations:', err);
        setError('Failed to load cancellation data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleSignOut = async () => {
    await logOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
              <FaDatabase className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CancelKit Dashboard</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <FaChartBar className="mr-3 text-blue-600" />
                    Dashboard Overview
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-2">Vendor:</span>
                      <span className="text-sm font-semibold bg-blue-100 text-blue-800 py-1 px-2 rounded-md">{vendorKey}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-2">Records:</span>
                      <span className="text-sm font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-md">{cancellations.length}</span>
                    </div>
                  </div>
                </div>
                <ExportCSV data={cancellations} vendorKey={vendorKey} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Cancellation Records
                    </h3>
                  </div>
                  <CancellationTable data={cancellations} />
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <PDFArchive vendorKey={vendorKey} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
