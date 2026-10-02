import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { Package, Filter, MapPin, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResourceKind } from '../types';

export const CommonsPage: React.FC = () => {
  const { resources, selectEntity, openOfferHelpModal } = useCommunity();
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [showIdleOnly, setShowIdleOnly] = useState<boolean>(false);

  const filteredResources = resources.filter(r => {
    if (selectedKind !== 'all' && r.kind !== selectedKind) return false;
    if (showIdleOnly && r.status !== 'idle') return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9CFB9] dark:border-[#243E3B]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2B7A50] dark:text-[#6CC594] mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Shared Resources</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
            Tools, Spaces & Capacity to Share
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B6E] dark:text-[#8F9FA1] mt-1">
            Vehicles, spare equipment, halls, and volunteer time that neighbours have offered to share.
          </p>
        </div>

        <button
          onClick={openOfferHelpModal}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2B7A50] text-white hover:bg-[#236843] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Offer a Tool or Help</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-[#5B6B6E]">Kind:</span>
        {(['all', 'time', 'skill', 'space', 'equipment', 'supplies', 'vehicle', 'knowledge', 'money'] as const).map(k => (
          <button
            key={k}
            onClick={() => setSelectedKind(k)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
              selectedKind === k
                ? 'bg-[#1F5C5A] text-white font-semibold'
                : 'bg-[#EFE7D6]/60 dark:bg-[#172A29] text-[#5B6B6E] hover:text-[#1F2A2E]'
            }`}
          >
            {k}
          </button>
        ))}

        <button
          onClick={() => setShowIdleOnly(!showIdleOnly)}
          className={`ml-auto px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
            showIdleOnly
              ? 'bg-[#3E9B6B] text-white border-[#3E9B6B]'
              : 'bg-[#FAF6EE] dark:bg-[#172A29] border-[#D9CFB9] dark:border-[#243E3B] text-[#5B6B6E]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Surfacing Idle Capacity ({resources.filter(r => r.status === 'idle').length})</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map(res => (
          <div
            key={res.id}
            onClick={() => selectEntity('resource', res.id)}
            className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs hover:border-[#3E9B6B] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2B7A50] dark:text-[#6CC594] bg-[#3E9B6B]/20 px-2 py-0.5 rounded-md">
                  {res.kind}
                </span>

                <span
                  className={`text-[11px] font-semibold capitalize ${
                    res.status === 'idle'
                      ? 'text-[#3E9B6B] font-bold'
                      : res.status === 'committed'
                      ? 'text-[#1F5C5A]'
                      : 'text-[#5B6B6E]'
                  }`}
                >
                  {res.status === 'idle' ? 'Idle in Storage' : res.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2A2E] dark:text-[#F3EEE2] group-hover:text-[#2B7A50] transition-colors leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2 leading-relaxed">
                {res.description}
              </p>

              <div className="pt-1 text-[11px] text-[#5B6B6E]">
                <span>Availability: </span>
                <strong className="text-[#1F2A2E] dark:text-[#F3EEE2]">{res.availabilityWindow}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D9CFB9]/50 flex items-center justify-between text-xs">
              <div className="text-[11px] text-[#5B6B6E]">
                Offered by <strong>{res.ownerName}</strong>
              </div>

              <span className="text-[#1F5C5A] dark:text-[#5FB3AE] font-semibold group-hover:underline">
                Use Resource &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
