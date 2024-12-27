'use client'

import SearchBar from '@/components/SearchBar'
import SourceFilter from '@/components/SourceFilter'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Github, MessageSquare, Globe } from 'lucide-react'
import { useLanguage } from './context/LanguageContext'
import LanguageSwitcher from './components/LanguageSwitcher'
import Announcement from './components/Announcement'

export default function Home() {
  const router = useRouter()
  const [selectedSources, setSelectedSources] = useLocalStorage<string[]>('selectedSources', [])
  const { t } = useLanguage()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      {/* Announcement - Left side fixed with better positioning */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 w-[22rem] z-40 hidden lg:block pointer-events-none">
        <div className="pointer-events-auto">
          <Announcement />
        </div>
      </div>

      {/* Main Content - Centered without margin */}
      <div className="w-full max-w-2xl space-y-8">
        {/* Mobile Announcement */}
        <div className="lg:hidden w-full mb-8">
          <Announcement />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center">
          {t('title')}
        </h1>
        <p className="text-zinc-400 text-center">
          {t('subtitle')}
        </p>

        {/* Search and Filter Container */}
        <div className="flex gap-2">
          {/* Search Bar */}
          <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl p-2">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Source Filter */}
          <div className="flex-shrink-0">
            <SourceFilter
              selectedSources={selectedSources}
              onChange={setSelectedSources}
              isMainPage={true}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-purple-400 mb-2">⚡</div>
            <h3 className="text-white font-medium mb-1">
              {t('features.fast.title')}
            </h3>
            <p className="text-sm text-zinc-400">
              {t('features.fast.description')}
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-purple-400 mb-2">🔍</div>
            <h3 className="text-white font-medium mb-1">
              {t('features.smart.title')}
            </h3>
            <p className="text-sm text-zinc-400">
              {t('features.smart.description')}
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-purple-400 mb-2">🛡️</div>
            <h3 className="text-white font-medium mb-1">
              {t('features.reliable.title')}
            </h3>
            <p className="text-sm text-zinc-400">
              {t('features.reliable.description')}
            </p>
          </div>
        </div>

        {/* Credits Section */}
        <div className="pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-zinc-400">
              {t('credits')}
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://discord.gg/hydralaunchercommunity" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                aria-label="Join our Discord"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/zxcsix-zxc/isitonhydra" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                aria-label="View source on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://hydralinks.cloud" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                aria-label="Visit Hydra Links"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

