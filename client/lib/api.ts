import axios, { AxiosInstance } from "axios";
import {
  BalanceResponse,
  TransactionsResponse,
  ApiError,
  Token,
} from "@/types/index";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch wallet balances and token holdings
 */
export async function getWalletBalances(
  address: string
): Promise<BalanceResponse> {
  try {
    const response = await apiClient.get(
      `/api/v1/${encodeURIComponent(address)}/tokens`
    );

    const apiData = response.data.data;

    const tokens: Token[] = apiData.balances.map((t: any) => ({
      symbol: t.symbol,
      balance: t.balance,
      decimals: t.decimals,
      usdValue: t.usdValue,
      mint: t.mint,
    }));

    const sol = tokens.find((t) => t.symbol === "SOL");

    return {
      address,
      nativeBalance: sol?.balance || 0,
      totalUsdValue: apiData.totalUsdValue || 0,
      tokens,
    };
  } catch (error) {
    const apiError: ApiError = {
      message: "Failed to fetch wallet balances",
    };

    if (axios.isAxiosError(error)) {
      apiError.status = error.response?.status;
      apiError.message =
        error.response?.data?.message || "Failed to fetch wallet balances";
    }

    throw apiError;
  }
}

/**
 * Fetch transaction history for a wallet
 */
export async function getWalletTransactions(
  address: string
): Promise<TransactionsResponse> {
  try {
    const response = await apiClient.get(
      `/api/v1/${encodeURIComponent(address)}/transactions`
    );

    const apiData = response.data.data || [];

    const transactions = apiData.map((tx:any)=>({
      signature:tx.signature,
      timestamp:tx.timestamp,
      status:tx.transactionError ? "failed" : "success",
      fee: tx.fee,
      type:tx.type,
    }));

    return {
      address,
      transactions,
    };
  } catch (error) {
    const apiError: ApiError = {
      message: "Failed to fetch transactions",
    };

    if (axios.isAxiosError(error)) {
      apiError.status = error.response?.status;
      apiError.message =
        error.response?.data?.message || "Failed to fetch transactions";
    }

    throw apiError;
  }
}

export default apiClient;