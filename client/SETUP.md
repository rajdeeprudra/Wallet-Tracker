# Solana Wallet Tracker - Setup Guide

This is a real-time Solana wallet tracking application that monitors wallet balances, token holdings, and blockchain transactions.

## Frontend Features

- **Wallet Balance Tracking**: View SOL and token balances in real-time
- **Transaction History**: Track all wallet transactions with detailed information
- **Live Activity Feed**: Real-time updates for new transactions via WebSocket
- **Token Holdings**: Display all SPL tokens and their values
- **Address Input**: Add and track multiple Solana wallet addresses
- **Copy-to-Clipboard**: Easily copy wallet addresses and transaction signatures
- **Error Handling**: Comprehensive error messages for API failures
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js 18+ and npm/pnpm
- A running backend server (see Backend Setup below)

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   Or with npm:
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```
   
   Replace with your actual backend server URL:
   - Local development: `http://localhost:3001`
   - Production: `https://your-backend-domain.com`

4. **Start the development server:**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup

This frontend application requires a backend server that provides:

### API Endpoints

1. **Get Wallet Info**
   - `GET /api/wallet/{address}`
   - Returns: wallet balance, tokens, transaction count
   - Example response:
     ```json
     {
       "address": "...",
       "balance": 5.23,
       "balanceLamports": 5230000000,
       "tokens": [
         {
           "mint": "...",
           "symbol": "USDC",
           "name": "USD Coin",
           "decimals": 6,
           "amount": 1000,
           "nativeAmount": "1000000000"
         }
       ],
       "transactionCount": 42
     }
     ```

2. **Get Recent Transactions**
   - `GET /api/wallet/{address}/transactions?limit=50`
   - Returns: array of recent transactions
   - Example response:
     ```json
     {
       "transactions": [
         {
           "signature": "...",
           "timestamp": 1704067200,
           "type": "transfer",
           "from": "...",
           "to": "...",
           "amount": 1.5,
           "status": "confirmed",
           "fee": 0.00025
         }
       ],
       "total": 42
     }
     ```

### WebSocket Connection

- Endpoint: `ws://your-backend:3001/ws` (or `wss://` for production)
- Purpose: Real-time transaction updates
- Subscribe: Send message `{ "subscribe": "wallet_address" }`
- Receive updates whenever a transaction occurs on that wallet

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main wallet tracker page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── wallet-tracker/      # Custom wallet tracking components
│       ├── wallet-input.tsx
│       ├── wallet-summary.tsx
│       ├── token-table.tsx
│       ├── transaction-list.tsx
│       ├── live-feed.tsx
│       ├── copy-button.tsx
│       └── error-message.tsx
├── hooks/
│   ├── use-websocket.ts     # WebSocket connection management
│   └── use-wallet-tracker.ts # Main wallet tracking logic
├── lib/
│   ├── api.ts               # API client with axios
│   ├── format.ts            # Formatting utilities
│   └── masks.ts             # Address masking utilities
└── utils/
    └── validators.ts        # Input validation
```

## Key Features

### Real-Time Updates
The application uses WebSocket to receive live transaction updates. When a transaction occurs on the watched wallet, the live feed updates automatically without requiring a page refresh.

### Error Handling
- Network errors are caught and displayed to the user
- Invalid wallet addresses are validated before API calls
- WebSocket reconnection is handled automatically
- Timeout handling for slow API responses

### Data Formatting
- SOL amounts are converted from lamports (1 SOL = 1 billion lamports)
- Token amounts respect token decimals
- Timestamps are converted to readable formats
- Large addresses are masked for privacy in the UI

## Building for Production

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Start production server:**
   ```bash
   pnpm start
   ```

3. **Deploy:**
   You can deploy to Vercel, Netlify, or any Node.js hosting:
   - **Vercel**: Push to GitHub and connect your repo
   - **Docker**: Create a Dockerfile and containerize the app
   - **Other**: Build and deploy the `.next` directory

## Troubleshooting

### "Backend connection failed"
- Ensure your backend server is running
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check network connectivity
- Review browser console for detailed error messages

### "Invalid wallet address"
- Solana addresses are 44 characters long and start with a valid base58 character
- Common valid addresses: 11111111111111111111111111111111
- Check for typos or copy-paste errors

### WebSocket not connecting
- WebSocket must be available on your backend
- Ensure `ws://` or `wss://` protocol is supported
- Check CORS/firewall settings if behind a proxy

## Development

### Styling
The application uses Tailwind CSS v4 with shadcn/ui components. Global styles are defined in `app/globals.css`.

### Adding Components
Use the shadcn/ui CLI to add new components:
```bash
npx shadcn-ui@latest add [component-name]
```

### Environment Variables
- `NEXT_PUBLIC_BACKEND_URL`: Backend API and WebSocket server URL
  - Public variables (prefixed with `NEXT_PUBLIC_`) are exposed to the browser
  - Set in `.env.local` for development
  - Set in your hosting platform's env vars for production

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the backend server logs
3. Check browser console (F12) for error details
4. Verify your wallet address is valid with `solscan.io`
