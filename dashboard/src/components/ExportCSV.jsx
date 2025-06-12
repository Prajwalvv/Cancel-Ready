import { useState } from 'react';
import { format } from 'date-fns';
import Papa from 'papaparse';
import { FaFileDownload } from 'react-icons/fa';

const ExportCSV = ({ data, vendorKey }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    setIsExporting(true);

    try {
      // Format the data for CSV export
      const csvData = data.map(item => ({
        userId: item.userId || '',
        timestamp: item.time ? format(new Date(item.time), 'yyyy-MM-dd HH:mm:ss') : '',
        ip: item.ip || '',
        result: typeof item.result === 'string' ? item.result : JSON.stringify(item.result)
      }));

      // Convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set up download attributes
      const date = format(new Date(), 'yyyy-MM-dd');
      link.setAttribute('href', url);
      link.setAttribute('download', `cancelkit-${vendorKey}-${date}.csv`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !data || data.length === 0}
      className={`flex items-center px-4 py-2 rounded-md text-white ${
        isExporting || !data || data.length === 0
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      <FaFileDownload className="mr-2" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};

export default ExportCSV;
