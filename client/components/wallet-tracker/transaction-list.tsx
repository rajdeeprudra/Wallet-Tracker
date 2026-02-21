'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/index';
import { formatTimestamp, formatNumber } from '@/lib/format';
import { maskSignature } from '@/lib/masks';
import { CopyButton } from './copy-button';

interface TransactionListProps {
  transactions: Transaction[];
}

/**
 * Transaction history list component
 * Displays recent transactions with status and fees
 */
export function TransactionList({ transactions }: TransactionListProps) {
  // Sort transactions by timestamp descending (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTransactions.map((tx) => (
              <div
                key={tx.signature}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  {/* Status Icon */}
                  {tx.status === 'success' ? (
                    <CheckCircle2 className="size-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="size-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  )}

                  {/* Transaction Details */}
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-medium">
                      {maskSignature(tx.signature)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(tx.timestamp)} • Fee:{' '}
                      {formatNumber(tx.fee)} SOL
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <CopyButton
                  text={tx.signature}
                  variant="ghost"
                  size="icon-sm"
                  label="Copy signature"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
