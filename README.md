## Solana Wallet Tracker

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-14F195?logo=solana&logoColor=black)
![Helius RPC](https://img.shields.io/badge/Helius-RPC-purple)
![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-blue)
![API](https://img.shields.io/badge/API-Versioned-orange)
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






