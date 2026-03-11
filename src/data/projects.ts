export interface Project {
  id: string
  title: string
  badge?: string
  description: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  image: string
}

export const projects: Project[] = [
  {
    id: 'tcc-aurorus',
    title: 'TCC Aurorus',
    badge: 'Apresentado no Criatech 2025',
    description:
      'TCC do curso de Desenvolvimento Web no IOS — entre 10 grupos, um dos 6 selecionados para o CRIATECH na PUCRS. Liderei a equipe e fui responsável pela maior parte do front-end.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Design Responsivo'],
    liveUrl: 'https://raaywasdead.github.io/tcc_aurorus-final/',
    githubUrl: 'https://github.com/raaywasdead/tcc_aurorus-final',
    image: 'IMG/tcc-aurorus.webp',
  },
  {
    id: 'orbyt',
    title: 'Orbyt',
    badge: 'Full Stack',
    description:
      'Sistema de produtividade pessoal completo — tarefas, progresso e recompensas construído para quem leva a sério. Desenvolvido do zero com React, TypeScript, Node.js e PostgreSQL. Inclui autenticação via Google OAuth 2.0, login com e-mail/senha (bcrypt), API REST completa e deploy em produção no Railway.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Google OAuth 2.0', 'REST API'],
    liveUrl: 'https://orbyt.up.railway.app/',
    githubUrl: 'https://github.com/raaywasdead/Orbyt-App',
    image: 'IMG/orbyt.webp',
  },
  {
    id: 'deltarune-archive',
    title: 'Deltarune Character Archive',
    badge: 'Fan Project',
    description:
      'Site interativo fan-made dos personagens de Deltarune, o RPG de Toby Fox. Cada página traz lore, stats e sprites com identidade visual e sonora fiel ao jogo. Esconde um mini ARG envolvendo W.D. Gaster para quem explorar com atenção.',
    tags: ['React', 'TypeScript', 'CSS3', 'JavaScript'],
    liveUrl: 'https://deltarune-archive.vercel.app',
    githubUrl: 'https://github.com/raaywasdead/deltarune-archive',
    image: 'IMG/deltarune-c.archive.webp',
  },
]
