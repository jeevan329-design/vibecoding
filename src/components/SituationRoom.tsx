import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Plus,
  Send,
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  Users,
  Package,
  Layers,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const SituationRoom: React.FC = () => {
  const {
    activeSituationId,
    situations,
    needs,
    resources,
    tasks,
    matches,
    updates,
    currentUser,
    setActivePage,
    confirmMatch,
    declineMatch,
    claimTask,
    toggleTaskDone,
    addSituationUpdate,
    openCloseLoopModal,
    showToast
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<'board' | 'resources' | 'people' | 'timeline' | 'updates'>('board');
  const [updateTag, setUpdateTag] = useState<'update' | 'ask' | 'thanks'>('update');
  const [updateText, setUpdateText] = useState('');

  const situation = situations.find(s => s.id === activeSituationId) || situations[0];
  const sitNeeds = needs.filter(n => n.situationId === situation.id);
  const sitTasks = tasks.filter(t => t.situationId === situation.id);
  const sitUpdates = updates.filter(u => u.situationId === situation.id);
  const sitMatches = matches.filter(
    m => m.state === 'suggested' && sitNeeds.some(n => n.id === m.needId)
  );

  // Circular progress calculation
  const totalNeeds = situation.needsCount || sitNeeds.length || 1;
  const metNeeds = situation.needsMetCount || sitNeeds.filter(n => n.status === 'met').length;
  const progressPercent = Math.min(100, Math.round((metNeeds / totalNeeds) * 100));

  // Circumference for r=36 is 2 * PI * 36 = 226.2
  const strokeDashoffset = 226.2 - (226.2 * progressPercent) / 100;

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim()) return;
    addSituationUpdate(situation.id, updateTag, updateText.trim());
    setUpdateText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('network')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B6B6E] hover:text-[#1F5C5A] dark:text-[#8F9FA1] dark:hover:text-[#5FB3AE] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Network</span>
        </button>

        {/* Lead action to mark resolved */}
        {situation.status !== 'resolved' && (
          <button
            onClick={openCloseLoopModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF6EE] dark:bg-[#172A29] border border-[#1F5C5A] text-[#1F5C5A] dark:text-[#5FB3AE] hover:bg-[#1F5C5A]/10 transition-colors cursor-pointer"
          >
            Mark Situation Resolved & Preserve Lesson
          </button>
        )}
      </div>

      {/* Main Situation Header Card */}
      <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE] bg-[#1F5C5A]/10 px-2.5 py-0.5 rounded-md">
                Active Situation Room
              </span>
              <span aria-hidden="true" className="text-[#5B6B6E]">·</span>
              <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">{situation.area.areaName}</span>
              <span aria-hidden="true" className="text-[#5B6B6E]">·</span>
              <span className="capitalize font-medium text-[#1F2A2E] dark:text-[#F3EEE2]">{situation.status}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] tracking-tight">
              {situation.title}
            </h1>

            <p className="text-sm text-[#5B6B6E] dark:text-[#8F9FA1] leading-relaxed">
              {situation.summary}
            </p>
          </div>

          {/* Progress Ring Widget (Section 7.3 & F6) */}
          <div className="flex items-center gap-4 bg-[#EFE7D6]/60 dark:bg-[#10201F]/60 p-4 rounded-xl border border-[#D9CFB9]/70 dark:border-[#243E3B]/70 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 88 88">
                {/* Background Ring */}
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-[#D9CFB9] dark:text-[#243E3B] fill-none"
                />
                {/* Progress Ring */}
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  stroke="#3E9B6B"
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="fill-none transition-all duration-700 ease-out"
                  strokeDasharray="226.2"
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-[#1F2A2E] dark:text-[#F3EEE2] tabular-nums">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2] tabular-nums">
                {metNeeds} of {totalNeeds} needs met
              </div>
              <div className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] mt-0.5">
                {sitTasks.filter(t => t.status === 'done').length} coordinated tasks completed
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Suggested Matches Strip (F6, F7: Transparent Scoring with Human Confirmation) */}
      {sitMatches.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#EFE7D6] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F2A93B]" />
              <h3 className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
                Suggested Matches Awaiting Human Confirmation ({sitMatches.length})
              </h3>
            </div>
            <span className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
              The system suggests · Humans decide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sitMatches.map(match => (
              <div
                key={match.id}
                className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D9CFB9]/50">
                    <span className="font-semibold text-[#1F5C5A] dark:text-[#5FB3AE]">
                      Transparent Fit Score: {match.score} / 100
                    </span>
                    <span className="text-[#5B6B6E]">Suggested Match</span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">Need:</div>
                    <div className="text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                      {match.needTitle}
                    </div>

                    <div className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] pt-1">Matched Resource:</div>
                    <div className="text-xs font-semibold text-[#3E9B6B]">
                      {match.resourceTitle}
                    </div>
                  </div>

                  {/* Reasons Breakdown (F7) */}
                  <div className="mt-2.5 pt-2 border-t border-[#D9CFB9]/40 space-y-1">
                    <div className="text-[11px] font-medium text-[#5B6B6E] dark:text-[#8F9FA1]">
                      Why this match:
                    </div>
                    {match.reasons.map((reason, idx) => (
                      <div key={idx} className="text-[11px] text-[#1F2A2E] dark:text-[#F3EEE2] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#1F5C5A]" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm / Decline Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#D9CFB9]/50">
                  <button
                    onClick={() => confirmMatch(match.id)}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-[#2B7A50] text-white hover:bg-[#236843] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Match</span>
                  </button>

                  <button
                    onClick={() => declineMatch(match.id)}
                    className="py-2 px-3 rounded-lg text-xs font-semibold bg-[#FAF6EE] dark:bg-[#172A29] text-[#5B6B6E] hover:text-[#C8372D] border border-[#D9CFB9] dark:border-[#243E3B] transition-colors cursor-pointer"
                  >
                    Not a Fit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Navigation (Board, Resources, People, Timeline, Updates) */}
      <div className="flex items-center gap-2 border-b border-[#D9CFB9] dark:border-[#243E3B] pb-2 overflow-x-auto scrollbar-none">
        {(['board', 'resources', 'people', 'timeline', 'updates'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-[#1F5C5A] text-white shadow-xs'
                : 'text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] hover:bg-[#EFE7D6]/50'
            }`}
          >
            {tab === 'board' ? 'Task Board & Needs' : tab}
          </button>
        ))}
      </div>

      {/* TAB 1: BOARD (Open, In Progress, Met) with 1-Tap Claiming (F6) */}
      {activeTab === 'board' && (
        <div className="space-y-6">
          
          {/* Actionable Task Rows Strip */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
                Actionable Tasks (Claim in 1 Tap)
              </h3>
              <span className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
                {sitTasks.filter(t => t.status === 'open').length} unassigned
              </span>
            </div>

            <div className="divide-y divide-[#D9CFB9]/50 dark:divide-[#243E3B]/50">
              {sitTasks.map(task => {
                const isClaimedByMe = task.ownerId === currentUser.id;
                const isDone = task.status === 'done';

                return (
                  <div
                    key={task.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTaskDone(task.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-[#3E9B6B] border-[#3E9B6B] text-white'
                              : 'border-[#5B6B6E] hover:border-[#1F5C5A]'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3" />}
                        </button>
                        <span
                          className={`font-semibold ${
                            isDone ? 'line-through text-[#5B6B6E]' : 'text-[#1F2A2E] dark:text-[#F3EEE2]'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1] flex items-center gap-2 pl-6">
                        <Clock className="w-3 h-3" />
                        <span>Due: {task.dueAt}</span>
                        {task.ownerName && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Assigned: {task.ownerName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Claim Button: PRD Section 9 microcopy "I'll take this." */}
                    <div className="flex items-center gap-2 pl-6 sm:pl-0">
                      {task.status === 'open' ? (
                        <button
                          onClick={() => claimTask(task.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2B7A50] text-white hover:bg-[#236843] active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                        >
                          I&apos;ll take this
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
                          <UserCheck className="w-4 h-4 text-[#3E9B6B]" />
                          <span>{isClaimedByMe ? 'You claimed this' : task.ownerName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Columns: Open Needs · In Progress · Met */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Open */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9CFB9]/50">
                <span className="font-semibold text-xs text-[#F2A93B]">
                  Open Needs ({sitNeeds.filter(n => n.status === 'open').length})
                </span>
              </div>
              {sitNeeds
                .filter(n => n.status === 'open')
                .map(n => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9]/60 dark:border-[#243E3B]/60 space-y-1.5 text-xs"
                  >
                    <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{n.title}</div>
                    <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2">
                      {n.description}
                    </div>
                  </div>
                ))}
            </div>

            {/* In Progress */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9CFB9]/50">
                <span className="font-semibold text-xs text-[#1F5C5A] dark:text-[#5FB3AE]">
                  In Progress ({sitNeeds.filter(n => n.status === 'in_progress').length})
                </span>
              </div>
              {sitNeeds
                .filter(n => n.status === 'in_progress')
                .map(n => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9]/60 dark:border-[#243E3B]/60 space-y-1.5 text-xs"
                  >
                    <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{n.title}</div>
                    <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2">
                      {n.description}
                    </div>
                  </div>
                ))}
            </div>

            {/* Met */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9CFB9]/50">
                <span className="font-semibold text-xs text-[#3E9B6B]">
                  Met Needs ({sitNeeds.filter(n => n.status === 'met').length})
                </span>
              </div>
              {sitNeeds
                .filter(n => n.status === 'met')
                .map(n => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9]/60 dark:border-[#243E3B]/60 space-y-1.5 text-xs opacity-85"
                  >
                    <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#3E9B6B]" />
                      <span>{n.title}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RESOURCES */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(res => (
            <div
              key={res.id}
              className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-2 text-xs shadow-xs"
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2B7A50] bg-[#3E9B6B]/15 px-2 py-0.5 rounded-md">
                  {res.kind}
                </span>
                <span className="text-[#5B6B6E] capitalize">{res.status}</span>
              </div>
              <h4 className="font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">{res.title}</h4>
              <p className="text-[#5B6B6E] dark:text-[#8F9FA1] line-clamp-2">{res.description}</p>
              <div className="pt-2 border-t border-[#D9CFB9]/50 flex justify-between text-[11px] text-[#5B6B6E]">
                <span>By {res.ownerName}</span>
                <span>{res.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PEOPLE & ORGANIZATIONS */}
      {activeTab === 'people' && (
        <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-4">
          <h3 className="font-display font-bold text-base text-[#1F2A2E] dark:text-[#F3EEE2]">
            Active Community Responders & Organizations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B] space-y-2">
              <div className="font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">Marcus Chen</div>
              <div className="text-xs text-[#5B6B6E]">Logistics Volunteer · 19 Completed Tasks</div>
              <div className="text-[11px] text-[#1F5C5A]">Skills: Heavy vehicle transport, Route planning</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B] space-y-2">
              <div className="font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">Dr. Aris Thorne</div>
              <div className="text-xs text-[#5B6B6E]">Hydraulic Engineer · 24 Completed Tasks</div>
              <div className="text-[11px] text-[#1F5C5A]">Skills: Water quality testing, Pump diagnostic</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B] space-y-2">
              <div className="font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">St. Jude Community School</div>
              <div className="text-xs text-[#5B6B6E]">Verified Anchor · Assembly Hall Hub</div>
              <div className="text-[11px] text-[#1F5C5A]">Capacity: 400m² dry storage, kitchen</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-4">
          <h3 className="font-display font-bold text-base text-[#1F2A2E] dark:text-[#F3EEE2]">
            Situation Event Timeline
          </h3>
          <div className="relative pl-6 border-l-2 border-[#1F5C5A] space-y-6">
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#1F5C5A]" />
              <div className="text-xs text-[#5B6B6E]">28 September 2026, 08:00</div>
              <div className="text-sm font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                Situation Formed: Municipal water main disruption reported in Eastern Riverside.
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#3E9B6B]" />
              <div className="text-xs text-[#5B6B6E]">28 September 2026, 11:45</div>
              <div className="text-sm font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                St. Jude Assembly Hall mobilized as staging and container distribution point.
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#3E9B6B]" />
              <div className="text-xs text-[#5B6B6E]">29 September 2026, 16:30</div>
              <div className="text-sm font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                Oak Court senior residents received 14 portable water deliveries directly to doorsteps.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: UPDATES WITH COMPOSER (F6) */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          {/* Structured Composer (Tags: Update, Ask, Thanks) */}
          <form
            onSubmit={handlePostUpdate}
            className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1F2A2E] dark:text-[#F3EEE2]">
                Post Situation Notice
              </span>
              {/* Tag selector */}
              <div className="flex items-center gap-1">
                {(['update', 'ask', 'thanks'] as const).map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setUpdateTag(tag)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors cursor-pointer ${
                      updateTag === tag
                        ? 'bg-[#1F5C5A] text-white shadow-xs'
                        : 'bg-[#EFE7D6] dark:bg-[#10201F] text-[#5B6B6E]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              placeholder={
                updateTag === 'update'
                  ? 'Share concrete operational progress...'
                  : updateTag === 'ask'
                  ? 'What specific assistance or resource is urgently needed?'
                  : 'Express community gratitude to helpers...'
              }
              className="w-full p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs sm:text-sm text-[#1F2A2E] dark:text-[#F3EEE2] placeholder-[#5B6B6E] focus:outline-none focus:ring-1 focus:ring-[#1F5C5A]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1F5C5A] text-white hover:bg-[#164543] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Notice</span>
              </button>
            </div>
          </form>

          {/* List of Updates */}
          <div className="space-y-3">
            {sitUpdates.map(upd => (
              <div
                key={upd.id}
                className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{upd.authorName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        upd.tag === 'ask'
                          ? 'bg-[#F2A93B]/20 text-[#8A5A00] dark:text-[#F5B84F]'
                          : upd.tag === 'thanks'
                          ? 'bg-[#3E9B6B]/20 text-[#2B7A50] dark:text-[#6CC594]'
                          : 'bg-[#1F5C5A]/15 text-[#1F5C5A] dark:text-[#5FB3AE]'
                      }`}
                    >
                      {upd.tag}
                    </span>
                  </div>
                  <span className="text-[#5B6B6E] text-[11px]">
                    {new Date(upd.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#1F2A2E] dark:text-[#F3EEE2] leading-relaxed">{upd.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
