import React from 'react';

interface CharacterCountProps {
  current: number;
  max: number;
}

export function CharacterCount({ current, max }: CharacterCountProps) {
  return (
    <div className="text-right text-sm text-gray-500">
      {current}/{max} characters
    </div>
  );
}