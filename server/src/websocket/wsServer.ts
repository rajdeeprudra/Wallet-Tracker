import { WebSocketServer } from "ws";
import { HeliusWebSocketManager } from "./heliusManager.js";

export const setupWebSocket = (server: any) => {
  const wss = new WebSocketServer({ server });

  const helius = new HeliusWebSocketManager(
    process.env.SECRET_API_KEY!
  );

  helius.connect();

  wss.on("connection", (client) => {
    console.log("Client connected to backend WS");

    client.on("message", (msg) => {
      const address = msg.toString();

      helius.subscribe(
        "accountSubscribe",
        [address, { commitment: "confirmed" }],
        (data) => {
          client.send(JSON.stringify({
            type: "ACCOUNT_UPDATE",
            data
          }));
        }
      );
    });

    client.on("close", () => {
      console.log("Client disconnected");
    });
  });
};