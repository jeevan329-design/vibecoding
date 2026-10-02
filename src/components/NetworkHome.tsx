import React from 'react';
import { useCommunity } from '../context/CommunityContext';
import { HeroNeighbourhood } from './HeroNeighbourhood';
import { CoordinationLoop } from './CoordinationLoop';
import {
  AlertCircle,
  Package,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  Users
} from 'lucide-react';

export const NetworkHome: React.FC = () => {
  const {
    needs,
    resources,
    situations,
    openSituationRoom,
    selectEntity,
    openPostNeedModal,
    openOfferHelpModal,
    setActivePage
  } = useCommunity();

  const urgentNeeds = needs.filter(n => n.urgency === 'today' && n.status === 'open').slice(0, 4);
  const activeEfforts = situations.filter(s => s.status === 'active').slice(0, 3);
  const readyResources = resources.filter(r => r.status === 'available').slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Warm Hero Banner */}
      <HeroNeighbourhood onExploreClick={() => {
        const el = document.getElementById('urgent-needs-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* 2. Urgent Needs Right Now */}
        <section id="urgent-needs-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9CFB9] dark:border-[#243E3B]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A5A00] dark:text-[#F5B84F]">
                <span className="w-2 h-2 rounded-full bg-[#C8372D]" />
                <span>Urgent Requests Today</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] mt-0.5">
                Who Needs Help
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('needs')}
                className="text-xs font-semibold text-[#1F5C5A] dark:text-[#5FB3AE] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>See all requests ({needs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={openPostNeedModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F2A93B] text-[#1F2A2E] hover:bg-[#e69e32] transition-colors cursor-pointer"
              >
                + Ask for Something
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgentNeeds.map(need => (
              <div
                key={need.id}
                onClick={() => selectEntity('need', need.id)}
                className="p-5 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs hover:border-[#1F5C5A] transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8A5A00] dark:text-[#F5B84F] bg-[#F2A93B]/20 px-2 py-0.5 rounded-md capitalize">
                      {need.category}
                    </span>
                    <span className="text-[#C8372D] font-bold text-[11px]">Needed Today</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2] group-hover:text-[#1F5C5A] transition-colors line-clamp-2">
                    {need.title}
                  </h3>

                  <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2 leading-relaxed">
                    {need.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D9CFB9]/50 flex items-center justify-between text-xs">
                  <span className="text-[#5B6B6E] text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{need.locationApprox.areaName}</span>
                  </span>

                  <span className="text-[#2B7A50] font-semibold text-[11px] group-hover:underline">
                    Help with this &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Current Community Projects */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9CFB9] dark:border-[#243E3B]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE]">
                <span>Active Efforts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] mt-0.5">
                Current Community Projects
              </h2>
            </div>

            <button
              onClick={() => setActivePage('situations')}
              className="text-xs font-semibold text-[#1F5C5A] dark:text-[#5FB3AE] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all projects ({situations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeEfforts.map(situation => {
              const totalNeeds = situation.needsCount || 1;
              const metNeeds = situation.needsMetCount || 0;
              const progressPercent = Math.min(100, Math.round((metNeeds / totalNeeds) * 100));

              return (
                <div
                  key={situation.id}
                  onClick={() => openSituationRoom(situation.id)}
                  className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs hover:border-[#1F5C5A] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6B6E] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1F5C5A]" />
                        <span>{situation.area.areaName}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F5C5A] bg-[#1F5C5A]/10 px-2 py-0.5 rounded-md">
                        {situation.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1F2A2E] dark:text-[#F3EEE2] group-hover:text-[#1F5C5A] transition-colors leading-snug">
                      {situation.title}
                    </h3>

                    <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2 leading-relaxed">
                      {situation.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9CFB9]/50 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                      <span>{metNeeds} of {totalNeeds} requests resolved</span>
                      <span>{progressPercent}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#D9CFB9]/50 dark:bg-[#243E3B] overflow-hidden">
                      <div
                        className="h-full bg-[#3E9B6B] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Ready Tools & Capacity to Share */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9CFB9] dark:border-[#243E3B]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2B7A50] dark:text-[#6CC594]">
                <span>Organizations & Volunteers</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] mt-0.5">
                Organizations and Volunteers Prepared to Make a Change
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('commons')}
                className="text-xs font-semibold text-[#1F5C5A] dark:text-[#5FB3AE] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all resources ({resources.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={openOfferHelpModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2B7A50] text-white hover:bg-[#236843] transition-colors cursor-pointer"
              >
                + Offer Something
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {readyResources.map(res => (
              <div
                key={res.id}
                onClick={() => selectEntity('resource', res.id)}
                className="p-5 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs hover:border-[#3E9B6B] transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2B7A50] bg-[#3E9B6B]/15 px-2 py-0.5 rounded-md capitalize">
                      {res.kind}
                    </span>
                    <span className="text-[11px] text-[#5B6B6E]">{res.quantity}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2] group-hover:text-[#2B7A50] transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D9CFB9]/50 flex items-center justify-between text-xs">
                  <span className="text-[#5B6B6E] text-[11px]">
                    By {res.ownerName}
                  </span>

                  <span className="text-[#1F5C5A] font-semibold text-[11px] group-hover:underline">
                    Use resource &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. How It Works (Step by Step) */}
        <CoordinationLoop />

      </div>

    </div>
  );
};
