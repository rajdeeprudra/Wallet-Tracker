'use client';

import { Wallet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-slate-800/50 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left - Developer Credit */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Developed by</span>
            <span className="font-semibold text-slate-200">Rudrax</span>
          </div>

          {/* Center - Icons and Attribution */}
          <div className="flex items-center gap-4">
            {/* Wallet Icon */}
            <div title="Wallet Tracking" className="text-slate-300 hover:text-slate-100 transition-colors">
              <Wallet size={24} />
            </div>

            {/* Helius RPC Icon */}
            <div
              title="Powered by Helius RPC"
              className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-xs"
            >
              H
            </div>
          </div>

          {/* Right - Tech Stack */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Built with</span>
            <span className="font-semibold text-slate-200">Helius RPC</span>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="mt-6 border-t border-slate-700/30 pt-6 text-center text-xs text-slate-500">
          <p>
            Real-time Solana blockchain data provided by Helius RPC • Track, monitor, and analyze your Solana wallet activity
          </p>
        </div>
      </div>
    </footer>
  );
}
