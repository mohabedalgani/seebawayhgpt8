import React from 'react';

interface AlertProps {
  message: string;
  onClose: () => void;
}

export function Alert({ message, onClose }: AlertProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p className="text-center text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          حسناً
        </button>
      </div>
    </div>
  );
}