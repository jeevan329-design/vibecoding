import React, { useState, useMemo } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { EntityType } from '../types';
import { AlertCircle, Package, Users, Building, Flag, CheckCircle, ChevronRight, Filter } from 'lucide-react';

export const ListView: React.FC = () => {
  const {
    situations,
    needs,
    resources,
    organizations,
    people,
    filterTypes,
    filterUrgency,
    filterCategory,
    searchQuery,
    selectEntity,
    openSituationRoom,
    openPostNeedModal,
    openOfferHelpModal
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<'all' | EntityType>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'newest'>('priority');

  const combinedItems = useMemo(() => {
    const list: Array<{
      id: string;
      type: EntityType;
      title: string;
      subtitle: string;
      area: string;
      urgency?: string;
      status?: string;
      category?: string;
      date: string;
      raw: any;
    }> = [];

    // Situations
    if (filterTypes.situation && (activeTab === 'all' || activeTab === 'situation')) {
      situations.forEach(s => {
        if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return;
        list.push({
          id: s.id,
          type: 'situation',
          title: s.title,
          subtitle: s.summary,
          area: s.area.areaName,
          status: s.status,
          date: s.createdAt,
          raw: s
        });
      });
    }

    // Needs
    if (filterTypes.need && (activeTab === 'all' || activeTab === 'need')) {
      needs.forEach(n => {
        if (filterUrgency !== 'all' && n.urgency !== filterUrgency) return;
        if (filterCategory !== 'all' && n.category !== filterCategory) return;
        if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return;
        list.push({
          id: n.id,
          type: 'need',
          title: n.title,
          subtitle: n.description,
          area: n.locationApprox.areaName,
          urgency: n.urgency,
          status: n.status,
          category: n.category,
          date: n.createdAt,
          raw: n
        });
      });
    }

    // Resources
    if (filterTypes.resource && (activeTab === 'all' || activeTab === 'resource')) {
      resources.forEach(r => {
        if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return;
        list.push({
          id: r.id,
          type: 'resource',
          title: r.title,
          subtitle: r.description,
          area: r.locationApprox.areaName,
          status: r.status,
          date: r.createdAt,
          raw: r
        });
      });
    }

    // Organizations
    if (filterTypes.organization && (activeTab === 'all' || activeTab === 'organization')) {
      organizations.forEach(o => {
        if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase())) return;
        list.push({
          id: o.id,
          type: 'organization',
          title: o.name,
          subtitle: o.description,
          area: o.area.areaName,
          date: o.createdAt,
          raw: o
        });
      });
    }

    // People
    if (filterTypes.person && (activeTab === 'all' || activeTab === 'person')) {
      people.forEach(p => {
        if (searchQuery && !p.displayName.toLowerCase().includes(searchQuery.toLowerCase())) return;
        list.push({
          id: p.id,
          type: 'person',
          title: p.displayName,
          subtitle: p.skills.join(', '),
          area: p.area.areaName,
          date: p.createdAt,
          raw: p
        });
      });
    }

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'priority') {
        if (a.urgency === 'today' && b.urgency !== 'today') return -1;
        if (b.urgency === 'today' && a.urgency !== 'today') return 1;
        if (a.type === 'situation' && b.type !== 'situation') return -1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [situations, needs, resources, organizations, people, filterTypes, filterUrgency, filterCategory, searchQuery, activeTab, sortBy]);

  return (
    <div className="w-full bg-[#FAF6EE] dark:bg-[#10201F] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] p-4 sm:p-6 transition-colors space-y-4">
      
      {/* Sub-Header & Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60">
        
        {/* Entity Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'need', 'resource', 'situation', 'organization', 'person'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#1F5C5A] text-white shadow-xs'
                  : 'text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] bg-[#EFE7D6]/50 dark:bg-[#172A29]'
              }`}
            >
              {tab === 'all' ? 'All Entities' : `${tab}s`}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-md bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] text-xs font-medium text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-1 focus:ring-[#1F5C5A]"
          >
            <option value="priority">Priority First</option>
            <option value="newest">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Accessible List Table */}
      {combinedItems.length === 0 ? (
        <div className="py-16 text-center text-[#5B6B6E] dark:text-[#8F9FA1] space-y-3">
          <p className="text-base font-medium">Nothing needed here right now. Know of something? Add it.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={openPostNeedModal}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F2A93B] text-[#1F2A2E] cursor-pointer"
            >
              Post a Need
            </button>
            <button
              onClick={openOfferHelpModal}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2B7A50] text-white cursor-pointer"
            >
              Offer Capacity
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[#D9CFB9]/50 dark:divide-[#243E3B]/50">
          {combinedItems.map(item => {
            const isNeed = item.type === 'need';
            const isResource = item.type === 'resource';
            const isSituation = item.type === 'situation';

            return (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  if (isSituation) {
                    openSituationRoom(item.id);
                  } else {
                    selectEntity(item.type, item.id);
                  }
                }}
                className="py-3.5 px-3 -mx-3 rounded-xl hover:bg-[#EFE7D6]/50 dark:hover:bg-[#172A29]/60 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Entity Color Indicator */}
                  <div className="mt-1 shrink-0">
                    {isSituation && <span className="w-3.5 h-3.5 rounded-full bg-[#1F5C5A] block" />}
                    {isNeed && <span className="w-3.5 h-3.5 rounded-full bg-[#F2A93B] block" />}
                    {isResource && <span className="w-3.5 h-3.5 rounded-full bg-[#3E9B6B] block" />}
                    {item.type === 'organization' && <span className="w-3.5 h-3.5 rounded-full bg-[#3D4F9F] block" />}
                    {item.type === 'person' && <span className="w-3.5 h-3.5 rounded-full bg-[#E8684A] block" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-[#1F2A2E] dark:text-[#F3EEE2]">
                        {item.type}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.area}</span>
                      {item.urgency === 'today' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#C8372D] font-bold">Needed Today</span>
                        </>
                      )}
                      {item.status && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{item.status.replace('_', ' ')}</span>
                        </>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mt-0.5 group-hover:text-[#1F5C5A] dark:group-hover:text-[#5FB3AE] transition-colors truncate">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Action Affordance */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-medium text-[#1F5C5A] dark:text-[#5FB3AE] group-hover:underline">
                    {isSituation ? 'Open Situation' : 'View details'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#5B6B6E] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
