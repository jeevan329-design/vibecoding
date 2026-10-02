import React from 'react';
import { useCommunity } from '../context/CommunityContext';
import { MapPin, Users, CheckCircle, Clock, Sparkles, ArrowRight, Plus } from 'lucide-react';

export const SituationsPage: React.FC = () => {
  const { situations, openSituationRoom, openPostNeedModal } = useCommunity();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9CFB9] dark:border-[#243E3B]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5C5A] dark:bg-[#5FB3AE]" />
            <span>Coordinated Efforts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
            Community Situations
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B6E] dark:text-[#8F9FA1] mt-1">
            Situations unite related requests, capacity, volunteers, and organizations under a single coordinated response room.
          </p>
        </div>

        <button
          onClick={openPostNeedModal}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#F2A93B] text-[#1F2A2E] hover:bg-[#e69e32] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Challenge</span>
        </button>
      </div>

      {/* Grid of Situations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {situations.map(situation => {
          const totalNeeds = situation.needsCount || 1;
          const metNeeds = situation.needsMetCount || 0;
          const progressPercent = Math.min(100, Math.round((metNeeds / totalNeeds) * 100));

          return (
            <div
              key={situation.id}
              onClick={() => openSituationRoom(situation.id)}
              className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-sm hover:border-[#1F5C5A] transition-all flex flex-col justify-between space-y-5 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1F5C5A] dark:text-[#5FB3AE] bg-[#1F5C5A]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
                    {situation.status}
                  </span>
                  <span className="text-[#5B6B6E] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{situation.area.areaName}</span>
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] group-hover:text-[#1F5C5A] dark:group-hover:text-[#5FB3AE] transition-colors">
                  {situation.title}
                </h3>

                <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-3 leading-relaxed">
                  {situation.summary}
                </p>
              </div>

              {/* Progress Bar & CTA */}
              <div className="pt-3 border-t border-[#D9CFB9]/60 dark:border-[#243E3B]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#1F2A2E] dark:text-[#F3EEE2] tabular-nums">
                    {metNeeds} of {totalNeeds} needs met ({progressPercent}%)
                  </span>
                  <span className="text-[#1F5C5A] dark:text-[#5FB3AE] group-hover:underline flex items-center gap-1">
                    <span>Situation Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#D9CFB9]/50 dark:bg-[#243E3B] overflow-hidden">
                  <div
                    className="h-full bg-[#3E9B6B] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
