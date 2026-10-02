import React from 'react';
import { CommunityProvider, useCommunity } from './context/CommunityContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LangProvider, useT } from './i18n';
import { NetworkHome } from './components/NetworkHome';
import { SituationsPage } from './components/SituationsPage';
import { SituationRoom } from './components/SituationRoom';
import { NeedsPage } from './components/NeedsPage';
import { CommonsPage } from './components/CommonsPage';
import { MemoryPage } from './components/MemoryPage';
import { MySpacePage } from './components/MySpacePage';
import { NodeDetailPanel } from './components/NodeDetailPanel';
import { PostNeedModal } from './components/PostNeedModal';
import { OfferHelpModal } from './components/OfferHelpModal';
import { CloseLoopModal } from './components/CloseLoopModal';
import { MatchMomentOverlay } from './components/MatchMomentOverlay';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OrgConsoleModal } from './components/OrgConsoleModal';
import { TrustSafetyModal } from './components/TrustSafetyModal';
import { Check, X, RotateCcw, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { t } = useT();
  const { activePage, toastMessage, dismissToast, resetToSeedData, openTrustSafetyModal } = useCommunity();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] transition-colors pb-16 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-[var(--paper)]">{t('skip')}</a>
      
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main View Container */}
      <main id="main" className="flex-1">
        {activePage === 'network' && <HomePage />}
        {activePage === 'explore' && <NetworkHome />}
        {activePage === 'situations' && <SituationsPage />}
        {activePage === 'situation-room' && <SituationRoom />}
        {activePage === 'needs' && <NeedsPage />}
        {activePage === 'commons' && <CommonsPage />}
        {activePage === 'memory' && <MemoryPage />}
        {activePage === 'my-space' && <MySpacePage />}
      </main>

      {/* Slide-over Detail Panel */}
      <NodeDetailPanel />

      {/* Action Modals */}
      <PostNeedModal />
      <OfferHelpModal />
      <CloseLoopModal />
      <GlobalSearchModal />
      <OrgConsoleModal />
      <TrustSafetyModal />

      {/* 1-Second Match Moment Sparkle Overlay */}
      <MatchMomentOverlay />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl bg-[#1F2A2E] dark:bg-[#FAF6EE] text-[#FAF6EE] dark:text-[#1F2A2E] shadow-2xl flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#3E9B6B] shrink-0" />
            <span className="font-medium leading-relaxed">{toastMessage}</span>
          </div>
          <button
            onClick={dismissToast}
            className="p-1 rounded-md text-[#5B6B6E] hover:text-[#FAF6EE] dark:hover:text-[#1F2A2E]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subtle Civic Footer */}
      <footer className="border-t border-[#D9CFB9] dark:border-[#243E3B] bg-[#EFE7D6]/40 dark:bg-[#172A29]/40 py-6 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">{t('brand')}</span>
            <span>·</span>
            <span>{t('footer')}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openTrustSafetyModal}
              className="hover:text-[#1F5C5A] dark:hover:text-[#5FB3AE] flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('trust')}</span>
            </button>

            <button
              onClick={resetToSeedData}
              className="hover:text-[#C8372D] flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset all changes to original Riverside Water Shortage seed scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('reset')}</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <LangProvider>
      <CommunityProvider>
        <AppContent />
      </CommunityProvider>
    </LangProvider>
  );
}
