import React, { useState, useEffect } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { Need, UrgencyLevel, Visibility } from '../types';
import {
  X,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Layers,
  Users
} from 'lucide-react';

export const PostNeedModal: React.FC = () => {
  const {
    isPostNeedOpen,
    closePostNeedModal,
    addNeed,
    checkDuplicateNudges,
    currentUser,
    situations,
    openSituationRoom
  } = useCommunity();

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'water' | 'food' | 'shelter' | 'transport' | 'tools' | 'health' | 'care'>('water');
  const [urgency, setUrgency] = useState<UrgencyLevel>('today');
  const [areaName, setAreaName] = useState('Central Riverside');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [duplicateNudges, setDuplicateNudges] = useState<any[]>([]);

  // Reset form when modal opens
  useEffect(() => {
    if (isPostNeedOpen) {
      setStep(1);
      setTitle('');
      setDescription('');
      setCategory('water');
      setUrgency('today');
      setAreaName(currentUser.area.areaName);
      setDuplicateNudges([]);
    }
  }, [isPostNeedOpen, currentUser]);

  // Debounced duplicate nudge check as user types (PRD Section F3)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim().length >= 3) {
        const nudges = checkDuplicateNudges(title + ' ' + description);
        setDuplicateNudges(nudges);
      } else {
        setDuplicateNudges([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [title, description, checkDuplicateNudges]);

  if (!isPostNeedOpen) return null;

  const handleJoinExisting = (targetSituationId: string) => {
    addNeed(
      {
        title: title || 'Community Assistance Request',
        description,
        category,
        urgency,
        locationApprox: { areaName, lat: currentUser.area.lat, lng: currentUser.area.lng },
        visibility
      },
      targetSituationId
    );
    closePostNeedModal();
    openSituationRoom(targetSituationId);
  };

  const handleFinishSubmit = () => {
    const result = addNeed({
      title: title || 'Assistance Request',
      description,
      category,
      urgency,
      locationApprox: { areaName, lat: currentUser.area.lat, lng: currentUser.area.lng },
      visibility
    });
    closePostNeedModal();
    if (result.joinedSituation) {
      openSituationRoom(result.joinedSituation.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Step Tracker */}
        <div className="px-6 py-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F2A93B]">
              Step {step} of 4 · Post a Need
            </span>
            <h3 className="font-display font-bold text-lg text-[#1F2A2E] dark:text-[#F3EEE2]">
              {step === 1 && "What's needed?"}
              {step === 2 && "Where and when?"}
              {step === 3 && "Visibility & Preferences"}
              {step === 4 && "Review & Connect"}
            </h3>
          </div>

          <button
            onClick={closePostNeedModal}
            className="p-1.5 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: What's needed? */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Describe what is needed in plain words
                </label>
                <input
                  type="text"
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Drinking water for elderly neighbours, transport truck..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-sm text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#1F5C5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {(['water', 'food', 'shelter', 'transport', 'tools', 'health', 'care'] as const).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg capitalize border transition-colors cursor-pointer ${
                        category === cat
                          ? 'bg-[#1F5C5A] text-white border-[#1F5C5A]'
                          : 'bg-[#EFE7D6]/50 dark:bg-[#10201F] border-[#D9CFB9] dark:border-[#243E3B] text-[#1F2A2E] dark:text-[#F3EEE2]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Additional context (optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Floor number, quantities, specific conditions..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#1F5C5A]"
                />
              </div>

              {/* DUPLICATE NUDGE BANNER (F3 P0 Core Requirement) */}
              {duplicateNudges.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F2A93B]/15 border border-[#F2A93B]/50 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8A5A00] dark:text-[#F5B84F]">
                    <Sparkles className="w-4 h-4" />
                    <span>Others are already working on this. Want to join them?</span>
                  </div>
                  <p className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1]">
                    We detected similar active efforts nearby. Connecting avoids duplicating work:
                  </p>
                  <div className="space-y-2">
                    {duplicateNudges.map(nudge => (
                      <div
                        key={nudge.need.id}
                        className="p-2.5 rounded-lg bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] truncate">
                            {nudge.need.title}
                          </div>
                          <div className="text-[10px] text-[#5B6B6E] dark:text-[#8F9FA1]">
                            {nudge.similarityReason}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleJoinExisting(nudge.need.situationId || 'sit-riverside-water')}
                          className="px-3 py-1 text-xs font-semibold rounded-md bg-[#1F5C5A] text-white hover:bg-[#164543] shrink-0 cursor-pointer"
                        >
                          Join Effort
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Where and when? */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Approximate Location
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1F5C5A]" />
                  <input
                    type="text"
                    value={areaName}
                    onChange={e => setAreaName(e.target.value)}
                    placeholder="Area or district name"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2]"
                  />
                </div>
                <p className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1] mt-1">
                  Exact house numbers are kept private.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Urgency Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'today', label: 'Today', sub: 'Immediate need' },
                    { id: 'this_week', label: 'This Week', sub: 'In next 3-5 days' },
                    { id: 'ongoing', label: 'Ongoing', sub: 'Sustained support' }
                  ].map(u => (
                    <button
                      type="button"
                      key={u.id}
                      onClick={() => setUrgency(u.id as UrgencyLevel)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        urgency === u.id
                          ? 'border-[#1F5C5A] bg-[#1F5C5A]/10 text-[#1F5C5A] dark:text-[#5FB3AE] font-semibold'
                          : 'border-[#D9CFB9] dark:border-[#243E3B] bg-[#EFE7D6]/40 dark:bg-[#10201F] text-[#5B6B6E]'
                      }`}
                    >
                      <div className="text-xs font-bold">{u.label}</div>
                      <div className="text-[10px] mt-0.5">{u.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Details & Visibility */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Who can see this request?
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'public', label: 'Public Community', desc: 'Visible to all neighbours and local verified organizations.' },
                    { id: 'members', label: 'Verified Responders Only', desc: 'Visible only to verified civic groups and coordinators.' },
                    { id: 'private', label: 'Private Support Line', desc: 'Handled confidentially by lead community stewards.' }
                  ].map(vis => (
                    <label
                      key={vis.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                        visibility === vis.id
                          ? 'border-[#1F5C5A] bg-[#1F5C5A]/10'
                          : 'border-[#D9CFB9] dark:border-[#243E3B]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={vis.id}
                        checked={visibility === vis.id}
                        onChange={() => setVisibility(vis.id as Visibility)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{vis.label}</div>
                        <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1]">{vis.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EFE7D6]/60 dark:bg-[#10201F]/60 text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
                Posting as <strong className="text-[#1F2A2E] dark:text-[#F3EEE2]">{currentUser.displayName}</strong>.
              </div>
            </div>
          )}

          {/* STEP 4: Review and Connect */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] space-y-2">
                <div className="text-xs font-semibold text-[#5B6B6E]">Request Summary:</div>
                <div className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
                  {title || 'Community Assistance Request'}
                </div>
                {description && <div className="text-xs text-[#5B6B6E]">{description}</div>}
                <div className="pt-2 border-t border-[#D9CFB9]/50 flex flex-wrap gap-3 text-[11px]">
                  <span>Category: <strong className="capitalize">{category}</strong></span>
                  <span>·</span>
                  <span>Urgency: <strong className="capitalize">{urgency}</strong></span>
                  <span>·</span>
                  <span>Area: <strong>{areaName}</strong></span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#3E9B6B]/15 border border-[#3E9B6B]/40 text-[#2B7A50] dark:text-[#6CC594] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Immediate Capacity Matching</span>
                </div>
                <p className="text-[11px]">
                  Upon publishing, the coordination engine will instantly suggest available matching resources and link to the Riverside Water Shortage effort.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#D9CFB9]/60 dark:border-[#243E3B]/60 bg-[#FAF6EE] dark:bg-[#172A29] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              disabled={!title.trim() && step === 1}
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F5C5A] text-white hover:bg-[#164543] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishSubmit}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#F2A93B] text-[#1F2A2E] hover:bg-[#e69e32] active:scale-95 transition-all shadow-xs cursor-pointer font-bold"
            >
              Publish & Find Help
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
