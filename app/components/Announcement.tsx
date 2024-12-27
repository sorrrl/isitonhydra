'use client'

import { useLanguage } from '../context/LanguageContext'
import { AlertTriangle } from 'lucide-react'

export default function Announcement() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-orange-500/5 border border-orange-500/20 backdrop-blur-sm shadow-xl shadow-orange-500/10">
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-16 translate-y-16" />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="relative hidden sm:block">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1 animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 text-orange-500 animate-ping opacity-20">
              <AlertTriangle className="w-full h-full" />
            </div>
          </div>
          
          <div className="space-y-3 min-w-0 flex-1">
            <h3 className="text-lg font-medium text-orange-500/90 tracking-tight">
              {t('announcement.title')}
            </h3>
            <div className="text-[15px] leading-relaxed text-orange-100/80 space-y-4 whitespace-pre-line">
              {t('announcement.message')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 