export function getTimeAgo(date: string): string {
  const now = new Date();
  const created = new Date(date);
  const diff = now.getTime() - created.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years > 0) {
    return `Hace ${years} año${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    return `Hace ${months} mese${months > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }
  return `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`;
}
