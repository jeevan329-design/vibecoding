import React from 'react';
import { HandHeart, HeartHandshake, ArrowRight, BookOpen, Map, MapPin } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useT } from '../i18n';

export const HomePage: React.FC = () => {
  const { needs, situations, people, organizations, setActivePage, openPostNeedModal, openOfferHelpModal, selectEntity, openSituationRoom } = useCommunity();
  const { t } = useT();
  const open = needs.filter(n => n.status === 'open' || n.status === 'in_progress');
  const urgent = [...open].sort((a, b) => (a.urgency === 'today' ? -1 : 1) - (b.urgency === 'today' ? -1 : 1)).slice(0, 3);
  const active = situations.filter(s => s.status !== 'resolved');
  const stats = [[open.length, t('openReq')], [active.length, t('activeEff')], [people.length, t('helpers')], [organizations.length, t('orgs')]];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold">{t('greeting')} 🙏</h1>
        <p className="mt-1 text-[var(--slate)]">{t('welcome')}</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <button onClick={openPostNeedModal} className="text-left p-6 rounded-2xl bg-[var(--crimson)] text-white dark:text-[#1a0a0d] hover:opacity-95 transition">
            <HandHeart className="w-8 h-8 mb-3" /><div className="text-xl font-display font-bold">{t('ask')}</div>
            <div className="text-sm opacity-90 mt-1">{t('askDesc')}</div>
          </button>
          <button onClick={openOfferHelpModal} className="text-left p-6 rounded-2xl bg-[var(--teal)] text-white dark:text-[var(--paper)] hover:opacity-95 transition">
            <HeartHandshake className="w-8 h-8 mb-3" /><div className="text-xl font-display font-bold">{t('offer')}</div>
            <div className="text-sm opacity-90 mt-1">{t('offerDesc')}</div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {stats.map(([n, l]) => (
            <div key={l as string} className="card px-4 py-3"><div className="text-2xl font-display font-bold tabular-nums">{n}</div><div className="text-xs text-[var(--slate)]">{l}</div></div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xl font-bold">{t('needsYou')}</h2>
          <button onClick={() => setActivePage('needs')} className="text-sm text-[var(--teal)] font-medium flex items-center gap-1">{t('seeAll')} <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {urgent.map(n => (
            <button key={n.id} onClick={() => selectEntity('need', n.id)} className="card p-4 text-left hover:border-[var(--teal)] transition-colors">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.urgency === 'today' ? 'bg-[var(--urgent)]/15 text-[var(--urgent)]' : 'bg-[var(--need)]/20 text-[var(--need-text)]'}`}>{t(n.urgency)}</span>
              <div className="font-semibold mt-2 leading-snug">{n.title}</div>
              <div className="text-xs text-[var(--slate)] mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{n.locationApprox.areaName}</div>
            </button>
          ))}
          {!urgent.length && <p className="text-[var(--slate)]">{t('empty')}</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">{t('happening')}</h2>
        <div className="space-y-3">
          {active.map(s => {
            const pct = s.needsCount ? Math.round((s.needsMetCount / s.needsCount) * 100) : 0;
            return (
              <button key={s.id} onClick={() => openSituationRoom(s.id)} className="card w-full p-5 text-left hover:border-[var(--teal)] transition-colors">
                <div className="font-display font-bold text-lg">{s.title}</div>
                <p className="text-sm text-[var(--slate)] mt-1 line-clamp-2">{s.summary}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[var(--line)] overflow-hidden"><div className="h-full bg-[var(--resource)]" style={{ width: `${pct}%` }} /></div>
                  <span className="text-xs text-[var(--slate)] tabular-nums">{pct}% {t('progress')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {[['memory', BookOpen, 'storiesTitle', 'storiesDesc'], ['explore', Map, 'exploreTitle', 'exploreDesc']].map(([p, I, a, b]: any) => (
          <button key={p} onClick={() => setActivePage(p)} className="card p-5 text-left flex gap-4 hover:border-[var(--teal)] transition-colors">
            <I className="w-6 h-6 text-[var(--teal)] shrink-0 mt-0.5" />
            <div><div className="font-semibold">{t(a)}</div><div className="text-sm text-[var(--slate)]">{t(b)}</div></div>
          </button>
        ))}
      </section>
    </div>
  );
};
