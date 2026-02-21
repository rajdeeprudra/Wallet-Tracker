'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidSolanaAddress } from '@/utils/validators';
import { ErrorMessage } from './error-message';

interface WalletInputProps {
  onSubmit: (address: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Wallet address input component
 * Validates Solana address format and submits for tracking
 */
export function WalletInput({ onSubmit, isLoading = false, error }: WalletInputProps) {
  const [address, setAddress] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    // Clear previous validation error
    setValidationError(null);

    // Validate address
    if (!address.trim()) {
      setValidationError('Please enter a wallet address');
      return;
    }

    if (!isValidSolanaAddress(address)) {
      setValidationError(
        'Invalid Solana address format. Please check and try again.',
      );
      return;
    }

    

    // Submit
    try {
      await onSubmit(address.trim());
    } catch (err) {
      // Error is handled in the parent component
    }
  }, [address, onSubmit]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) {
        handleSubmit();
      }
    },
    [handleSubmit, isLoading],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Wallet</CardTitle>
        <CardDescription>
          Enter a Solana wallet address to view balances and transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Enter Solana wallet address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !address.trim()}
            className="gap-2"
          >
            <Search className="size-4" />
            {isLoading ? 'Tracking...' : 'Track'}
          </Button>
        </div>

        {validationError && (
          <ErrorMessage message={validationError} />
        )}

        {error && (
          <ErrorMessage message={error} />
        )}
      </CardContent>
    </Card>
  );
}
