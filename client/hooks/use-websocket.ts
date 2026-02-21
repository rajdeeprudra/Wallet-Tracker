import { useEffect, useRef, useCallback } from 'react';

interface WebSocketOptions {
  url: string;
  onMessage: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

/**
 * Custom hook for WebSocket connection management
 * Handles connection, reconnection, and cleanup
 */
export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectAttempts = 5,
  reconnectDelay = 3000,
}: WebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isIntentionallyClosed = useRef(false);

  const connect = useCallback(() => {
    try {
      // Prevent multiple simultaneous connections
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      isIntentionallyClosed.current = false;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        reconnectCountRef.current = 0;
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('[v0] Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('[v0] WebSocket error:', error);
        onError?.(error);
      };

      ws.onclose = () => {
        wsRef.current = null;
        onClose?.();

        // Attempt reconnection if not intentionally closed
        if (
          !isIntentionallyClosed.current &&
          reconnectCountRef.current < reconnectAttempts
        ) {
          reconnectCountRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[v0] Failed to create WebSocket:', error);
      onError?.(new Event('WebSocketError'));
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    isIntentionallyClosed.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback(
    (data: Record<string, unknown>) => {
      if (
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(JSON.stringify(data));
      }
    },
    [],
  );

  const isConnected =
    wsRef.current?.readyState === WebSocket.OPEN;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    send,
    isConnected,
    ws: wsRef.current,
  };
}
