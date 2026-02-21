import { WebSocketServer, WebSocket } from "ws";
import { HeliusWebSocketManager } from "./heliusManager.js";

type ClientMeta = {
  subscriptionId?: number;
  address?: string;
};

export const setupWebSocket = (server: any) => {
  const wss = new WebSocketServer({ server });

  const apiKey = process.env.SECRET_API_KEY;
  if (!apiKey) {
    throw new Error("Missing SECRET_API_KEY for WebSocket");
  }

  const helius = new HeliusWebSocketManager(apiKey);
  helius.connect();

  wss.on("connection", (client: WebSocket) => {
    console.log("Client connected to backend WS");

    const clientMeta: ClientMeta = {};

    client.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());
        const address = parsed.address;

        if (!address) {
          client.send(JSON.stringify({
            type: "ERROR",
            message: "Wallet address required"
          }));
          return;
        }

        // Prevent duplicate subscription
        if (clientMeta.subscriptionId) {
          helius.unsubscribe(clientMeta.subscriptionId);
        }

        clientMeta.address = address;

        const requestId = helius.subscribe(
          "logsSubscribe",
          [
            { mentions: [address] },
            { commitment: "confirmed" }
          ],
          (logData) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "NEW_TRANSACTION",
                signature: logData.value.signature,
                err: logData.value.err || null,
                logs: logData.value.logs
              }));
            }
          }
        );

        clientMeta.subscriptionId = requestId;

        client.send(JSON.stringify({
          type: "SUBSCRIBED",
          address
        }));

      } catch (err) {
        client.send(JSON.stringify({
          type: "ERROR",
          message: "Invalid message format"
        }));
      }
    });

    client.on("close", () => {
      console.log("Client disconnected");

      if (clientMeta.subscriptionId) {
        helius.unsubscribe(clientMeta.subscriptionId);
      }
    });

    client.on("error", (err) => {
      console.error("Client WS error:", err);
    });
  });
};