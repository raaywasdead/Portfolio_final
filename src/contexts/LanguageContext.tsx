import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'pt' | 'en'

interface LangCtx {
  lang: Lang
  toggle: () => void
}

const LanguageContext = createContext<LangCtx>({ lang: 'pt', toggle: () => {} })

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('pt')
  return (
    <LanguageContext.Provider value={{ lang, toggle: () => setLang(l => l === 'pt' ? 'en' : 'pt') }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
