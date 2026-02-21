/**
 * Validates a Solana wallet address
 * Solana addresses are base58 encoded and typically 44 characters long
 */
export function isValidSolanaAddress(address: string): boolean {
  // Remove whitespace
  const trimmed = address.trim();

  // Check length (Solana addresses are typically 43-44 characters)
  if (trimmed.length < 32 || trimmed.length > 44) {
    return false;
  }

  // Check if it's valid base58 (no 0, O, I, l characters)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(trimmed);
}
