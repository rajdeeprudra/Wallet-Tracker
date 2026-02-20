import WebSocket from "ws";

const HELIUS_API = process.env.SECRET_API_KEY;

type Subscription = {
  requestId: number;
  method: string;
  params: any[];
  callback: (data: any) => void;
  subscriptionId: number | null;
};

export class HeliusWebSocketManager {
  private endpoint: string;
  private ws: WebSocket | null = null;
  private subscriptions = new Map<number, Subscription>();
  private isConnected = false;

  constructor(apiKey: string) {
    this.endpoint = `wss://mainnet.helius-rpc.com/?api-key=${HELIUS_API}`;
  }

  connect() {
    this.ws = new WebSocket(this.endpoint);

    this.ws.on("open", () => {
      console.log("Connected to Helius WS");
      this.isConnected = true;
      this.resubscribeAll();
    });

    this.ws.on("message", (event:any) => {
      const data = JSON.parse(event.toString());

      // Subscription confirmation
      if (data.result && typeof data.result === "number") {
        const sub = this.subscriptions.get(data.id);
        if (sub) sub.subscriptionId = data.result;
        return;
      }

      // Notification
      if (data.method?.endsWith("Notification")) {
        const sub = Array.from(this.subscriptions.values())
          .find(s => s.subscriptionId === data.params.subscription);

        if (sub?.callback) {
          sub.callback(data.params.result);
        }
      }
    });

    this.ws.on("close", () => {
      console.log("Helius WS disconnected");
      this.isConnected = false;
      setTimeout(() => this.connect(), 3000);
    });
  }

  subscribe(method: string, params: any[], callback: (data: any) => void) {
    const requestId = Date.now();

    const subscription: Subscription = {
      requestId,
      method,
      params,
      callback,
      subscriptionId: null
    };

    this.subscriptions.set(requestId, subscription);

    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: requestId,
        method,
        params
      }));
    }

    return requestId;
  }

  private resubscribeAll() {
    for (const sub of this.subscriptions.values()) {
      sub.subscriptionId = null;

      this.ws?.send(JSON.stringify({
        jsonrpc: "2.0",
        id: sub.requestId,
        method: sub.method,
        params: sub.params
      }));
    }
  }
}