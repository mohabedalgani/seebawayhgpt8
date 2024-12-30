import React from 'react';
import { Home } from 'lucide-react';
import sibawayh from '../assets/sibawayh.png';

export function Logo() {
  const handleHomeClick = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="flex items-center gap-2 mr-auto">
      <div className="relative w-8 h-8">
        <img
          src={sibawayh}
          alt="سيبويه"
          className="w-full h-full object-cover rounded-full"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-transparent rounded-full" />
      </div>
      <span className="text-xl font-semibold">
        سيبويه GPT
      </span>
      <button
        onClick={handleHomeClick}
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors mr-auto"
        aria-label="العودة إلى الصفحة الرئيسية"
      >
        <Home className="w-6 h-6" />
      </button>
    </div>
  );
}