'use client';

import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Copy } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`Yuk nonton bareng: ${title}!\nBeli tiket resminya di PassGo: ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
        <Share2 className="w-3.5 h-3.5 text-slate-400" />
        <span>Bagikan Event:</span>
      </span>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors border border-emerald-200"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Ajak di WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Salin Link</span>
          </>
        )}
      </button>
    </div>
  );
}
