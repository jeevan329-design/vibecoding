import React, { useState, useEffect } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { EntityType } from '../types';
import { Search, X, ChevronRight, AlertCircle, Package, Building, Users } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    closeSearchModal,
    situations,
    needs,
    resources,
    organizations,
    people,
    selectEntity,
    openSituationRoom
  } = useCommunity();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchModalOpen) setQuery('');
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const results: Array<{ id: string; type: EntityType; title: string; subtitle: string; area?: string }> = [];

  if (q.length > 0) {
    situations.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)) {
        results.push({ id: s.id, type: 'situation', title: s.title, subtitle: s.summary, area: s.area.areaName });
      }
    });

    needs.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.category.includes(q)) {
        results.push({ id: n.id, type: 'need', title: n.title, subtitle: n.description, area: n.locationApprox.areaName });
      }
    });

    resources.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.kind.includes(q)) {
        results.push({ id: r.id, type: 'resource', title: r.title, subtitle: r.description, area: r.locationApprox.areaName });
      }
    });

    organizations.forEach(o => {
      if (o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)) {
        results.push({ id: o.id, type: 'organization', title: o.name, subtitle: o.description, area: o.area.areaName });
      }
    });

    people.forEach(p => {
      if (p.displayName.toLowerCase().includes(q) || p.skills.some(s => s.toLowerCase().includes(q))) {
        results.push({ id: p.id, type: 'person', title: p.displayName, subtitle: p.skills.join(', '), area: p.area.areaName });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1F5C5A] dark:text-[#5FB3AE]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all 5 entities: needs, resources, people, orgs, situations..."
            className="flex-1 bg-transparent text-sm text-[#1F2A2E] dark:text-[#F3EEE2] placeholder-[#5B6B6E] focus:outline-none"
          />
          <button onClick={closeSearchModal} className="p-1 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {q.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5B6B6E]">
              Type keywords like <span className="font-semibold text-[#1F5C5A]">water</span>,{' '}
              <span className="font-semibold text-[#3E9B6B]">truck</span>,{' '}
              <span className="font-semibold text-[#F2A93B]">pump</span>, or{' '}
              <span className="font-semibold text-[#3D4F9F]">school</span>.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5B6B6E]">
              No entities found matching &quot;{query}&quot;.
            </div>
          ) : (
            results.map(item => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  closeSearchModal();
                  if (item.type === 'situation') {
                    openSituationRoom(item.id);
                  } else {
                    selectEntity(item.type, item.id);
                  }
                }}
                className="p-3 rounded-xl hover:bg-[#EFE7D6]/60 dark:hover:bg-[#10201F]/60 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-1 shrink-0">
                    {item.type === 'situation' && <span className="w-3 h-3 rounded-full bg-[#1F5C5A] block" />}
                    {item.type === 'need' && <span className="w-3 h-3 rounded-full bg-[#F2A93B] block" />}
                    {item.type === 'resource' && <span className="w-3 h-3 rounded-full bg-[#3E9B6B] block" />}
                    {item.type === 'organization' && <span className="w-3 h-3 rounded-full bg-[#3D4F9F] block" />}
                    {item.type === 'person' && <span className="w-3 h-3 rounded-full bg-[#E8684A] block" />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5B6B6E]">
                      {item.type} {item.area && `· ${item.area}`}
                    </div>
                    <div className="text-xs font-bold text-[#1F2A2E] dark:text-[#F3EEE2] truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#5B6B6E] line-clamp-1">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#5B6B6E] shrink-0" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
