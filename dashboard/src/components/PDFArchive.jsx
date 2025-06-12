import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const PDFArchive = ({ vendorKey }) => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDFFiles = async () => {
      try {
        setLoading(true);
        
        // Get a reference to Firebase Storage
        const storage = getStorage();
        
        // Create a reference to the vendor's folder in the audit-reports directory
        const vendorFolderRef = ref(storage, `audit-reports/${vendorKey}`);
        
        // List all items in the folder
        const result = await listAll(vendorFolderRef);
        
        // Map the items to a format similar to what we had with Supabase
        const filesPromises = result.items.map(async (itemRef) => {
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            // We'll get the download URL when needed for download
          };
        });
        
        const files = await Promise.all(filesPromises);
        
        // Filter for PDF files only and sort by name in descending order
        const pdfFiles = files
          .filter(file => file.name.endsWith('.pdf'))
          .sort((a, b) => b.name.localeCompare(a.name));
        
        setPdfFiles(pdfFiles);
      } catch (err) {
        console.error('Error fetching PDF files:', err);
        setError('Failed to load PDF archive');
      } finally {
        setLoading(false);
      }
    };
    
    if (vendorKey) {
      fetchPDFFiles();
    }
  }, [vendorKey]);

  const getDownloadUrl = async (filePath) => {
    // Get a reference to Firebase Storage
    const storage = getStorage();
    
    // Create a reference to the specific file
    const fileRef = ref(storage, filePath);
    
    // Get the download URL
    return await getDownloadURL(fileRef);
  };

  const handleDownload = async (file) => {
    try {
      const downloadUrl = await getDownloadUrl(file.fullPath);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file');
    }
  };

  // Extract month and year from filename
  const getReportPeriod = (fileName) => {
    try {
      // Assuming filename format: yyyy-MM-dd-Month-yyyy-report.pdf
      const parts = fileName.split('-');
      if (parts.length >= 5) {
        return `${parts[3]} ${parts[4]}`.replace('-report.pdf', '');
      }
      return fileName;
    } catch (err) {
      return fileName;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  if (pdfFiles.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No monthly reports available yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold mb-4">Monthly PDF Reports</h3>
      <div className="space-y-2">
        {pdfFiles.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border border-gray-100"
          >
            <div className="flex items-center">
              <FaFilePdf className="text-red-500 mr-3" />
              <span>{getReportPeriod(file.name)}</span>
            </div>
            <button
              onClick={() => handleDownload(file)}
              className="text-blue-500 hover:text-blue-700"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFArchive;
