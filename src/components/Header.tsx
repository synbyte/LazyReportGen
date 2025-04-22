import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex items-center">
          <FileSpreadsheet className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Lazy Report Generator</h1>
        </div>
        <p className="mt-1 text-blue-100">
          Copy and paste Apricot data to generate court report.
        </p>
      </div>
    </header>
  );
};

export default Header;
