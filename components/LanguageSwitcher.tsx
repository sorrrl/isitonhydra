'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const languages = {
    en: 'English',
    pt: 'Português'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{languages[language]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
          {Object.entries(languages).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code as 'en' | 'pt')
                setIsOpen(false)
              }}
              className={cn(
                'w-full text-left px-4 py-2 text-sm transition-colors hover:bg-zinc-800/50',
                code === language ? 'text-purple-400' : 'text-zinc-400'
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 