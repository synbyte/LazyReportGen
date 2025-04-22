import React, { useState } from 'react';
import { Download as FileDownload, FileText, Loader2 } from 'lucide-react';
import DataInput from './components/DataInput';
import DataPreview from './components/DataPreview';
import Header from './components/Header';
import { parseInputData } from './utils/dataParser';
import { generateExcel } from './utils/excelGenerator';
import { generateWord } from './utils/wordGenerator';
import Footer from './components/Footer';

function App() {
  const [inputData, setInputData] = useState<string>('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setInputData(value);
    setParsedData(null);
    setError(null);
  };

  const handleProcess = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      // Parse the input data
      const data = parseInputData(inputData);
      setParsedData(data);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      setError('Error processing data. Please check your input format.');
      console.error(err);
    }
  };

  const handleGenerateExcel = async () => {
    if (!parsedData) return;
    
    try {
      setLoading(true);
      await generateExcel(parsedData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error generating Excel file. Please try again.');
      console.error(err);
    }
  };

  const handleGenerateWord = async () => {
    if (!parsedData) return;
    
    try {
      setLoading(true);
      await generateWord(parsedData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error generating Word file. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Data to Excel Converter</h2>
            
            <DataInput 
              value={inputData} 
              onChange={handleInputChange} 
              onProcess={handleProcess}
              processing={processing}
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
            
            {parsedData && (
              <div className="mt-8 animate-fadeIn">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Preview</h3>
                  <DataPreview data={parsedData} />
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleGenerateWord}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:bg-purple-400"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          Download Word
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleGenerateExcel}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-blue-400"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileDownload className="mr-2 h-5 w-5" />
                          Download Excel
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;