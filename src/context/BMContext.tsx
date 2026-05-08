import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { type Lang, translate } from '../data/i18n'
import { blip, chord, setMuted, isMuted } from '../utils/audio'

const PALETTES = ['pastel', 'dmg', 'ocean', 'berry', 'grape', 'mono']

interface BMContextType {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  t: (key: string) => string
  palette: string
  setPalette: (p: string) => void
  cyclePalette: () => void
  blip: typeof blip
  chord: typeof chord
  muted: boolean
  setMuted: (m: boolean) => void
  PALETTES: string[]
}

const BMContext = createContext<BMContextType | null>(null)

export function BMProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem('bm_lang') as Lang) || 'en' } catch { return 'en' }
  })

  const [palette, setPaletteState] = useState(() => {
    try { return localStorage.getItem('bm_palette') || 'pastel' } catch { return 'pastel' }
  })

  const [mutedState, setMutedState] = useState(isMuted)

  useEffect(() => {
    document.body.dataset.palette = palette
    try { localStorage.setItem('bm_palette', palette) } catch { /* */ }
  }, [palette])

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('bm_lang', lang) } catch { /* */ }
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggleLang = useCallback(() => setLangState(l => l === 'en' ? 'it' : 'en'), [])

  const setPalette = useCallback((p: string) => {
    if (PALETTES.includes(p)) setPaletteState(p)
  }, [])

  const cyclePalette = useCallback(() => {
    setPaletteState(prev => {
      const idx = PALETTES.indexOf(prev)
      const next = PALETTES[(idx + 1) % PALETTES.length]
      return next
    })
    blip(720, 0.06)
    setTimeout(() => blip(960, 0.06), 70)
  }, [])

  const handleSetMuted = useCallback((m: boolean) => {
    setMuted(m)
    setMutedState(m)
  }, [])

  const t = useCallback((key: string) => translate(lang, key), [lang])

  return (
    <BMContext.Provider value={{
      lang, setLang, toggleLang, t,
      palette, setPalette, cyclePalette,
      blip, chord,
      muted: mutedState, setMuted: handleSetMuted,
      PALETTES,
    }}>
      {children}
    </BMContext.Provider>
  )
}

export function useBM() {
  const ctx = useContext(BMContext)
  if (!ctx) throw new Error('useBM must be used inside BMProvider')
  return ctx
}
