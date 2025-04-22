import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Lazy Report Generator
          </p>
          <div className="flex space-x-4"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
