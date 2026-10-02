import React, { useEffect } from 'react';
import { useCommunity } from '../context/CommunityContext';
import {
  X,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  User,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const NodeDetailPanel: React.FC = () => {
  const {
    selectedEntity,
    clearSelectedEntity,
    openSituationRoom,
    openOfferHelpModal,
    openPostNeedModal,
    showToast,
    needs,
    resources,
    situations
  } = useCommunity();

  // Handle ESC key to dismiss panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearSelectedEntity();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelectedEntity]);

  if (!selectedEntity) return null;

  const { type, data } = selectedEntity;

  // Primary action based on PRD Section F2
  const handlePrimaryAction = () => {
    if (type === 'need') {
      clearSelectedEntity();
      openOfferHelpModal();
    } else if (type === 'resource') {
      showToast(`Requested resource "${data.title}". Connecting with local coordinator.`);
      clearSelectedEntity();
    } else if (type === 'situation') {
      clearSelectedEntity();
      openSituationRoom(data.id);
    } else if (type === 'person' || type === 'organization') {
      showToast(`Contact request sent to ${data.displayName || data.name}. Details shared upon mutual agreement.`);
      clearSelectedEntity();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={clearSelectedEntity} />

      {/* Slide-over Container */}
      <div className="relative w-full max-w-md h-full bg-[#FAF6EE] dark:bg-[#172A29] border-l border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'need' && <span className="w-3 h-3 rounded-full bg-[#F2A93B]" />}
            {type === 'resource' && <span className="w-3 h-3 rounded-full bg-[#3E9B6B]" />}
            {type === 'situation' && <span className="w-3 h-3 rounded-full bg-[#1F5C5A]" />}
            {type === 'organization' && <span className="w-3 h-3 rounded-full bg-[#3D4F9F]" />}
            {type === 'person' && <span className="w-3 h-3 rounded-full bg-[#E8684A]" />}
            
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6B6E] dark:text-[#8F9FA1]">
              {type} Details
            </span>
          </div>

          <button
            onClick={clearSelectedEntity}
            className="p-1.5 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Title & Status */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5B6B6E] dark:text-[#8F9FA1] mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{data.locationApprox?.areaName || data.area?.areaName || 'Riverside'} (Approximate)</span>
              {data.urgency && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className={data.urgency === 'today' ? 'text-[#C8372D] font-bold' : ''}>
                    Urgency: {data.urgency}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2] leading-snug">
              {data.title || data.name || data.displayName}
            </h2>

            {data.status && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFE7D6] dark:bg-[#10201F] text-[#1F2A2E] dark:text-[#F3EEE2] border border-[#D9CFB9] dark:border-[#243E3B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5C5A]" />
                <span className="capitalize">{data.status.replace('_', ' ')}</span>
              </div>
            )}
          </div>

          {/* Description Prose */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5B6B6E] dark:text-[#8F9FA1]">
              Overview
            </h4>
            <p className="text-sm text-[#1F2A2E] dark:text-[#F3EEE2] leading-relaxed">
              {data.description || data.summary || data.capacityNote || 'Active community participant.'}
            </p>
          </div>

          {/* Specific Attributes by Type */}
          {type === 'need' && (
            <div className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Requested by</span>
                <span className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{data.authorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Category</span>
                <span className="font-semibold capitalize text-[#1F2A2E] dark:text-[#F3EEE2]">{data.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Visibility</span>
                <span className="font-semibold capitalize text-[#1F2A2E] dark:text-[#F3EEE2]">{data.visibility}</span>
              </div>
            </div>
          )}

          {type === 'resource' && (
            <div className="p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Offered by</span>
                <span className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{data.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Quantity / Capacity</span>
                <span className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{data.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Availability</span>
                <span className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{data.availabilityWindow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B6E] dark:text-[#8F9FA1]">Service Radius</span>
                <span className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{data.radiusKm} km</span>
              </div>
            </div>
          )}

          {type === 'person' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5B6B6E] dark:text-[#8F9FA1]">
                Opt-in Skills & Capacity
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.skills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#EFE7D6] dark:bg-[#10201F] text-[#1F2A2E] dark:text-[#F3EEE2] border border-[#D9CFB9] dark:border-[#243E3B]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
                <span>Availability: </span>
                <strong className="text-[#1F2A2E] dark:text-[#F3EEE2]">{data.availability}</strong>
              </div>
            </div>
          )}

          {type === 'organization' && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#1F5C5A] dark:text-[#5FB3AE] font-semibold bg-[#1F5C5A]/10 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Civic Organization</span>
              </div>
              <div className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
                <span>Community Members: </span>
                <strong className="text-[#1F2A2E] dark:text-[#F3EEE2]">{data.membersCount}</strong>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-[#EFE7D6]/60 dark:bg-[#10201F]/60 border border-[#D9CFB9] dark:border-[#243E3B] text-[11px] text-[#5B6B6E] dark:text-[#8F9FA1] space-y-1">
            <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">Trust & Safety Protocol</div>
            <p>
              Exact home addresses are never shown publicly. Contact details are securely exchanged only after mutual agreement.
            </p>
          </div>

        </div>

        {/* Panel Footer CTA Button */}
        <div className="p-4 border-t border-[#D9CFB9]/60 dark:border-[#243E3B]/60 bg-[#FAF6EE] dark:bg-[#172A29]">
          <button
            onClick={handlePrimaryAction}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
              type === 'need'
                ? 'bg-[#2B7A50] text-white hover:bg-[#236843]'
                : type === 'resource'
                ? 'bg-[#1F5C5A] text-white hover:bg-[#164543]'
                : type === 'situation'
                ? 'bg-[#1F5C5A] text-white hover:bg-[#164543]'
                : 'bg-[#1F5C5A] text-white hover:bg-[#164543]'
            }`}
          >
            {type === 'need' && <span>Offer Help for this Need</span>}
            {type === 'resource' && <span>Connect Resource to Open Need</span>}
            {type === 'situation' && <span>Open Situation Room</span>}
            {(type === 'person' || type === 'organization') && <span>Say Hello (Contact Request)</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
