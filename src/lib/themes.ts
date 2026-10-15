export type ThemeId = 'dark-space' | 'executive-gold' | 'emerald-discipline' | 'minimalist-crisp';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  swatch: string[];
  vars: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: 'dark-space',
    name: 'Orbit Dark Space',
    description: 'Deep space navy with cyan accents',
    swatch: ['#0a0e1a', '#22d3ee', '#34d399'],
    vars: {
      '--bg-base': '#0a0e1a',
      '--bg-card': 'rgba(255,255,255,0.03)',
      '--bg-card-hover': 'rgba(255,255,255,0.06)',
      '--border-subtle': 'rgba(255,255,255,0.1)',
      '--border-active': 'rgba(34,211,238,0.4)',
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255,255,255,0.5)',
      '--text-muted': 'rgba(255,255,255,0.3)',
      '--accent-primary': '#22d3ee',
      '--accent-secondary': '#34d399',
      '--accent-glow': 'rgba(34,211,238,0.12)',
      '--header-bg': 'rgba(10,14,26,0.9)',
    },
  },
  {
    id: 'executive-gold',
    name: 'Executive Gold',
    description: 'Charcoal black with warm gold highlights',
    swatch: ['#1a1610', '#d4a44c', '#e8c878'],
    vars: {
      '--bg-base': '#1a1610',
      '--bg-card': 'rgba(255,255,255,0.03)',
      '--bg-card-hover': 'rgba(255,255,255,0.06)',
      '--border-subtle': 'rgba(212,164,76,0.15)',
      '--border-active': 'rgba(212,164,76,0.4)',
      '--text-primary': '#f5f0e0',
      '--text-secondary': 'rgba(245,240,224,0.5)',
      '--text-muted': 'rgba(245,240,224,0.3)',
      '--accent-primary': '#d4a44c',
      '--accent-secondary': '#e8c878',
      '--accent-glow': 'rgba(212,164,76,0.12)',
      '--header-bg': 'rgba(26,22,16,0.9)',
    },
  },
  {
    id: 'emerald-discipline',
    name: 'Emerald Discipline',
    description: 'Forest dark with emerald green focus',
    swatch: ['#0d1a14', '#10b981', '#34d399'],
    vars: {
      '--bg-base': '#0d1a14',
      '--bg-card': 'rgba(255,255,255,0.03)',
      '--bg-card-hover': 'rgba(255,255,255,0.06)',
      '--border-subtle': 'rgba(16,185,129,0.15)',
      '--border-active': 'rgba(16,185,129,0.4)',
      '--text-primary': '#ecfdf5',
      '--text-secondary': 'rgba(236,253,245,0.5)',
      '--text-muted': 'rgba(236,253,245,0.3)',
      '--accent-primary': '#10b981',
      '--accent-secondary': '#34d399',
      '--accent-glow': 'rgba(16,185,129,0.12)',
      '--header-bg': 'rgba(13,26,20,0.9)',
    },
  },
  {
    id: 'minimalist-crisp',
    name: 'Minimalist Crisp',
    description: 'Light pearl with slate blue accents',
    swatch: ['#f5f6f8', '#3b82f6', '#64748b'],
    vars: {
      '--bg-base': '#f5f6f8',
      '--bg-card': 'rgba(255,255,255,0.8)',
      '--bg-card-hover': 'rgba(255,255,255,0.95)',
      '--border-subtle': 'rgba(0,0,0,0.08)',
      '--border-active': 'rgba(59,130,246,0.3)',
      '--text-primary': '#1e293b',
      '--text-secondary': 'rgba(30,41,59,0.55)',
      '--text-muted': 'rgba(30,41,59,0.35)',
      '--accent-primary': '#3b82f6',
      '--accent-secondary': '#64748b',
      '--accent-glow': 'rgba(59,130,246,0.08)',
      '--header-bg': 'rgba(245,246,248,0.9)',
    },
  },
];

export function applyTheme(themeId: ThemeId) {
  const theme = themes.find((t) => t.id === themeId) || themes[0];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute('data-theme', themeId);
}

export function getThemeById(id: ThemeId): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}
