import React from 'react';
import { Loader2 } from 'lucide-react';

interface DataInputProps {
  value: string;
  onChange: (value: string) => void;
  onProcess: () => void;
  processing: boolean;
}

const DataInput: React.FC<DataInputProps> = ({
  value,
  onChange,
  onProcess,
  processing,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const placeholder = `Run report in Apricot, open it in print view and expand all the fields. Copy everything and paste here..`;

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="data-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Input Data
        </label>
        <textarea
          id="data-input"
          rows={10}
          className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onProcess}
          disabled={!value.trim() || processing}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:bg-green-400"
        >
          {processing ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Processing...
            </>
          ) : (
            'Process Data'
          )}
        </button>
      </div>
    </div>
  );
};

export default DataInput;
