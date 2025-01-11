import React from 'react';
import { Twitter } from 'lucide-react';
import { BaseShareButton } from './BaseShareButton';
import { getTwitterShareUrl, SHARE_MESSAGE } from '../../utils/shareUrls';

export function TwitterShareButton() {
  const handleShare = () => {
    const url = getTwitterShareUrl(SHARE_MESSAGE, window.location.href);
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <BaseShareButton 
      onClick={handleShare}
      icon={<Twitter className="w-5 h-5" />}
      label="Share on Twitter"
    />
  );
}