
import React, { useState, useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File) => void;
  accept: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelect, accept, required = false }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={handleClick}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition"
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <p className="pl-1">
              {fileName ? (
                <span className="font-medium text-blue-600">{fileName}</span>
              ) : (
                <>
                  <span className="font-semibold text-blue-600 hover:text-blue-500">Clique para anexar</span> ou arraste e solte
                </>
              )}
            </p>
          </div>
          <p className="text-xs text-gray-500">Apenas arquivos PDF (até 10MB)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
