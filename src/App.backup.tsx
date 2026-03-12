import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
import { useState } from 'react'

// A LoadingScreen já é fixed z-[9999], então overlay o conteúdo sem precisar
// esconder o wrapper — isso evita que o ScrollTrigger calcule posições erradas.
function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadComplete} />}

      <a href="#inicio" className="skip-link">Pular para o conteúdo</a>

      <Background />

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
    </>
  )
}

export default App
