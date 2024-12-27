'use client'

import { useState } from 'react'
import { formatDate } from '../lib/utils'
import UrlSelectionPopup from './UrlSelectionPopup'
import { useLanguage } from '../context/LanguageContext'
import { Calendar, Clock, Copy, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Source {
  name: string
  url: string
  uploadDate: string
  fileSize?: string
  additional_urls?: Array<{
    name: string
    url: string
    description?: string
  }>
}

interface GameResultProps {
  name: string
  image?: string
  sources: Source[]
}

export default function GameResult({ name, image, sources }: GameResultProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showUrlPopup, setShowUrlPopup] = useState(false)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const { t } = useLanguage()

  return (
    <>
      <div className="relative group overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800/50 transition-all duration-300 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-purple-500/5">
        {image && (
          <div className="absolute inset-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/70" />
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full backdrop-blur-sm">
          <h2 className="px-5 py-4 text-xl font-bold text-white/90 sm:text-2xl border-b border-zinc-800/50 flex items-center justify-between">
            <span className="truncate">{name}</span>
            <span className="text-xs font-normal text-zinc-500">
              {sources.length} {sources.length === 1 ? 'source' : 'sources'}
            </span>
          </h2>

          <div className="divide-y divide-zinc-800/30">
            {sources.map((source, index) => {
              const hasAdditionalUrls = source.additional_urls && source.additional_urls.length > 0;
              const date = new Date(source.uploadDate)
              const isRecent = (new Date().getTime() - date.getTime()) < 1000 * 60 * 60 * 24 * 7 // 7 days
              
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 transition-all duration-200 group/item",
                    "hover:bg-gradient-to-r hover:from-white/[0.03] hover:to-transparent"
                  )}
                >
                  <div className="flex-1 min-w-0 flex items-center gap-6">
                    <span className="text-white/90 font-medium truncate min-w-[160px] text-sm">
                      {source.name}
                    </span>

                    <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 text-xs">
                      {isRecent ? (
                        <Clock className="w-3.5 h-3.5 text-green-500/70" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5" />
                      )}
                      <span className={cn(
                        "tabular-nums",
                        isRecent && "text-green-500/70"
                      )}>
                        {formatDate(source.uploadDate)}
                      </span>
                    </div>
                  </div>

                  {hasAdditionalUrls ? (
                    <button
                      onClick={() => {
                        setSelectedSource(source);
                        setShowUrlPopup(true);
                      }}
                      className={cn(
                        "flex items-center gap-2 flex-shrink-0 ml-8 px-3 py-1.5 rounded-lg",
                        "bg-zinc-800/50 text-zinc-400 opacity-0 group-hover/item:opacity-100",
                        "hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 text-xs font-medium"
                      )}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t('gameResult.chooseVersion')}
                    </button>
                  ) : (
                    <div className="relative flex-shrink-0 ml-8">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(source.url);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                          "bg-zinc-800/50 text-zinc-400 opacity-0 group-hover/item:opacity-100",
                          "hover:text-white transition-all duration-200 text-xs font-medium"
                        )}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {t('gameResult.clickToCopy')}
                      </button>
                      {copiedIndex === index && (
                        <span className="absolute -top-8 right-0 px-2 py-1 bg-green-500/90 text-xs rounded-md text-white whitespace-nowrap animate-fade-in">
                          {t('gameResult.copied')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <UrlSelectionPopup
        isOpen={showUrlPopup}
        onClose={() => setShowUrlPopup(false)}
        options={selectedSource?.additional_urls || []}
        onSelect={(url) => {
          navigator.clipboard.writeText(url);
          if (selectedSource) {
            setCopiedIndex(sources.findIndex(s => s.name === selectedSource.name));
            setTimeout(() => setCopiedIndex(null), 2000);
          }
          setShowUrlPopup(false);
        }}
      />
    </>
  );
} 