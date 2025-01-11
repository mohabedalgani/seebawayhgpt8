export function getTwitterShareUrl(message: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
}

export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function getLinkedInShareUrl(message: string, url: string): string {
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=DeepSeek%20AI%20Experience&summary=${encodeURIComponent(message)}`;
}

export const SHARE_MESSAGE = '🤖 Experience the future of AI chat with DeepSeek! Join me in exploring this amazing AI-powered conversation platform. #DeepSeekAI #AI';