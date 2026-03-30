export const getTimeRemaining = (expiresAt: string | Date | null): string => {
  if (!expiresAt) return '24h';
  const total = Date.parse(expiresAt.toString()) - Date.now();
  if (total <= 0) return 'Đã hết hạn';
  const hours = Math.floor(total / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h còn lại`;
  const minutes = Math.floor(total / (1000 * 60));
  return `${minutes}m còn lại`;
};
