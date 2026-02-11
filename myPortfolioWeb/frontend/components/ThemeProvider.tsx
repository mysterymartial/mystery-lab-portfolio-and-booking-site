'use client'

import { ThemeProvider as ThemeProviderInner } from '@/lib/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProviderInner>{children}</ThemeProviderInner>
}
