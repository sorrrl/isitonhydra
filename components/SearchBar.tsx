'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/app/context/LanguageContext'

interface SearchBarProps {
  onSearch: (query: string) => void
  isMobileSearch?: boolean
  className?: string
}

export default function SearchBar({ onSearch, isMobileSearch, className }: SearchBarProps) {
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('query')?.toString() || ''
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        name="query"
        placeholder={t('searchPlaceholder')}
        className={cn(
          "w-full bg-transparent text-white placeholder-zinc-400",
          "border-none focus:outline-none focus:ring-0",
          "text-base sm:text-lg py-2 px-4",
          // WebKit autofill override
          "[&:-webkit-autofill]:bg-zinc-900/50",
          "[&:-webkit-autofill]:text-white",
          "[&:-webkit-autofill]:shadow-[0_0_0_30px_rgb(24_24_27_/_0.5)_inset]",
          "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
          className
        )}
        autoComplete="off"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400">
        <Search className="w-5 h-5" />
      </div>
    </form>
  )
}

