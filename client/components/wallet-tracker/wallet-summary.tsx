'use client';

import { Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatUSD } from '@/lib/format';
import { maskAddress } from '@/lib/masks';
import { CopyButton } from './copy-button';

interface WalletSummaryProps {
  address: string;
  nativeBalance: number;
  totalUsdValue: number;
  tokenCount: number;
  wsConnected: boolean;
  balanceVisible: boolean;
  onToggleBalance: () => void;
}

/**
 * Wallet summary component
 * Displays address, SOL balance, USD value, and live status
 */
export function WalletSummary({
  address,
  nativeBalance,
  totalUsdValue,
  tokenCount,
  wsConnected,
  balanceVisible,
  onToggleBalance,
}: WalletSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Wallet Details
              {wsConnected && (
                <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <Zap className="size-3" />
                  Live
                </span>
              )}
            </CardTitle>
          </div>
          <CopyButton
            text={address}
            variant="outline"
            size="sm"
            label="Copy full address"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="grid gap-1">
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="font-mono text-sm font-medium">{maskAddress(address)}</p>
        </div>

        {/* Balances */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* SOL Balance */}
          <div className="grid gap-1 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">SOL Balance</p>
            <p className="text-lg font-semibold">
              {balanceVisible ? formatNumber(nativeBalance) : '••••'} SOL
            </p>
          </div>

          {/* USD Value */}
          <div className="grid gap-1 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-lg font-semibold">
              {balanceVisible ? formatUSD(totalUsdValue) : '••••'}
            </p>
          </div>
        </div>

        {/* Token Count */}
        <div className="grid gap-1 rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Tokens Held</p>
          <p className="text-lg font-semibold">{tokenCount}</p>
        </div>

        {/* Toggle Balance Visibility */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleBalance}
          className="w-full gap-2"
        >
          {balanceVisible ? (
            <>
              <Eye className="size-4" />
              Hide Balance
            </>
          ) : (
            <>
              <EyeOff className="size-4" />
              Show Balance
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
