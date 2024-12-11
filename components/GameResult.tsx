'use client'

import Image from 'next/image'
import { useState } from 'react'
import { jsonSources } from '@/app/config/sources'

interface GameResultProps {
  name: string
  image?: string
  sources: { 
    name: string
    url: string
    fileSize?: string
    uploadDate?: string
  }[]
}

export default function GameResult({ name, image, sources }: GameResultProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopyUrl = async (sourceName: string, index: number) => {
    const source = sources[index]
    try {
      await navigator.clipboard.writeText(source.url)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="relative overflow-hidden rounded-xl group">
      <div className="absolute inset-0 z-0">
        {image && (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt={name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/60" />
          </div>
        )}
      </div>

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
                {formatDate(source.uploadDate!)}
              </span>

              <span className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity text-white/60">
                Click to copy
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]" />
    </div>
  )
}

