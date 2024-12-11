'use client'

import { useLanguage } from '../app/context/LanguageContext'

export default function LoadingSpinner() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {/* Animated spinner */}
      <div className="relative w-16 h-16">
        {/* Main spinner */}
        <div className="absolute top-0 left-0 w-full h-full animate-spin">
          <div className="w-full h-full border-4 border-zinc-700/50 border-t-purple-500 rounded-full" />
        </div>
        {/* Secondary spinner */}
        <div className="absolute top-0 left-0 w-full h-full rotate-45 animate-pulse">
          <div className="w-full h-full border-4 border-transparent border-t-purple-500/50 rounded-full" />
        </div>
      </div>

      {/* Loading text */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-medium text-white animate-pulse">
          {t('search.loading')}
        </div>
        <div className="text-sm text-zinc-400">
          {t('search.loadingSubtext')}
        </div>
      </div>
    </div>
  )
} 