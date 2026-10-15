import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  UserCircle2,
  Trophy,
  Check,
  Lock,
  Sparkles,
  Orbit as OrbitIcon,
  Github,
  Twitter,
  Mail,
} from 'lucide-react';
import { themes, applyTheme, type ThemeId } from '@/lib/themes';
import { avatars, badges, tierColors } from '@/lib/cosmetics';
import { supabase } from '@/lib/supabase';

interface ThemeSettingsProps {
  userName: string;
}

const THEME_KEY = 'orbit-theme';
const AVATAR_KEY = 'orbit-avatar';

function loadTheme(): ThemeId {
  const saved = localStorage.getItem(THEME_KEY) as ThemeId | null;
  if (saved) {
    applyTheme(saved);
    return saved;
  }
  applyTheme('dark-space');
  return 'dark-space';
}

function loadAvatar(): string {
  return localStorage.getItem(AVATAR_KEY) || 'monk';
}

export default function ThemeSettings({ userName }: ThemeSettingsProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('dark-space');
  const [activeAvatar, setActiveAvatar] = useState('monk');
  const [streak, setStreak] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);

  useEffect(() => {
    const theme = loadTheme();
    setActiveTheme(theme);
    setActiveAvatar(loadAvatar());

    (async () => {
      const [streakRes, logsRes] = await Promise.all([
        supabase
          .from('streaks')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from('completion_logs').select('*'),
      ]);

      if (streakRes.data) setStreak((streakRes.data as { current_streak: number }).current_streak);
      setTotalCompletions(logsRes.data?.length || 0);
    })();
  }, []);

  const handleThemeSelect = (id: ThemeId) => {
    setActiveTheme(id);
    applyTheme(id);
    localStorage.setItem(THEME_KEY, id);
  };

  const handleAvatarSelect = (id: string) => {
    setActiveAvatar(id);
    localStorage.setItem(AVATAR_KEY, id);
  };

  // Determine which badges are unlocked
  const unlockedBadges = new Set<string>();
  if (totalCompletions >= 1) unlockedBadges.add('first-step');
  if (streak >= 3) unlockedBadges.add('consistent');
  if (streak >= 7) unlockedBadges.add('week-warrior');
  if (streak >= 30) unlockedBadges.add('monk-mode');
  if (streak >= 100) unlockedBadges.add('orbit-master');
  if (totalCompletions >= 100) unlockedBadges.add('centurion');
  if (streak >= 60) unlockedBadges.add('unbreakable');
  // speed-demon is a stretch goal — not mechanically tracked yet

  const firstName = userName.split(' ')[0] || 'there';
  const selectedAvatar = avatars.find((a) => a.id === activeAvatar) || avatars[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Themes & Customization
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Sparkles size={13} />
          {firstName}, personalize your Orbit experience
        </p>
      </motion.div>

      {/* Theme Selector */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <Palette size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Theme
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                  isActive ? 'shadow-lg' : ''
                }`}
                style={{
                  borderColor: isActive ? theme.vars['--accent-primary'] : theme.vars['--border-subtle'],
                  background: theme.vars['--bg-card'],
                  boxShadow: isActive ? `0 8px 32px ${theme.vars['--accent-glow']}` : undefined,
                }}
              >
                {/* Swatch preview */}
                <div className="mb-4 flex gap-2">
                  {theme.swatch.map((color) => (
                    <div
                      key={color}
                      className="h-8 w-8 rounded-lg"
                      style={{ backgroundColor: color, boxShadow: `0 2px 8px ${color}40` }}
                    />
                  ))}
                </div>

                <h3 className="text-sm font-semibold" style={{ color: theme.vars['--text-primary'] }}>
                  {theme.name}
                </h3>
                <p className="mt-1 text-xs" style={{ color: theme.vars['--text-secondary'] }}>
                  {theme.description}
                </p>

                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.vars['--accent-primary'] }}
                  >
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Avatar Selector */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <UserCircle2 size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Discipline Avatar
          </h2>
        </div>

        {/* Current avatar preview */}
        <div
          className="mb-4 flex items-center gap-4 rounded-xl border p-4"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${selectedAvatar.gradient} shadow-lg`}>
            <selectedAvatar.icon size={26} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {selectedAvatar.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {selectedAvatar.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {avatars.map((avatar) => {
            const isActive = activeAvatar === avatar.id;
            return (
              <motion.button
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-300`}
                style={{
                  borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: isActive ? 'var(--accent-glow)' : 'var(--bg-card)',
                }}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${avatar.gradient} shadow-md`}>
                  <avatar.icon size={22} className="text-white" />
                </div>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {avatar.name}
                </span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Achievement Badges */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <Trophy size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Achievement Badges
          </h2>
          <span
            className="ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }}
          >
            {unlockedBadges.size} / {badges.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {badges.map((badge) => {
            const unlocked = unlockedBadges.has(badge.id);
            const tier = tierColors[badge.tier];
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={unlocked ? { y: -4 } : undefined}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300`}
                style={{
                  borderColor: unlocked ? undefined : 'var(--border-subtle)',
                  background: unlocked ? undefined : 'var(--bg-card)',
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                {unlocked ? (
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-10`} />
                ) : null}

                <div className="relative">
                  <div
                    className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      unlocked ? `bg-gradient-to-br ${badge.gradient} shadow-lg` : 'bg-white/5'
                    }`}
                  >
                    {unlocked ? (
                      <badge.icon size={26} className="text-white" />
                    ) : (
                      <Lock size={20} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>

                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {badge.name}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {badge.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${tier.text}`}>
                      {tier.label}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {badge.requirement}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
        >
          <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Current Streak
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
            {streak}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>days</p>
        </div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
        >
          <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Total Completions
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
            {totalCompletions}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>habits done</p>
        </div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
        >
          <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Badges Earned
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
            {unlockedBadges.size}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>of {badges.length}</p>
        </div>
      </motion.div>

      {/* Custom Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border-t pt-8"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo + slogan */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ background: 'var(--accent-glow)', filter: 'blur(8px)' }} />
              <OrbitIcon size={28} className="relative" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Orbit
              </p>
              <p className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Your habit in orbit
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Support
            </a>
            <div className="flex items-center gap-3">
              <a href="#" className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                <Github size={16} />
              </a>
              <a href="#" className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                <Twitter size={16} />
              </a>
              <a href="#" className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
          © 2026 Orbit. All habits reserved. Built with discipline.
        </p>
      </motion.footer>
    </div>
  );
}
