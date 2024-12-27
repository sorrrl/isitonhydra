'use client'

import { useLanguage } from '../context/LanguageContext'

interface UrlOption {
  name: string
  url: string
  description?: string
}

interface UrlSelectionPopupProps {
  isOpen: boolean
  onClose: () => void
  options: UrlOption[]
  onSelect: (url: string) => void
}

export default function UrlSelectionPopup({ 
  isOpen, 
  onClose, 
  options, 
  onSelect 
}: UrlSelectionPopupProps) {
  const { t } = useLanguage()

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm mx-4 overflow-hidden rounded-2xl bg-zinc-900/90 border border-zinc-800/50 shadow-xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            {t('gameResult.selectVersion')}
          </h3>
          
          <div className="space-y-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(option.url);
                  onClose();
                }}
                className="w-full flex flex-col gap-1 text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="text-white/90 group-hover:text-white font-medium">
                  {option.name}
                </span>
                {option.description && (
                  <span className="text-sm text-white/50 group-hover:text-white/60">
                    {option.description}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-zinc-800/50 text-white/60 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {t('gameResult.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
} 