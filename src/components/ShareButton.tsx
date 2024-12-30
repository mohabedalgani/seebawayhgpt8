import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

interface ShareButtonProps {
  platform: 'twitter' | 'facebook' | 'linkedin';
  conversation?: string; // Made optional since we won't use it
}

export function ShareButton({ platform }: ShareButtonProps) {
  const getShareUrl = () => {
    const message = encodeURIComponent('🤖 Check out this amazing AI chat experience powered by DeepSeek! Try it yourself and discover the power of AI. #DeepSeekAI #AI');
    const url = encodeURIComponent(window.location.href);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=DeepSeek%20AI%20Experience&summary=${message}`;
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getShareUrl(), '_blank', 'width=600,height=400');
  };

  const getIcon = () => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
    }
  };

  const getLabel = () => {
    return `Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
    >
      {getIcon()}
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
}