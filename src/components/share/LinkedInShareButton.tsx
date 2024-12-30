import React from 'react';
import { Linkedin } from 'lucide-react';
import { BaseShareButton } from './BaseShareButton';
import { getLinkedInShareUrl, SHARE_MESSAGE } from '../../utils/shareUrls';

export function LinkedInShareButton() {
  const handleShare = () => {
    const url = getLinkedInShareUrl(SHARE_MESSAGE, window.location.href);
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <BaseShareButton 
      onClick={handleShare}
      icon={<Linkedin className="w-5 h-5" />}
      label="Share on LinkedIn"
    />
  );
}