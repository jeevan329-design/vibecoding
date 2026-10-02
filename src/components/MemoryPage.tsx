import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { BookOpen, Sparkles, CheckCircle2, Search, ArrowRight, Tag, Users, Shield } from 'lucide-react';
import { Lesson } from '../types';

export const MemoryPage: React.FC = () => {
  const { lessons, createSituationFromPlaybook, openSituationRoom } = useCommunity();
  const [search, setSearch] = useState('');

  const filteredLessons = lessons.filter(l => {
    const q = search.toLowerCase();
    return (
      l.situationTitle.toLowerCase().includes(q) ||
      l.whatWorked.toLowerCase().includes(q) ||
      l.whatWasMissing.toLowerCase().includes(q) ||
      l.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D9CFB9] dark:border-[#243E3B]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Community Memory & Playbooks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
            What Worked, Preserved for Next Time
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B6E] dark:text-[#8F9FA1] mt-1 max-w-2xl">
            When a community resolves a situation, knowledge is not lost. Every lesson becomes a reusable playbook with recurring needs and roles ready to mobilize in seconds.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5B6B6E]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lessons or tags..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] placeholder-[#5B6B6E] focus:outline-none focus:ring-1 focus:ring-[#1F5C5A]"
          />
        </div>
      </div>

      {/* Playbook Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLessons.map(lesson => (
          <div
            key={lesson.id}
            className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-sm flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              
              {/* Card Header & Tags */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {lesson.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#1F5C5A]/10 text-[#1F5C5A] dark:text-[#5FB3AE]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
                  {lesson.situationTitle}
                </h3>
              </div>

              {/* What Worked */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#2B7A50] dark:text-[#6CC594] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>What Helped:</span>
                </div>
                <p className="text-xs text-[#1F2A2E] dark:text-[#F3EEE2] leading-relaxed">
                  {lesson.whatWorked}
                </p>
              </div>

              {/* What Was Missing */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#C8372D] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>What Was Missing / Bottlenecks:</span>
                </div>
                <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] leading-relaxed">
                  {lesson.whatWasMissing}
                </p>
              </div>

              {/* Pre-Baked Playbook Roles & Needs */}
              <div className="p-3.5 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9]/60 dark:border-[#243E3B]/60 space-y-2 text-xs">
                <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                  Playbook Template (Estimated {lesson.playbookTemplate.estimatedDays} days):
                </div>
                
                <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1]">
                  <strong>Recurring Needs: </strong>
                  {lesson.playbookTemplate.recurringNeeds.join(' · ')}
                </div>

                <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1]">
                  <strong>Suggested Roles: </strong>
                  {lesson.playbookTemplate.suggestedRoles.join(' · ')}
                </div>
              </div>

              {/* Key Helpers Credit */}
              <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1]">
                <strong>Key community participants: </strong>
                {lesson.helpers.join(', ')}
              </div>

            </div>

            {/* "Use as Playbook" Action Button (PRD Section F8) */}
            <div className="pt-3 border-t border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
              <span className="text-xs text-[#5B6B6E]">
                Recorded {new Date(lesson.createdAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => createSituationFromPlaybook(lesson)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F5C5A] text-white hover:bg-[#164543] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use as Playbook (Launch Effort)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
