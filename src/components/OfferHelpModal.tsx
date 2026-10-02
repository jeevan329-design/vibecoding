import React, { useState, useEffect } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { ResourceKind, Visibility } from '../types';
import {
  X,
  Package,
  Clock,
  Wrench,
  Building,
  DollarSign,
  BookOpen,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';

export const OfferHelpModal: React.FC = () => {
  const {
    isOfferHelpOpen,
    closeOfferHelpModal,
    addResource,
    needs,
    currentUser,
    openSituationRoom
  } = useCommunity();

  const [step, setStep] = useState<number>(1);
  const [kind, setKind] = useState<ResourceKind>('time');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('4 hours / week');
  const [availabilityWindow, setAvailabilityWindow] = useState('This week');
  const [radiusKm, setRadiusKm] = useState(10);
  const [visibility, setVisibility] = useState<Visibility>('public');

  useEffect(() => {
    if (isOfferHelpOpen) {
      setStep(1);
      setTitle('');
      setDescription('');
      setKind('time');
      setQuantity('4 hours');
      setAvailabilityWindow('This weekend');
      setRadiusKm(10);
    }
  }, [isOfferHelpOpen]);

  if (!isOfferHelpOpen) return null;

  // Matching open needs for Step 4
  const matchingNeeds = needs
    .filter(n => n.status === 'open')
    .slice(0, 3);

  const handleFinish = () => {
    addResource({
      kind,
      title: title || `${kind.toUpperCase()} Community Offer`,
      description,
      quantity,
      availabilityWindow,
      radiusKm,
      visibility
    });
    closeOfferHelpModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2B7A50] dark:text-[#6CC594]">
              Step {step} of 4 · Offer Help
            </span>
            <h3 className="font-display font-bold text-lg text-[#1F2A2E] dark:text-[#F3EEE2]">
              {step === 1 && "What can you offer?"}
              {step === 2 && "Capacity & Details"}
              {step === 3 && "Visibility"}
              {step === 4 && "Here is where that's needed"}
            </h3>
          </div>

          <button
            onClick={closeOfferHelpModal}
            className="p-1.5 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: Choose Type Chip */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                Choose the kind of capacity you want to share:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'time', label: 'Time', icon: Clock, desc: 'General helping hands' },
                  { id: 'skill', label: 'Skill', icon: Wrench, desc: 'Trades, nursing, tech' },
                  { id: 'space', label: 'Space', icon: Building, desc: 'Storage, assembly hall' },
                  { id: 'equipment', label: 'Equipment', icon: Package, desc: 'Pumps, generators, saws' },
                  { id: 'supplies', label: 'Supplies', icon: Package, desc: 'Water cans, blankets' },
                  { id: 'vehicle', label: 'Vehicle', icon: Truck, desc: 'Truck, van, trailer' },
                  { id: 'knowledge', label: 'Knowledge', icon: BookOpen, desc: 'Engineering, legal' },
                  { id: 'money', label: 'Money', icon: DollarSign, desc: 'Fuel / supply stipend' }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setKind(item.id as ResourceKind)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        kind === item.id
                          ? 'border-[#2B7A50] bg-[#2B7A50]/10 text-[#2B7A50] dark:text-[#6CC594] font-semibold'
                          : 'border-[#D9CFB9] dark:border-[#243E3B] bg-[#EFE7D6]/40 dark:bg-[#10201F] text-[#5B6B6E]'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] mt-0.5 line-clamp-1">{item.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Brief Title of Your Offer
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={`e.g. ${
                    kind === 'time'
                      ? 'Volunteer lifting & driving assistance'
                      : kind === 'vehicle'
                      ? 'Flatbed truck with tie-downs'
                      : 'Master plumbing advisory & toolkit'
                  }`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs sm:text-sm text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#2B7A50]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                  Description of Capacity
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Details, condition, specific availability parameters..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] focus:outline-none focus:ring-2 focus:ring-[#2B7A50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                    Quantity / Duration
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="e.g. 5 hours, 20 jerrycans"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1.5">
                    When Available
                  </label>
                  <input
                    type="text"
                    value={availabilityWindow}
                    onChange={e => setAvailabilityWindow(e.target.value)}
                    placeholder="e.g. Saturday 10am-2pm"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mb-1">
                  <span>Service Radius: {radiusKm} km</span>
                  <span className="text-[#5B6B6E]">From {currentUser.area.areaName}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={radiusKm}
                  onChange={e => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-[#2B7A50]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Visibility */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">
                Who can view this offer?
              </label>
              <div className="space-y-2">
                {[
                  { id: 'public', label: 'Public Network', desc: 'Anyone in Riverside can request or match with this capacity.' },
                  { id: 'members', label: 'Verified Coordinators Only', desc: 'Placed in reserve for verified community leads.' }
                ].map(v => (
                  <label
                    key={v.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                      visibility === v.id ? 'border-[#2B7A50] bg-[#2B7A50]/10' : 'border-[#D9CFB9] dark:border-[#243E3B]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="offer-vis"
                      value={v.id}
                      checked={visibility === v.id}
                      onChange={() => setVisibility(v.id as Visibility)}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{v.label}</div>
                      <div className="text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1]">{v.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: "Here is where that's needed" (F4 P0 Acceptance requirement) */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B7A50] dark:text-[#6CC594]">
                <Sparkles className="w-4 h-4" />
                <span>Here is where that&apos;s needed right now:</span>
              </div>

              <div className="space-y-2.5">
                {matchingNeeds.map(need => (
                  <div
                    key={need.id}
                    className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{need.title}</span>
                      <span className="text-[10px] text-[#C8372D] font-bold">Needed {need.urgency}</span>
                    </div>
                    <p className="text-[11px] text-[#5B6B6E] line-clamp-1">{need.description}</p>
                    <div className="text-[10px] text-[#1F5C5A]">In Riverside East · 1.2 km away</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#D9CFB9]/60 dark:border-[#243E3B]/60 bg-[#FAF6EE] dark:bg-[#172A29] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5B6B6E] hover:text-[#1F2A2E] flex items-center gap-1 cursor-pointer"
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
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2B7A50] text-white hover:bg-[#236843] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2B7A50] text-white hover:bg-[#236843] active:scale-95 transition-all shadow-xs cursor-pointer font-bold"
            >
              Publish Offer & Connect
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
