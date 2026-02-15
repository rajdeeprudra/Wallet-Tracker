import axios from 'axios';




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
    throw new Error("Failed to fetch wallet transactions from Helius");
  }


}