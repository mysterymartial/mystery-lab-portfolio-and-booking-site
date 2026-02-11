'use client'

import { createContext, useContext, ReactNode } from 'react'

const themeValue = {
  theme: 'dark' as const,
  setTheme: () => {},
  resolvedTheme: 'dark' as const,
  forcedTheme: 'dark' as const,
  themes: ['dark'] as const,
  systemTheme: 'dark' as const,
}

const ThemeContext = createContext(themeValue)

export function useTheme() {
  return useContext(ThemeContext) ?? themeValue
}

function ThemeProviderInner({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProviderInner as ThemeProvider }
export default ThemeProviderInner
