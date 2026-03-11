declare module 'vanta/dist/vanta.net.min.js' {
  const VANTA: (opts: Record<string, unknown>) => { destroy: () => void }
  export default VANTA
}

declare module 'vanta/dist/vanta.fog.min.js' {
  const VANTA: (opts: Record<string, unknown>) => { destroy: () => void }
  export default VANTA
}
