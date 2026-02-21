/**
 * Mask a Solana address by showing first 4 and last 4 characters
 * Example: "9B5X...AbCd"
 */
export function maskAddress(address: string): string {
  if (!address || address.length < 8) {
    return address;
  }

  const first = address.substring(0, 4);
  const last = address.substring(address.length - 4);

  return `${first}...${last}`;
}

/**
 * Mask a transaction signature by showing first 6 and last 6 characters
 * Example: "abc123...xyz789"
 */
export function maskSignature(signature: string): string {
  if (!signature || signature.length < 12) {
    return signature;
  }

  const first = signature.substring(0, 6);
  const last = signature.substring(signature.length - 6);

  return `${first}...${last}`;
}

/**
 * Get a deterministic color based on a string (e.g., for transaction status or token icons)
 */
export function getColorFromString(str: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
}
