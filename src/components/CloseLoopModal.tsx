import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { X, CheckCircle, BookOpen, Sparkles, Tag, ArrowRight } from 'lucide-react';

export const CloseLoopModal: React.FC = () => {
  const {
    isCloseLoopOpen,
    closeCloseLoopModal,
    activeSituationId,
    situations,
    resolveSituation,
    setActivePage
  } = useCommunity();

  const [whatWorked, setWhatWorked] = useState('');
  const [whatWasMissing, setWhatWasMissing] = useState('');
  const [tagsInput, setTagsInput] = useState('Water Security, Rapid Transport, Senior Welfare');

  if (!isCloseLoopOpen || !activeSituationId) return null;

  const situation = situations.find(s => s.id === activeSituationId) || situations[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    resolveSituation(
      situation.id,
      whatWorked || 'Strong volunteer logistics, dedicated water tanker shuttle runs, and direct senior welfare check-ins prevented crisis escalation.',
      whatWasMissing || 'Could have benefited from pre-printed multilanguage advisory cards and more portable water jerrycans on day 1.',
      tags
    );

    setActivePage('memory');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE]">
              Close the Loop · Preserve Knowledge
            </span>
            <h3 className="font-display font-bold text-lg text-[#1F2A2E] dark:text-[#F3EEE2]">
              Mark Situation Resolved
            </h3>
          </div>

          <button
            onClick={closeCloseLoopModal}
            className="p-1.5 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
            Resolving <strong className="text-[#1F2A2E] dark:text-[#F3EEE2]">{situation.title}</strong>. Your retrospective answers will automatically turn this response into a reusable playbook for future community organizers.
          </div>

          {/* Question 1: What helped? */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
              1. What helped?
            </label>
            <textarea
              rows={3}
              required
              value={whatWorked}
              onChange={e => setWhatWorked(e.target.value)}
              placeholder="Which resources, methods, or volunteer workflows made the biggest difference?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#1F5C5A]"
            />
          </div>

          {/* Question 2: What was missing? */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
              2. What was missing or could be improved?
            </label>
            <textarea
              rows={3}
              required
              value={whatWasMissing}
              onChange={e => setWhatWasMissing(e.target.value)}
              placeholder="What equipment was short? What bottlenecks slowed response time?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#1F5C5A]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
              Playbook Categorization Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. Water, Logistics, Seniors (comma separated)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#1F5C5A]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#EFE7D6]/60 dark:bg-[#10201F]/60 border border-[#D9CFB9] dark:border-[#243E3B] text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1] space-y-1">
            <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">Memory & Playbook Synthesis</div>
            <p>
              Submitting marks all needs as met, generates a permanent Memory Card, and creates an instant template that other neighbourhoods can launch with 1 click.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeCloseLoopModal}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1F5C5A] text-white hover:bg-[#164543] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span>Resolve & Save Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
