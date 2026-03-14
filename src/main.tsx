import React from 'react'
import ReactDOM from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import App from './App.tsx'
import './index.css'


const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
if (!isMobile) {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.defaults({ duration: 0, delay: 0 });
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
