import React from 'react';
import { useCommunity } from '../context/CommunityContext';
import { Heart, HandHeart, Users, Wrench, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const HeroNeighbourhood: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { openPostNeedModal, openOfferHelpModal, needs, resources, people } = useCommunity();

  const openNeedsCount = needs.filter(n => n.status === 'open').length;
  const availableResourcesCount = resources.filter(r => r.status === 'available').length;
  const activeParticipantsCount = people.length + 18;

  return (
    <section className="pt-8 pb-10 border-b border-[#D9CFB9] dark:border-[#243E3B] bg-[#FAF6EE] dark:bg-[#10201F] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Warm & Welcoming Friendly Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D6] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] text-xs font-medium text-[#1F5C5A] dark:text-[#5FB3AE]">
          <Heart className="w-3.5 h-3.5 text-[#C8372D] fill-current" />
          <span>A friendly community space where neighbours look out for each other</span>
        </div>

        {/* Hero Main Copy: Clear, simple, humane */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] leading-[1.15] tracking-tight">
            Neighbours helping neighbours. Simple as that.
          </h1>

          <p className="text-base sm:text-lg text-[#5B6B6E] dark:text-[#8F9FA1] leading-relaxed">
            When someone in our neighbourhood needs a hand—whether it&apos;s drinking water, a ride, spare tools, or an hour of time—Common Thread connects what&apos;s needed with people nearby who are ready to help.
          </p>

          {/* Everyday Friendly Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={openPostNeedModal}
              className="px-5 py-3 text-sm font-semibold rounded-xl bg-[#F2A93B] text-[#1F2A2E] hover:bg-[#e69e32] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Ask for Help (takes 1 minute)
            </button>

            <button
              onClick={openOfferHelpModal}
              className="px-5 py-3 text-sm font-semibold rounded-xl bg-[#2B7A50] text-white hover:bg-[#236843] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              I Have Something to Share
            </button>

            <button
              onClick={onExploreClick}
              className="px-4 py-3 text-sm font-semibold rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] text-[#1F5C5A] dark:text-[#5FB3AE] border border-[#D9CFB9] dark:border-[#243E3B] hover:bg-[#EFE7D6] dark:hover:bg-[#243E3B] transition-colors cursor-pointer"
            >
              See What&apos;s Happening Nearby &darr;
            </button>
          </div>
        </div>

        {/* Everyday Community Pulse: What is happening right now */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F2A93B]" />
              <span className="text-xs font-semibold text-[#5B6B6E] dark:text-[#8F9FA1]">Requests for Help</span>
            </div>
            <div className="text-2xl font-bold font-display text-[#1F2A2E] dark:text-[#F3EEE2] tabular-nums">
              {openNeedsCount}
            </div>
            <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
              Water containers, elderly check-ins, pump repair
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3E9B6B]" />
              <span className="text-xs font-semibold text-[#5B6B6E] dark:text-[#8F9FA1]">Offers & Capacity</span>
            </div>
            <div className="text-2xl font-bold font-display text-[#1F2A2E] dark:text-[#F3EEE2] tabular-nums">
              {availableResourcesCount}
            </div>
            <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
              Trucks, storage space, volunteer hours, tools
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F5C5A]" />
              <span className="text-xs font-semibold text-[#5B6B6E] dark:text-[#8F9FA1]">Neighbours Pitching In</span>
            </div>
            <div className="text-2xl font-bold font-display text-[#1F2A2E] dark:text-[#F3EEE2] tabular-nums">
              {activeParticipantsCount}
            </div>
            <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
              Residents, local schools, plumbers, and youth clubs
            </p>
          </div>

        </div>

        {/* 3 Plain-Language Ways It Works */}
        <div className="p-5 rounded-2xl bg-[#EFE7D6]/60 dark:bg-[#172A29]/60 border border-[#D9CFB9] dark:border-[#243E3B] space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE]">
            How this helps our neighbourhood
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <strong className="text-[#1F2A2E] dark:text-[#F3EEE2] text-sm font-bold block">
                1. Ask without feeling awkward
              </strong>
              <p className="text-[#5B6B6E] dark:text-[#8F9FA1] leading-relaxed">
                Post what you or an elderly neighbour needs. No long bureaucratic forms, no red tape, and your private address is never shown publicly.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-[#1F2A2E] dark:text-[#F3EEE2] text-sm font-bold block">
                2. Share whatever you have
              </strong>
              <p className="text-[#5B6B6E] dark:text-[#8F9FA1] leading-relaxed">
                Spare tools in the shed, a folding table, an hour of free time this weekend, or a pickup truck. In a community, small things add up fast.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-[#1F2A2E] dark:text-[#F3EEE2] text-sm font-bold block">
                3. Work together, avoid duplicate effort
              </strong>
              <p className="text-[#5B6B6E] dark:text-[#8F9FA1] leading-relaxed">
                See what local schools and volunteers are already doing so three people don&apos;t bring the same thing while something else is forgotten.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
