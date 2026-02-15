import express from "express";
import { getWalletBalances, getWalletTransactions } from "../controllers/wallet.controllers.js";
export const router = express.Router();


//demo route for checking 
router.get("/health", (req,res)=>{
    res.json({
        status:"OK"
    })
});

//routes
/* 1. Show token balances
   2. show tsx history + timestamps
   3. timestamps
*/




router.get("/:address/tokens",getWalletBalances);
router.get("/:address/transactions",getWalletTransactions);

export default router;
