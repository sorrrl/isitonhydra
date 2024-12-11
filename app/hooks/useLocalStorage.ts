'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with the initial value
  const [value, setValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load value from localStorage once the component mounts
  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
      setIsInitialized(true)
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      setIsInitialized(true)
    }
  }, [key])

  // Update localStorage when the value changes
  useEffect(() => {
    if (!isInitialized) return

    try {
      if (value === initialValue) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [key, value, initialValue, isInitialized])

  return [value, setValue] as const
} 