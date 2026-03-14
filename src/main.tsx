import React from 'react'
import ReactDOM from 'react-dom/client'
let gsap: typeof import('gsap') | null = null;
let ScrollTrigger: typeof import('gsap/ScrollTrigger') | null = null;
let useGSAP: typeof import('@gsap/react') | null = null;
import App from './App.tsx'
import './index.css'



const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
if (!isMobile) {
  gsap = require('gsap');
  ScrollTrigger = require('gsap/ScrollTrigger');
  useGSAP = require('@gsap/react');
  if (gsap && ScrollTrigger && useGSAP) {
    (gsap as any).registerPlugin(ScrollTrigger, useGSAP);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      (gsap as any).defaults({ duration: 0, delay: 0 });
      if ((ScrollTrigger as any).config) {
        (ScrollTrigger as any).config({ ignoreMobileResize: true });
      }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
