# Backend API Specification

This document describes the API and WebSocket requirements for the Solana Wallet Tracker backend.

## Base URL

The backend should be accessible at the URL specified in `NEXT_PUBLIC_BACKEND_URL` environment variable.

Examples:
- Local: `http://localhost:3001`
- Production: `https://api.yourdomain.com`

## REST Endpoints

### 1. Get Wallet Information

**Endpoint:** `GET /api/wallet/:address`

**Description:** Retrieves wallet balance and token holdings for a given Solana address.

**Path Parameters:**
- `address` (string, required): Solana wallet address (44 characters)

**Query Parameters:**
- None

**Response (200 OK):**
```json
{
  "address": "11111111111111111111111111111111",
  "balance": 5.23,
  "balanceLamports": 5230000000,
  "tokens": [
    {
      "mint": "EPjFWaLb3cchold0Zace34AnWUjB34pP...",
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "amount": 1000.50,
      "nativeAmount": "1000500000",
      "uiAmount": 1000.50,
      "tokenAmount": {
        "amount": "1000500000",
        "decimals": 6,
        "uiAmount": 1000.50,
        "uiAmountString": "1000.50"
      }
    }
  ],
  "transactionCount": 42,
  "lamportsPerSignature": 5000
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid wallet address format"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Wallet not found"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Failed to fetch wallet information",
  "details": "Connection timeout"
}
```

---

### 2. Get Recent Transactions

**Endpoint:** `GET /api/wallet/:address/transactions`

**Description:** Retrieves recent transactions for a given wallet address.

**Path Parameters:**
- `address` (string, required): Solana wallet address

**Query Parameters:**
- `limit` (number, optional, default: 50): Maximum number of transactions to return (1-100)
- `offset` (number, optional, default: 0): Number of transactions to skip (for pagination)
- `before` (string, optional): Transaction signature to fetch transactions before this one

**Response (200 OK):**
```json
{
  "address": "11111111111111111111111111111111",
  "transactions": [
    {
      "signature": "5sxZhzN5SEzX7uEZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1",
      "blockTime": 1704067200,
      "timestamp": 1704067200,
      "type": "transfer",
      "from": "11111111111111111111111111111111",
      "to": "22222222222222222222222222222222",
      "amount": 1.5,
      "lamports": 1500000000,
      "status": "confirmed",
      "fee": 5000,
      "feeSol": 0.000005,
      "memo": "Payment for services",
      "instructions": [
        {
          "type": "transfer",
          "program": "system",
          "data": {}
        }
      ]
    },
    {
      "signature": "4rXwYmZkYQvWuDuF1T7tWT7tWT7tWT7tWT7tWT7tWT7tWT7tWT7tWT7tWT7tWT7",
      "blockTime": 1704066900,
      "timestamp": 1704066900,
      "type": "token_transfer",
      "from": "11111111111111111111111111111111",
      "to": "33333333333333333333333333333333",
      "tokenMint": "EPjFWaLb3cchold0Zace34AnWUjB34pP...",
      "tokenSymbol": "USDC",
      "amount": 100,
      "decimals": 6,
      "status": "confirmed",
      "fee": 5000,
      "feeSol": 0.000005
    }
  ],
  "total": 42,
  "hasMore": true
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid limit parameter",
  "details": "Limit must be between 1 and 100"
}
```

---

## WebSocket

### Connection

**Endpoint:** `ws://your-backend:3001` or `wss://your-backend:3001` (for HTTPS)

**Protocol:** Upgrade HTTP to WebSocket

**Headers:**
```
Upgrade: websocket
Connection: Upgrade
```

### Message Format

**Subscribe to wallet updates:**
```json
{
  "action": "subscribe",
  "wallet": "11111111111111111111111111111111"
}
```

**Unsubscribe from wallet:**
```json
{
  "action": "unsubscribe",
  "wallet": "11111111111111111111111111111111"
}
```

**Server sends (new transaction):**
```json
{
  "type": "transaction",
  "wallet": "11111111111111111111111111111111",
  "transaction": {
    "signature": "5sxZhzN5SEzX7uEZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1Z8sXZ1",
    "blockTime": 1704067200,
    "timestamp": 1704067200,
    "type": "transfer",
    "from": "11111111111111111111111111111111",
    "to": "22222222222222222222222222222222",
    "amount": 1.5,
    "lamports": 1500000000,
    "status": "confirmed",
    "fee": 5000,
    "feeSol": 0.000005,
    "memo": "Payment for services"
  }
}
```

**Server sends (balance update):**
```json
{
  "type": "balance_update",
  "wallet": "11111111111111111111111111111111",
  "balance": 5.23,
  "balanceLamports": 5230000000,
  "timestamp": 1704067200
}
```

**Server sends (connection confirmation):**
```json
{
  "type": "subscribed",
  "wallet": "11111111111111111111111111111111",
  "message": "Successfully subscribed to wallet updates"
}
```

**Server sends (error):**
```json
{
  "type": "error",
  "message": "Invalid wallet address",
  "wallet": "invalid_address"
}
```

### WebSocket Behavior

1. **Connection Handling**
   - Client connects to WebSocket endpoint
   - Server accepts connection and sends `subscribed` message
   - Connection persists until client closes or timeout occurs
   - Client should implement automatic reconnection with exponential backoff

2. **Message Delivery**
   - New transactions are sent immediately to all connected clients subscribed to that wallet
   - Balance updates may be sent periodically or on significant changes
   - All messages include timestamp for synchronization

3. **Error Handling**
   - Invalid wallet addresses return `error` message type
   - Server may close connection on protocol violations
   - Client should gracefully handle disconnections and reconnect

4. **Heartbeat (Optional but Recommended)**
   - Server can send periodic ping messages to detect dead connections
   - Client should respond with pong messages
   - Helps maintain connection through proxies and firewalls

---

## Error Handling

### HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request parameters or format
- **404 Not Found**: Resource not found (wallet doesn't exist)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Temporary service unavailability

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "details": "Optional detailed information",
  "code": "OPTIONAL_ERROR_CODE"
}
```

---

## CORS Requirements

The backend should allow CORS requests from the frontend domain:

**Required CORS Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000, https://yourdomain.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

---

## Rate Limiting Recommendations

- **Per IP**: 100 requests per minute for REST API
- **Per WebSocket Connection**: Appropriate for real-time updates
- **Return `Retry-After` header on 429 responses**

---

## Testing

### curl Examples

**Get wallet info:**
```bash
curl http://localhost:3001/api/wallet/11111111111111111111111111111111
```

**Get transactions:**
```bash
curl "http://localhost:3001/api/wallet/11111111111111111111111111111111/transactions?limit=10"
```

**WebSocket test (with wscat):**
```bash
wscat -c ws://localhost:3001
# Then send: {"action": "subscribe", "wallet": "11111111111111111111111111111111"}
```

---

## Implementation Notes

1. **Solana Integration**
   - Use `@solana/web3.js` for Solana RPC calls
   - Cache results appropriately to reduce RPC calls
   - Monitor rate limits on public RPC endpoints

2. **Real-Time Updates**
   - Use Solana's block subscription or transaction logs for real-time data
   - WebSocket should deliver updates within 1-2 seconds of confirmation

3. **Data Consistency**
   - Balance and token data should match Solana blockchain state
   - Transactions should be ordered by blockTime (newest first)
   - Include confirmed and finalized transactions

4. **Performance**
   - API endpoints should respond within 500ms
   - Support horizontal scaling for WebSocket connections
   - Consider caching wallet data for frequently accessed addresses
