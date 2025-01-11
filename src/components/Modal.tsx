import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}