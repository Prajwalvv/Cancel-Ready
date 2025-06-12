import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const CancellationTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'time',
    direction: 'desc'
  });

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the data based on the current sort configuration
  const sortedData = useMemo(() => {
    if (!data) return [];
    
    const sortableData = [...data];
    
    sortableData.sort((a, b) => {
      if (sortConfig.key === 'time') {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    
    return sortableData;
  }, [data, sortConfig]);

  // Get sort icon based on current sort state
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="inline ml-1 text-blue-500" />
      : <FaSortDown className="inline ml-1 text-blue-500" />;
  };

  // Format the result JSON for display
  const formatResult = (result) => {
    try {
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      return (
        <div className="max-w-xs overflow-hidden text-xs">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(parsedResult, null, 2)}
          </pre>
        </div>
      );
    } catch (error) {
      return <span className="text-gray-500">Invalid JSON</span>;
    }
  };

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No cancellation data found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th 
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort('userId')}
            >
              User ID {getSortIcon('userId')}
            </th>
            <th 
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort('time')}
            >
              Date {getSortIcon('time')}
            </th>
            <th 
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort('ip')}
            >
              IP Address {getSortIcon('ip')}
            </th>
            <th className="px-4 py-2 text-left">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 border-t border-gray-200">
                {item.userId || 'N/A'}
              </td>
              <td className="px-4 py-2 border-t border-gray-200">
                {item.time ? format(new Date(item.time), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
              </td>
              <td className="px-4 py-2 border-t border-gray-200">
                {item.ip || 'N/A'}
              </td>
              <td className="px-4 py-2 border-t border-gray-200">
                {formatResult(item.result)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancellationTable;
