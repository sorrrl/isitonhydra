'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
}

export default function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  useEffect(() => {
    const searchQuery = searchParams.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className={className || "w-full pl-10 pr-4 py-2 bg-transparent text-white placeholder-zinc-400 focus:outline-none"}
        />
      </div>
    </form>
  )
} 