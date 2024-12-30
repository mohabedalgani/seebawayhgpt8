import React from 'react';
import { Facebook } from 'lucide-react';
import { BaseShareButton } from './BaseShareButton';
import { getFacebookShareUrl } from '../../utils/shareUrls';

export function FacebookShareButton() {
  const handleShare = () => {
    const url = getFacebookShareUrl(window.location.href);
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <BaseShareButton 
      onClick={handleShare}
      icon={<Facebook className="w-5 h-5" />}
      label="Share on Facebook"
    />
  );
}