import React from 'react';
import { Heart, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <div className="text-center text-gray-600 mt-8 flex items-center justify-center gap-2">
      <span>صنع بحب</span>
      <Heart className="w-5 h-5 text-red-400" />
      <a 
        href="https://twitter.com/mohabedalgani" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Twitter className="w-4 h-4" />
        @mohabedalgani
      </a>
      
      
    </div>
  );
}