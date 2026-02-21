'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'icon-sm';
  label?: string;
}

/**
 * Copy to clipboard button component
 * Shows a check icon briefly when copied
 */
export function CopyButton({
  text,
  variant = 'ghost',
  size = 'icon-sm',
  label = 'Copy',
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success('Copied to clipboard');

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, [text]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      title={label}
      className="transition-all"
    >
      {isCopied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
}
