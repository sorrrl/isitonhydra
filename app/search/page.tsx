'use client'

import { searchGames, parseFileSize } from '../lib/searchGames'
import SearchBar from '@/components/SearchBar'
import GameResult from '@/components/GameResult'
import { ArrowLeft, Calendar, HardDrive, Search, AlertTriangle, Github, MessageSquare } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import SourceFilter from '@/components/SourceFilter'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../context/LanguageContext'

type SortType = 'date' | 'size'

interface GameData {
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

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [results, setResults] = useState<GameData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [sortedResults, setSortedResults] = useState<GameData[]>([])
  const [selectedSources, setSelectedSources] = useLocalStorage<string[]>('selectedSources', [])
  const { t } = useLanguage()
  
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setIsSearching(true)
      setResults([])
      
      const searchTimeout = setTimeout(() => {
        searchGames(query, selectedSources)
          .then(setResults)
          .finally(() => {
            setIsSearching(false)
          })
      }, 200)

      return () => clearTimeout(searchTimeout)
    }
  }, [searchParams, selectedSources])

  useEffect(() => {
    const sorted = [...results].map(game => ({
      ...game,
      sources: [...game.sources].sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        } else {
          const sizeA = parseFileSize(a.fileSize || '0 MB');
          const sizeB = parseFileSize(b.fileSize || '0 MB');
          return sizeB - sizeA;
        }
      })
    })).sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = Math.max(...a.sources.map(s => new Date(s.uploadDate || 0).getTime()));
        const dateB = Math.max(...b.sources.map(s => new Date(s.uploadDate || 0).getTime()));
        return dateB - dateA;
      } else {
        const sizeA = Math.max(...a.sources.map(s => parseFileSize(s.fileSize || '0 MB')));
        const sizeB = Math.max(...b.sources.map(s => parseFileSize(s.fileSize || '0 MB')));
        return sizeB - sizeA;
      }
    });

    setSortedResults(sorted);
  }, [results, sortBy]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsSearching(true)
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Centered Search Header */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 mb-8">
        {/* Search Bar Container */}
        <div className="flex items-center gap-4 bg-zinc-900/50 rounded-xl p-2">
          <Link
            href="/"
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              isMobileSearch 
              className="bg-transparent focus:outline-none w-full text-white placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Filters Container */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSortBy('date')}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              sortBy === 'date'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-800/50 hover:bg-zinc-800/50'
            )}
          >
            <Calendar className="w-4 h-4" />
            {t('search.date')}
          </button>

          <SourceFilter
            selectedSources={selectedSources}
            onChange={setSelectedSources}
            isMainPage={false}
          />
        </div>
      </div>

      {/* Results Section with Loading State */}
      <div className="max-w-7xl mx-auto">
        {isSearching ? (
          <div className="relative">
            <div className="animate-fadeIn">
              <LoadingSpinner />
            </div>
          </div>
        ) : sortedResults.length > 0 ? (
          <div className="animate-fadeIn">
            <h1 className="text-xl text-zinc-400 mb-6">
              {t('search.resultsFound').replace('{count}', sortedResults.length.toString())}{' '}
              "{searchParams.get('q')}"
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {sortedResults.map((game, index) => (
                <GameResult
                  key={index}
                  name={game.name}
                  image={game.image}
                  sources={game.sources}
                />
              ))}
            </div>
          </div>
        ) : searchParams.get('q') ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fadeIn">
            <AlertTriangle className="w-8 h-8 text-zinc-400" />
            <div className="text-zinc-400">
              {t('search.noResults')} "{searchParams.get('q')}"
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}

