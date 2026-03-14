let ScrollTrigger: typeof import('gsap/ScrollTrigger') | null = null;
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
if (!isMobile) {
  ScrollTrigger = require('gsap/ScrollTrigger');
}
import { LanguageProvider } from './contexts/LanguageContext'
import { LoadingScreen } from './components/LoadingScreen'
import { Background } from './components/Background'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Services } from './components/Services'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { ScrollProgress } from './components/ScrollProgress'
import { useState } from 'react'

// A LoadingScreen já é fixed z-[9999], então overlay o conteúdo sem precisar
// esconder o wrapper — isso evita que o ScrollTrigger calcule posições erradas.
function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
    setTimeout(() => {
      if (!isMobile && ScrollTrigger && typeof (ScrollTrigger as any).refresh === 'function') {
        (ScrollTrigger as any).refresh();
      }
    }, 100);
  }

  return (
    <LanguageProvider>
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadComplete} />}

      <a href="#inicio" className="skip-link">Pular para o conteúdo</a>

      <Background />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="relative z-10">
        <Navbar />
        <main id="main-content">
          <Hero />
          <div className="section-divider" />
          <About />
          <div className="section-divider" />
          <Services />
          <div className="section-divider" />
          <Projects />
          <div className="section-divider" />
          <Contact />
        </main>
        <Footer />
      </div>

      <ScrollToTop />
      <ScrollProgress />
    </>
    </LanguageProvider>
  )
}

export default App
