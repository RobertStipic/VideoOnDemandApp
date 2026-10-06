export function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const hour = Math.floor(totalSec / 3600);
  const minute = Math.floor((totalSec % 3600) / 60);
  const second = totalSec % 60;

  if (hour > 0) return `${hour}h ${minute}m ${second}s`;
  if (minute > 0) return `${minute}m ${second}s`;
  return `${second}s`;
}
