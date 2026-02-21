'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Token } from '@/types/index';
import { formatNumber, formatUSD } from '@/lib/format';

interface TokenTableProps {
  tokens: Token[];
  balanceVisible: boolean;
}

/**
 * Token holdings table component
 * Displays list of tokens sorted by USD value
 */
export function TokenTable({ tokens, balanceVisible }: TokenTableProps) {
  // Sort tokens by USD value descending
  const sortedTokens = [...tokens].sort((a, b) => b.usdValue - a.usdValue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {tokens.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No tokens found in this wallet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">USD Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTokens.map((token) => (
                <TableRow key={token.symbol}>
                  <TableCell className="font-medium">{token.symbol}</TableCell>
                  <TableCell className="text-right text-sm">
                    {balanceVisible
                      ? formatNumber(token.balance)
                      : '••••'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {balanceVisible
                      ? formatUSD(token.usdValue)
                      : '••••'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
