import React from 'react';
import { useCommunity } from '../context/CommunityContext';
import { X, Building, ShieldCheck, Layers, Package, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const OrgConsoleModal: React.FC = () => {
  const { isOrgConsoleOpen, closeOrgConsole, organizations, resources, situations, openSituationRoom } = useCommunity();

  if (!isOrgConsoleOpen) return null;

  const org = organizations[0]; // Green Wheel Logistics or anchor
  const orgResources = resources.filter(r => r.ownerId === org.id);
  const idleResources = orgResources.filter(r => r.status === 'idle');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#3D4F9F] dark:text-[#8E9CE0]" />
            <h3 className="font-display font-bold text-lg text-[#1F2A2E] dark:text-[#F3EEE2]">
              Organization Operations Console
            </h3>
          </div>

          <button
            onClick={closeOrgConsole}
            className="p-1.5 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Org Profile Header */}
          <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{org.name}</h4>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1F5C5A] bg-[#1F5C5A]/10 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Civic Partner</span>
                </span>
              </div>
              <span className="text-[#5B6B6E]">{org.membersCount} members</span>
            </div>

            <p className="text-[#5B6B6E] leading-relaxed">{org.description}</p>
            <div className="text-[11px] text-[#1F5C5A] font-semibold">
              Capacity Note: {org.capacityNote}
            </div>
          </div>

          {/* Active Efforts Mobilized */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#5B6B6E]">
              Active Situations Supported
            </h4>
            <div className="p-3.5 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B] flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">
                  Riverside Water Shortage Response
                </div>
                <div className="text-[11px] text-[#5B6B6E]">
                  Dedicated 1x 5,000L Stainless Potable Tanker & Daily Shuttle Driver
                </div>
              </div>
              <button
                onClick={() => {
                  closeOrgConsole();
                  openSituationRoom('sit-riverside-water');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1F5C5A] text-white hover:bg-[#164543] cursor-pointer"
              >
                Open Situation Room
              </button>
            </div>
          </div>

          {/* Pledged Resources & Idle Capacity */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#5B6B6E]">
              Pledged Resources & Idle Capacity Management
            </h4>
            <div className="space-y-2">
              {resources.slice(0, 3).map(res => (
                <div
                  key={res.id}
                  className="p-3 rounded-lg bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#1F2A2E] dark:text-[#F3EEE2]">{res.title}</div>
                    <div className="text-[11px] text-[#5B6B6E]">Quantity: {res.quantity} · Window: {res.availabilityWindow}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                      res.status === 'committed'
                        ? 'bg-[#1F5C5A]/15 text-[#1F5C5A]'
                        : res.status === 'idle'
                        ? 'bg-[#3E9B6B]/20 text-[#2B7A50]'
                        : 'bg-[#EFE7D6] text-[#5B6B6E]'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
