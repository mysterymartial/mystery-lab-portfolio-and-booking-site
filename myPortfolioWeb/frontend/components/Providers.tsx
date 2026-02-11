'use client'

import { createContext, useContext, ReactNode } from 'react'
import { AuthProvider } from '@/lib/firebase'

const themeValue = { theme: 'dark', setTheme: () => {}, resolvedTheme: 'dark' as const }
const ThemeContext = createContext(themeValue)

export function useTheme() {
  return useContext(ThemeContext) ?? themeValue
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={themeValue}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeContext.Provider>
  )
}
