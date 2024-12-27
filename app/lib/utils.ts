import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const monthTranslations = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
}

const relativeTimeTranslations = {
  en: {
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago'
  },
  pt: {
    today: 'Hoje',
    yesterday: 'Ontem',
    daysAgo: 'dias atrás'
  },
  ru: {
    today: 'Сегодня',
    yesterday: 'Вчера',
    daysAgo: 'дней назад'
  }
}

export function formatDate(dateString: string, language: 'en' | 'pt' | 'ru' = 'en'): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // If date is in the future (upcoming release)
  if (date > now) {
    return `${monthTranslations[language][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  // If within last 30 days, show relative time
  if (diffDays <= 30) {
    if (diffDays === 0) return relativeTimeTranslations[language].today
    if (diffDays === 1) return relativeTimeTranslations[language].yesterday
    return `${diffDays} ${relativeTimeTranslations[language].daysAgo}`
  }

  // Otherwise show formatted date
  return `${monthTranslations[language][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
} 