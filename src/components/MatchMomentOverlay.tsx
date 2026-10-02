import React from 'react';
import { useCommunity } from '../context/CommunityContext';
import { Check } from 'lucide-react';

export const MatchMomentOverlay: React.FC = () => {
  const { matchCelebration } = useCommunity();

  if (!matchCelebration) return null;

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none">
      <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#1F5C5A] shadow-lg max-w-sm text-left flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2B7A50] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </div>

        <div className="space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE]">
            Match Confirmed
          </div>
          <div className="text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] line-clamp-1">
            {matchCelebration.needTitle}
          </div>
          <div className="text-[11px] text-[#2B7A50] line-clamp-1">
            Connected with {matchCelebration.resourceTitle}
          </div>
        </div>
      </div>
    </div>
  );
};
