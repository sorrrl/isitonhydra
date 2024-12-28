'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '../lib/utils'
import UrlSelectionPopup from './UrlSelectionPopup'
import { useLanguage } from '../context/LanguageContext'
import { Calendar, Copy, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { jsonSources } from '../config/sources'
import Image from 'next/image'

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
  genres?: string[]
}

export default function GameResult({ name, image, sources, genres = [] }: GameResultProps) {
  console.log('GameResult Debug:', {
    componentName: 'GameResult',
    props: {
      name,
      genres: {
        value: genres,
        type: typeof genres,
        isArray: Array.isArray(genres),
        length: genres?.length,
        entries: Array.isArray(genres) ? [...genres] : 'not an array'
      }
    }
  });

  const genresList = Array.isArray(genres) ? genres : [];
  
  console.log('GameResult rendering:', {
    name,
    genresProvided: genresList,
    genresLength: genresList.length
  });
  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showUrlPopup, setShowUrlPopup] = useState(false)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const { t, language } = useLanguage()
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  // Simplified image URL validation and fallback
  useEffect(() => {
    if (!image) return;

    // Start with the original image URL
    setImageUrl(image);

    // We'll let the Image component's onError handle the fallback
  }, [image]);

  const isValidImageUrl = image && image.includes('/apps/') && image.endsWith('/header.jpg');

  const getSourceUrl = (sourceName: string) => {
    const sourceConfig = jsonSources.find(s => s.name === sourceName);
    return sourceConfig?.url || '';
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800/50 transition-all duration-300 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-purple-500/5">
        {imageUrl && !imageError && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-50"
              onError={() => {
                // If the header.jpg fails, try capsule_616x353.jpg
                if (imageUrl.includes('header.jpg')) {
                  const fallbackUrl = imageUrl.replace('header.jpg', 'capsule_616x353.jpg');
                  console.log('Trying fallback image:', fallbackUrl);
                  setImageUrl(fallbackUrl);
                } else {
                  // If fallback also fails, show error state
                  console.error('All image attempts failed for:', name);
                  setImageError(true);
                }
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/70" />
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full backdrop-blur-sm">
          <h2 className="px-5 py-4 text-xl font-bold text-white/90 sm:text-2xl border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="truncate">{name}</span>
              {genresList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {genresList.map((genre, index) => (
                    <span 
                      key={index}
                      className="text-xs font-normal text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs font-normal text-zinc-500">
              {sources.length} {sources.length === 1 ? 'source' : 'sources'}
            </span>
          </h2>

          <div className="divide-y divide-zinc-800/30">
            {sources.map((source, index) => {
              const hasAdditionalUrls = source.additional_urls && source.additional_urls.length > 0;
              const sourceUrl = getSourceUrl(source.name);
              
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
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="tabular-nums">
                        {formatDate(source.uploadDate, language)}
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
                        "flex items-center gap-1.5 px-2 py-1 rounded-lg",
                        "bg-zinc-800/50 text-zinc-400 opacity-0 group-hover/item:opacity-100",
                        "hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200 text-xs font-medium"
                      )}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t('gameResult.select')}</span>
                    </button>
                  ) : (
                    <div className="relative flex-shrink-0 ml-8">
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(sourceUrl);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-lg",
                          "bg-zinc-800/50 text-zinc-400 opacity-0 group-hover/item:opacity-100",
                          "hover:text-white transition-all duration-200 text-xs font-medium"
                        )}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('gameResult.copy')}</span>
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
            setTimeout(() => {
              setCopiedIndex(null);
              setShowUrlPopup(false);
            }, 2000);
          }
        }}
      />
    </>
  );
} 