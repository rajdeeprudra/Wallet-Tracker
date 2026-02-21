/**
 * Format a number with intelligent decimal places
 * Shows 2-4 decimal places depending on magnitude
 */
export function formatNumber(num: number): string {
  if (num === 0) return '0';

  const absNum = Math.abs(num);

  // Very small numbers - show more decimals
  if (absNum < 0.01) {
    return num.toFixed(6);
  }

  // Small numbers - show 4 decimals
  if (absNum < 1) {
    return num.toFixed(4);
  }

  // Regular numbers - show 2 decimals
  return num.toFixed(2);
}

/**
 * Format a number as USD currency
 */
export function formatUSD(num: number): string {
  if (num === 0) return '$0.00';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  // Very small numbers
  if (absNum < 0.01) {
    return `${sign}$${absNum.toFixed(6)}`;
  }

  // Format with commas for thousands
  return `${sign}$${absNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Format a Unix timestamp as relative time (e.g., "2 min ago")
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  }

  if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  // Fallback to full date
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format bytes as human readable file size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
