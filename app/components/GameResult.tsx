'use client'

import { useState } from 'react'
import { formatDate } from '../lib/utils'

interface GameResultProps {
  name: string;
  image?: string;
  sources: {
    name: string;
    url: string;
    sourceUrl?: string;
    uploadDate: string;
    fileSize?: string;
  }[];
}

export default function GameResult({ name, image, sources }: GameResultProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyUrl = (sourceName: string, index: number) => {
    const source = sources[index];
    if (source.sourceUrl) {
      navigator.clipboard.writeText(source.sourceUrl);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800/50">
      {image && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover opacity-50"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full backdrop-blur-sm">
        <h2 className="px-6 py-4 text-xl font-bold text-white sm:text-2xl">
          {name}
        </h2>

        <div className="flex flex-col gap-2 px-6 pb-6">
          {sources.map((source, index) => (
            <button
              key={index}
              onClick={() => handleCopyUrl(source.name, index)}
              className="flex items-center gap-3 group/item relative text-sm sm:text-base hover:bg-white/5 rounded-lg p-2 transition-colors"
            >
              <span className="text-white/90 hover:text-white font-medium">
                {source.name}
                {copiedIndex === index && (
                  <span className="absolute left-1/2 -translate-x-1/2 -top-6 px-2 py-1 bg-green-500 text-xs rounded text-white whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </span>

              <span className="text-white/60">•</span>
              <span className="text-white/60">
                {formatDate(source.uploadDate)}
              </span>

              <span className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity text-white/60">
                Click to copy source
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 