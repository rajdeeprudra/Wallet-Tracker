## Solana Wallet Tracker
![Dashboard](screenshots/wallet%20tracker.png)


A real time solana wallet analytics dashboard that tracks Token Balances, Transaction History and live onchain activity using raw Websockets.

## Tech stack

### Backend

Node js
Express
Typescript
WebSocket server(ws)
REST API Architechture

### Blockchain & Data Infrsstructure
Helius RPC API
Helius WebSocket Streaming
Solana JSON-RPC


### Frontend 
Vibe Coded

## API DESIGN

This project follows a versioned API architechture for future scalability and backward compatibility

### Versioned Endpoints

All routes are prefixed with: `/api/v1`.

Example Endpoints :
`GET /api/v1/:walletAddress/tokens`
`GET /api/v1/:walletAddress/transactions`






