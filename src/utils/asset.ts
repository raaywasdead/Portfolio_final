/**
 * Retorna o caminho correto para assets na pasta public/,
 * levando em conta o base URL do Vite (ex: /Portfolio_final/).
 */
export const asset = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const base = import.meta.env.BASE_URL
  const baseWithSlash = base.endsWith('/') ? base : base + '/'
  return `${baseWithSlash}${cleanPath}`
}
