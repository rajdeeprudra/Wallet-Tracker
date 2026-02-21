'use client';

import { useEffect } from 'react';
import { WalletInput } from '@/components/wallet-tracker/wallet-input';
import { WalletSummary } from '@/components/wallet-tracker/wallet-summary';
import { TokenTable } from '@/components/wallet-tracker/token-table';
import { TransactionList } from '@/components/wallet-tracker/transaction-list';
import { LiveFeed } from '@/components/wallet-tracker/live-feed';
import { Footer } from '@/components/footer';
import { useWalletTracker } from '@/hooks/use-wallet-tracker';

export default function Home() {
  const { state, setWalletAddress, toggleBalanceVisibility, retry } =
    useWalletTracker();

  // Subscribe to WebSocket when wallet is tracked
  useEffect(() => {
    if (state.walletAddress && !state.error) {
      // WebSocket connection is handled by the hook
    }
  }, [state.walletAddress, state.error]);

  const walletTracked = state.walletAddress && !state.isLoading && !state.error;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              {/* Solana Logo */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 101 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-100"
              >
                <path
                  d="M100.184 17.894C99.5847 17.0558 98.5235 16.6457 97.5341 16.8651L8.92054 36.2288C7.38095 36.5675 6.51617 38.0619 7.08071 39.4557L25.1787 85.2141C25.7433 86.6078 27.2829 87.4461 28.8225 87.0733L117.436 67.7095C118.976 67.3708 119.84 65.8764 119.275 64.4827L101.177 18.7242C100.612 17.3305 99.0728 16.4922 97.5332 16.8651L100.184 17.894ZM8.92054 36.2288L28.1893 51.1281L27.2829 53.0631L8.92054 36.2288ZM25.1787 85.2141L8.92054 36.2288L25.1787 85.2141Z"
                  fill="currentColor"
                />
                <path
                  d="M100.184 17.894C99.5847 17.0558 98.5235 16.6457 97.5341 16.8651L8.92054 36.2288C7.38095 36.5675 6.51617 38.0619 7.08071 39.4557L25.1787 85.2141C25.7433 86.6078 27.2829 87.4461 28.8225 87.0733L117.436 67.7095C118.976 67.3708 119.84 65.8764 119.275 64.4827L101.177 18.7242C100.612 17.3305 99.0728 16.4922 97.5332 16.8651L100.184 17.894ZM8.92054 36.2288L28.1893 51.1281L27.2829 53.0631L8.92054 36.2288Z"
                  fill="currentColor"
                  opacity="0.8"
                />
              </svg>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Solana Wallet Tracker
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Real-time wallet balances and transaction monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="space-y-6">
          {/* Wallet Input Section */}
          <WalletInput
            onSubmit={setWalletAddress}
            isLoading={state.isLoading}
            error={state.error}
          />

          {/* Wallet Data Sections - Show when wallet is tracked */}
          {walletTracked && (
            <>
              {/* Summary Section */}
              <WalletSummary
                address={state.walletAddress}
                nativeBalance={state.nativeBalance}
                totalUsdValue={state.totalUsdValue}
                tokenCount={state.tokens.length}
                wsConnected={state.wsConnected}
                balanceVisible={state.balanceVisible}
                onToggleBalance={toggleBalanceVisibility}
              />

              {/* Token and Transaction Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                <TokenTable
                  tokens={state.tokens}
                  balanceVisible={state.balanceVisible}
                />
                <TransactionList transactions={state.transactions} />
              </div>

              {/* Live Feed */}
              <LiveFeed events={state.liveEvents} />
            </>
          )}

          {/* Loading State */}
          {state.isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-4 text-center">
                <div className="inline-block animate-spin rounded-full border-4 border-slate-700 border-t-blue-500 h-12 w-12"></div>
                <p className="text-slate-400">Loading wallet data...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
