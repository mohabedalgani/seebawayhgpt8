import React from 'react';
import { Home, Users } from 'lucide-react';

interface LogoProps {
  onReviewersClick?: () => void;
}

export function Logo({ onReviewersClick }: LogoProps) {
  const handleHomeClick = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="flex items-center gap-2 mr-auto">
      <div className="relative w-8 h-8">
        <img
          src="/seebawayh.png"
          alt="سيبويه"
          className="w-full h-full object-cover rounded-full"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-transparent rounded-full" />
      </div>
      <span className="text-xl font-semibold">
        سيبويه GPT
      </span>
      <div className="flex gap-2 mr-auto">
        <button
          onClick={handleHomeClick}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="العودة إلى الصفحة الرئيسية"
        >
          <Home className="w-6 h-6" />
        </button>
        <button
          onClick={onReviewersClick}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="صفحة المراجعين"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}