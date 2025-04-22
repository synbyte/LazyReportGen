import React from 'react';

interface DataPreviewProps {
  data: {
    clients: Array<{
      name: string;
      rowCount: number;
      services: Array<{
        date: string;
        category: string;
        service: string;
        description: string;
      }>;
    }>;
  };
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.clients.map((client, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-medium text-lg text-gray-800">{client.name}</h4>
            <p className="text-sm text-gray-600">Row Count: {client.rowCount}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {client.services.map((service, sIndex) => (
                  <tr key={sIndex} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{service.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{service.category}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{service.service}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{service.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataPreview;