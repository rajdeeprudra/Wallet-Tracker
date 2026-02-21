'use client';

import { useEffect, useRef } from 'react';
import { Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionEvent } from '@/types/index';
import { formatNumber } from '@/lib/format';
import { maskSignature } from '@/lib/masks';
import { CopyButton } from './copy-button';

interface LiveFeedProps {
  events: TransactionEvent[];
}

/**
 * Real-time activity feed component
 * Displays new transactions as they occur
 */
export function LiveFeed({ events }: LiveFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (feedRef.current && events.length > 0) {
      feedRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-yellow-500" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Waiting for new transactions...</p>
          </div>
        ) : (
          <div
            ref={feedRef}
            className="max-h-64 space-y-2 overflow-y-auto"
          >
            {events.map((event, index) => (
              <div
                key={`${event.signature}-${index}`}
                className="animate-in fade-in slide-in-from-top-2 flex items-center justify-between gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 transition-all dark:border-green-400/30 dark:bg-green-950/20"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  {/* Status Icon */}
                  {event.status === 'success' ? (
                    <CheckCircle2 className="size-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="size-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  )}

                  {/* Event Details */}
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-medium">
                      {maskSignature(event.signature)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.status === 'success' ? 'Success' : 'Failed'} •
                      Fee: {formatNumber(event.fee)} SOL
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <CopyButton
                  text={event.signature}
                  variant="ghost"
                  size="icon-sm"
                  label="Copy signature"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
