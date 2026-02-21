// Wallet and Balance Types
export interface Token {
  symbol: string;
  balance: number;
  decimals: number;
  usdValue: number;
  mint?: string;
}

export interface WalletSummary {
  address: string;
  nativeBalance: number;
  totalUsdValue: number;
  tokenCount: number;
}

export interface Transaction {
  signature: string;
  timestamp: number;
  status: 'success' | 'failed';
  fee: number;
  type?: string;
}

export interface TransactionEvent {
  signature: string;
  status: 'success' | 'failed';
  fee: number;
  timestamp: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data?: Record<string, unknown>;
  address?: string;
}

export interface SubscribedMessage extends WebSocketMessage {
  type: 'SUBSCRIBED';
  data: {
    address: string;
    message: string;
  };
}

export interface NewTransactionMessage extends WebSocketMessage {
  type: 'NEW_TRANSACTION';
  data: {
    signature: string;
    status: 'success' | 'failed';
    fee: number;
  };
}

// API Response Types
export interface BalanceResponse {
  address: string;
  nativeBalance: number;
  totalUsdValue: number;
  tokens: Token[];
}

export interface TransactionsResponse {
  address: string;
  transactions: Transaction[];
}

// Wallet Tracker State
export interface WalletTrackerState {
  walletAddress: string;
  nativeBalance: number;
  totalUsdValue: number;
  tokens: Token[];
  transactions: Transaction[];
  liveEvents: TransactionEvent[];
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
  balanceVisible: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
}
