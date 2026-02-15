import type { Request, Response } from "express";
import * as walletService from "../services/wallet.service.js";

type WalletParams = {
  address: string;
};

/**
 * GET /api/v1/wallet/:address/tokens
 * Controller for fetching wallet balances
 */
export const getWalletBalances = async (
  req: Request<WalletParams>,
  res: Response
): Promise<void> => {
  try {
    const { address } = req.params;

    const balances = await walletService.getWalletBalances(address);

    res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    console.error("Error fetching wallet balances:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet balances",
    });
  }
};

export const getWalletTransactions = async(req:Request<WalletParams>, res:Response):Promise<void>=>{
    try{
      const { address } = req.params;
      const transactions = await walletService.getWalletTransactions(address);
      res.status(200).json({
      success: true,
      data: transactions,
    });
    }catch(error){console.error("Error fetching wallet balances:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet transactions",
    });}
};