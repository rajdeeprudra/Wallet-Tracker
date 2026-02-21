import { useState, useEffect, useCallback, useRef } from 'react';
import {
  WalletTrackerState,
  Token,
  Transaction,
  TransactionEvent,
  NewTransactionMessage,
} from '@/types/index';
import { getWalletBalances, getWalletTransactions } from '@/lib/api';
import { useWebSocket } from './use-websocket';

const INITIAL_STATE: Omit<WalletTrackerState, 'walletAddress'> = {
  nativeBalance: 0,
  totalUsdValue: 0,
  tokens: [],
  transactions: [],
  liveEvents: [],
  isLoading: false,
  error: null,
  wsConnected: false,
  balanceVisible: true,
};

/**
 * Main hook for wallet tracking
 * Manages state, API calls, and WebSocket connection
 */
export function useWalletTracker(initialAddress = '') {
  const [state, setState] = useState<WalletTrackerState>({
    walletAddress: initialAddress,
    ...INITIAL_STATE,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // WebSocket handlers
  const handleWsMessage = useCallback((data: unknown) => {
    const message = data as NewTransactionMessage;

    if (message.type === 'SUBSCRIBED') {
      setState((prev) => ({ ...prev, wsConnected: true }));
    } else if (message.type === 'NEW_TRANSACTION' && message.data) {
      // Add to live events
      setState((prev) => {
        const newEvent: TransactionEvent = {
          signature: message.data!.signature,
          status: message.data!.status,
          fee: message.data!.fee,
          timestamp: Date.now(),
        };

        // Add to transactions list as well
        const newTransaction: Transaction = {
          signature: message.data!.signature,
          timestamp: Date.now(),
          status: message.data!.status,
          fee: message.data!.fee,
        };

        return {
          ...prev,
          liveEvents: [newEvent, ...prev.liveEvents].slice(0, 20),
          transactions: [newTransaction, ...prev.transactions],
        };
      });
    }
  }, []);

  const handleWsOpen = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const handleWsClose = useCallback(() => {
    setState((prev) => ({ ...prev, wsConnected: false }));
  }, []);

  const handleWsError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: 'WebSocket connection lost. Attempting to reconnect...',
      wsConnected: false,
    }));
  }, []);

  // Construct WebSocket URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  const wsUrl = backendUrl
    .replace('https://', 'wss://')
    .replace('http://', 'ws://');

  const { connect: wsConnect, disconnect: wsDisconnect } = useWebSocket({
    url: `${wsUrl}`,
    onMessage: handleWsMessage,
    onOpen: handleWsOpen,
    onClose: handleWsClose,
    onError: handleWsError,
  });

  // Fetch wallet data
  const fetchWalletData = useCallback(async (address: string) => {
    // Cancel any pending requests
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Fetch balances and transactions in parallel
      const [balanceData, transactionData] = await Promise.all([
        getWalletBalances(address),
        getWalletTransactions(address),
      ]);

      setState((prev) => ({
        ...prev,
        nativeBalance: balanceData.nativeBalance,
        totalUsdValue: balanceData.totalUsdValue,
        tokens: balanceData.tokens || [],
        transactions: transactionData.transactions || [],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch wallet data';

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Handle wallet address changes
  const setWalletAddress = useCallback(async (address: string) => {
    // Validate address is not empty
    if (!address.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a wallet address',
      }));
      return;
    }

    // Close existing WebSocket connection
    wsDisconnect();

    // Reset all state except the new address
    setState((prev) => ({
      ...prev,
      walletAddress: address,
      ...INITIAL_STATE,
    }));

    // Fetch initial data
    await fetchWalletData(address);

    // Subscribe to WebSocket
    wsConnect();

    // Send subscription message with delay to ensure connection is ready
    setTimeout(() => {
      // The WebSocket hook will handle sending the subscription message
      // We need to send it after connection
    }, 100);
  }, [fetchWalletData, wsConnect, wsDisconnect]);

  // Subscribe to WebSocket when needed
  useEffect(() => {
    if (
      state.walletAddress &&
      !state.wsConnected &&
      !state.isLoading
    ) {
      // This effect handles reconnection attempts
      const timer = setTimeout(() => {
        wsConnect();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [state.walletAddress, state.wsConnected, state.isLoading, wsConnect]);

  // Toggle balance visibility
  const toggleBalanceVisibility = useCallback(() => {
    setState((prev) => ({
      ...prev,
      balanceVisible: !prev.balanceVisible,
    }));
  }, []);

  // Retry failed fetch
  const retry = useCallback(() => {
    if (state.walletAddress) {
      fetchWalletData(state.walletAddress);
    }
  }, [state.walletAddress, fetchWalletData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      wsDisconnect();
    };
  }, [wsDisconnect]);

  return {
    state,
    setWalletAddress,
    toggleBalanceVisibility,
    retry,
  };
}
