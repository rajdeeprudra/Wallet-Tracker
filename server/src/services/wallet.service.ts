import axios from 'axios';


export const getWalletTransactions = async(address:string):Promise<void>=>{
    try{
        const HELIUS_KEY = process.env.SECRET_API_KEY;

        if(!HELIUS_KEY){
        throw new Error("Missing SECRET API KEY in environment variables");
        }

        const url = `https://api-mainnet.helius-rpc.com/v0/addresses/${address}/transactions?api-key=${HELIUS_KEY}&limit=20`;

        const response = await axios.get(url);

        return response.data;

    }catch(error){
    console.error("Helius API error:", error);
    throw new Error("Failed to fetch wallet transactions from Helius");
    }
}

export const getWalletBalances = async (address:string): Promise<unknown>=>{
    try{
    const HELIUS_KEY = process.env.SECRET_API_KEY;

if(!HELIUS_KEY){
    throw new Error("Missing SECRET API KEY in environment variables");
}
    const url = `https://api.helius.xyz/v1/wallet/${address}/balances?api-key=${HELIUS_KEY}`;

    const response = await axios.get(url);
    
    
    return response.data;

    } catch (error) {
    console.error("Helius API error:", error);
    throw new Error("Failed to fetch token balances from Helius");
  }


}