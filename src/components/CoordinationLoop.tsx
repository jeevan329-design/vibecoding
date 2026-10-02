import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';

export const CoordinationLoop: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      name: 'Speak Up',
      title: '1. Ask for Help or Share an Offer',
      desc: 'Anyone can post what they need or what they have to lend. If a neighbour is already asking for something similar, the app gently points it out so you can team up.'
    },
    {
      name: 'Group Up',
      title: '2. Connect Related Requests',
      desc: 'When multiple families on the same street need drinking water or garden cleanup, requests gather into one local community effort so nobody works in the dark.'
    },
    {
      name: 'Find a Fit',
      title: '3. Match Needs with Ready Helpers',
      desc: 'The system highlights helpers who live nearby with the right tools or free time. Helpers choose to accept—nobody is ever assigned without agreeing.'
    },
    {
      name: 'Pitch In',
      title: '4. Claim a Simple Task in One Tap',
      desc: 'Volunteers and community groups pick specific jobs—like bringing five water bottles to an elderly neighbour or translating a safety flyer.'
    },
    {
      name: 'Take Action',
      title: '5. Help Out Safely in Real Life',
      desc: 'Neighbours meet and help directly. Personal contact information is only shared once both neighbours feel comfortable and agree.'
    },
    {
      name: 'Watch Progress',
      title: '6. Celebrate Progress Together',
      desc: 'A simple progress circle shows how many tasks are done (e.g., "7 of 12 needs met") so the whole block can see things improving.'
    },
    {
      name: 'Remember',
      title: '7. Save What Worked for Next Time',
      desc: 'When an issue is solved, organisers leave two simple notes: what helped most, and what was missing. Next season or next storm, the neighbourhood is twice as prepared.'
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#EFE7D6]/60 dark:bg-[#172A29]/60 border border-[#D9CFB9] dark:border-[#243E3B] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE]">
            How It Works
          </span>
          <h3 className="font-display font-bold text-lg text-[#1F2A2E] dark:text-[#F3EEE2]">
            How We Look Out for Each Other (Step by Step)
          </h3>
        </div>
        <span className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
          Click any step to read how it works
        </span>
      </div>

      {/* Steps Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((step, idx) => (
          <button
            key={step.name}
            onClick={() => setActiveStep(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeStep === idx
                ? 'bg-[#1F5C5A] text-white shadow-xs'
                : 'bg-[#FAF6EE] dark:bg-[#10201F] text-[#5B6B6E] hover:text-[#1F2A2E]'
            }`}
          >
            {idx + 1}. {step.name}
          </button>
        ))}
      </div>

      {/* Active Step Explainer Card */}
      <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F5C5A] dark:text-[#5FB3AE]">
            Step 0{activeStep + 1}
          </div>
          <h4 className="font-bold text-base text-[#1F2A2E] dark:text-[#F3EEE2]">
            {steps[activeStep].title}
          </h4>
          <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] max-w-2xl leading-relaxed">
            {steps[activeStep].desc}
          </p>
        </div>

        <button
          onClick={() => setActiveStep((activeStep + 1) % steps.length)}
          className="self-start sm:self-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EFE7D6] dark:bg-[#172A29] text-[#1F2A2E] dark:text-[#F3EEE2] hover:bg-[#D9CFB9] dark:hover:bg-[#243E3B] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Next Step</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
