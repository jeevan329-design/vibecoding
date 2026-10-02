import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { AlertCircle, Filter, MapPin, Clock, Plus, Check } from 'lucide-react';
import { UrgencyLevel } from '../types';

export const NeedsPage: React.FC = () => {
  const { needs, selectEntity, openPostNeedModal, openOfferHelpModal } = useCommunity();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  const filteredNeeds = needs.filter(n => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (selectedUrgency !== 'all' && n.urgency !== selectedUrgency) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9CFB9] dark:border-[#243E3B]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F2A93B] mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Community Requests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
            Requests from Neighbours
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B6E] dark:text-[#8F9FA1] mt-1">
            Simple requests from people and local groups nearby. Tap any card to help.
          </p>
        </div>

        <button
          onClick={openPostNeedModal}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#F2A93B] text-[#1F2A2E] hover:bg-[#e69e32] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>I Need Help</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-[#5B6B6E]">Category:</span>
        {(['all', 'water', 'food', 'shelter', 'transport', 'tools', 'health', 'care'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1F5C5A] text-white font-semibold'
                : 'bg-[#EFE7D6]/60 dark:bg-[#172A29] text-[#5B6B6E] hover:text-[#1F2A2E]'
            }`}
          >
            {cat}
          </button>
        ))}

        <span className="font-semibold text-[#5B6B6E] ml-2">Urgency:</span>
        {(['all', 'today', 'this_week', 'ongoing'] as const).map(u => (
          <button
            key={u}
            onClick={() => setSelectedUrgency(u)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
              selectedUrgency === u
                ? 'bg-[#1F5C5A] text-white font-semibold'
                : 'bg-[#EFE7D6]/60 dark:bg-[#172A29] text-[#5B6B6E] hover:text-[#1F2A2E]'
            }`}
          >
            {u.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNeeds.map(need => (
          <div
            key={need.id}
            onClick={() => selectEntity('need', need.id)}
            className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs hover:border-[#1F5C5A] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8A5A00] dark:text-[#F5B84F] bg-[#F2A93B]/20 px-2 py-0.5 rounded-md">
                  {need.category}
                </span>

                <span
                  className={`text-[11px] font-bold ${
                    need.urgency === 'today' ? 'text-[#C8372D]' : 'text-[#5B6B6E]'
                  }`}
                >
                  {need.urgency === 'today' ? 'Needed Today' : need.urgency.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2A2E] dark:text-[#F3EEE2] group-hover:text-[#1F5C5A] dark:group-hover:text-[#5FB3AE] transition-colors leading-snug">
                {need.title}
              </h3>

              <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2 leading-relaxed">
                {need.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#D9CFB9]/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#5B6B6E]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{need.locationApprox.areaName}</span>
              </div>

              <span className="text-[#2B7A50] font-semibold group-hover:underline">
                Offer Help &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
