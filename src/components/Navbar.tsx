import React, { useState } from 'react';
import { Home, HandHeart, Users, Boxes, User, Search, Moon, Sun, Plus, Languages, BookOpen, Map, ChevronDown } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useT, Key } from '../i18n';

type Page = 'network' | 'needs' | 'situations' | 'commons' | 'my-space' | 'memory' | 'explore';
const MAIN: { id: Page; label: Key; icon: any }[] = [
  { id: 'network', label: 'home', icon: Home },
  { id: 'needs', label: 'requests', icon: HandHeart },
  { id: 'situations', label: 'efforts', icon: Users },
  { id: 'commons', label: 'resources', icon: Boxes },
];
const MORE: { id: Page; label: Key; icon: any }[] = [
  { id: 'memory', label: 'stories', icon: BookOpen },
  { id: 'explore', label: 'explore', icon: Map },
];

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, theme, toggleTheme, openSearchModal, openPostNeedModal } = useCommunity();
  const { t, lang, toggleLang } = useT();
  const [moreOpen, setMoreOpen] = useState(false);
  const cur = activePage === 'situation-room' ? 'situations' : activePage;
  const icon = 'p-2 rounded-lg text-[var(--slate)] hover:bg-[var(--sand)] hover:text-[var(--ink)] transition-colors';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="dhaka-strip" />
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center gap-4">
          <button onClick={() => setActivePage('network')} className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-[var(--crimson)] text-white grid place-items-center font-display font-bold">{lang === 'ne' ? 'सा' : 'C'}</span>
            <span className="font-display font-bold text-lg hidden sm:block">{t('brand')}</span>
          </button>

          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main">
            {MAIN.map(({ id, label }) => (
              <button key={id} onClick={() => setActivePage(id)} aria-current={cur === id ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${cur === id ? 'bg-[var(--teal)] text-white dark:text-[var(--paper)]' : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--sand)]'}`}>
                {t(label)}
              </button>
            ))}
            <div className="relative">
              <button onClick={() => setMoreOpen(o => !o)} onBlur={() => setTimeout(() => setMoreOpen(false), 120)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--slate)] hover:bg-[var(--sand)] flex items-center gap-1">
                {t('more')} <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreOpen && (
                <div className="absolute top-full mt-1 w-48 card p-1 shadow-lg">
                  {MORE.map(({ id, label, icon: I }) => (
                    <button key={id} onMouseDown={() => setActivePage(id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--paper)]">
                      <I className="w-4 h-4 text-[var(--teal)]" /> {t(label)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button onClick={openSearchModal} className={icon} aria-label={t('search')}><Search className="w-5 h-5" /></button>
            <button onClick={toggleLang} className={`${icon} flex items-center gap-1 text-xs font-semibold`} aria-label="Language"><Languages className="w-5 h-5" />{lang === 'en' ? 'ने' : 'EN'}</button>
            <button onClick={toggleTheme} className={icon} aria-label={t('theme')}>{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => setActivePage('my-space')} className={`${icon} hidden md:block`} aria-label={t('me')}><User className="w-5 h-5" /></button>
            <button onClick={openPostNeedModal} className="hidden sm:flex ml-2 items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--crimson)] text-white dark:text-[#1a0a0d] text-sm font-semibold hover:opacity-90">
              <Plus className="w-4 h-4" /> {t('ask')}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--paper)] border-t border-[var(--line)] grid grid-cols-5" aria-label="Main">
        {[...MAIN, { id: 'my-space' as Page, label: 'me' as Key, icon: User }].map(({ id, label, icon: I }) => (
          <button key={id} onClick={() => setActivePage(id)} aria-current={cur === id ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${cur === id ? 'text-[var(--teal)] font-semibold' : 'text-[var(--slate)]'}`}>
            <I className="w-5 h-5" />{t(label)}
          </button>
        ))}
      </nav>
    </>
  );
};
