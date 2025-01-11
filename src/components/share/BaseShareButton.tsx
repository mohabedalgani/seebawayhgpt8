import React from 'react';

interface BaseShareButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function BaseShareButton({ onClick, icon, label }: BaseShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}