import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { APP_CONFIG } from '../config/constants';

interface ShareButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}

const ShareButton = ({ icon, onClick, label }: ShareButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex-row-reverse"
    aria-label={label}
  >
    {icon}
    <span className="text-sm hidden sm:block">{label}</span>
  </button>
);

export function ShareButtons() {
  const shareUrl = window.location.href;

  const shareHandlers = {
    twitter: () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(APP_CONFIG.SHARE_MESSAGE)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    },
    facebook: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    },
    linkedin: () => {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`${APP_CONFIG.BOT_NAME} AI Chat`)}&summary=${encodeURIComponent(APP_CONFIG.SHARE_MESSAGE)}`, '_blank');
    }
  };

  return (
    <div className="flex gap-2 flex-row-reverse">
      <ShareButton
        icon={<Twitter className="w-5 h-5" />}
        onClick={shareHandlers.twitter}
        label="مشاركة على تويتر"
      />
      <ShareButton
        icon={<Facebook className="w-5 h-5" />}
        onClick={shareHandlers.facebook}
        label="مشاركة على فيسبوك"
      />
      <ShareButton
        icon={<Linkedin className="w-5 h-5" />}
        onClick={shareHandlers.linkedin}
        label="مشاركة على لينكد إن"
      />
    </div>
  );
}