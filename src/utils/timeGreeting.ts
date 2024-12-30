export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'صباحاً';
  } else {
    return 'مساءً';
  }
}