import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <FaHome className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
