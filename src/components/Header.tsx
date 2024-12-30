import React from 'react';

export function Header() {
  return (
    <div className="text-center text-gray-900 my-6">
      <blockquote className="relative">
        <p className="text-sm font-serif italic text-gray-600 mb-2">
          "لأطلبنّ علما لا يُنازعني فيه أحد."
        </p>
        <footer className="text-xs text-gray-500">
          — سيبويه
        </footer>
      </blockquote>
    </div>
  );
}