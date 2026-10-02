import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { X, ShieldCheck, Lock, MapPin, Eye, Flag, Check } from 'lucide-react';

export const TrustSafetyModal: React.FC = () => {
  const { isTrustSafetyOpen, closeTrustSafetyModal, showToast } = useCommunity();
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isTrustSafetyOpen) return null;

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSubmitted(true);
    showToast('Report received. Community stewards review flagged items promptly and calmly.');
    setTimeout(() => {
      setReportSubmitted(false);
      setReportText('');
      closeTrustSafetyModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9CFB9]/60 dark:border-[#243E3B]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1F5C5A] dark:text-[#5FB3AE]" />
            <h3 className="font-display font-bold text-lg text-[#1F2A2E] dark:text-[#F3EEE2]">
              Trust, Safety & Community Privacy
            </h3>
          </div>

          <button
            onClick={closeTrustSafetyModal}
            className="p-1.5 rounded-lg text-[#5B6B6E] hover:text-[#1F2A2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B]">
              <MapPin className="w-5 h-5 text-[#1F5C5A] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">Approximate Locations Only</h4>
                <p className="text-[#5B6B6E] leading-relaxed mt-0.5">
                  Exact house numbers or private residential addresses are never displayed on public graphs or maps. Only approximate district pods and public staging venues are public.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B]">
              <Lock className="w-5 h-5 text-[#2B7A50] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">Mutual Consent Contact Exchange</h4>
                <p className="text-[#5B6B6E] leading-relaxed mt-0.5">
                  Phone numbers and email addresses are withheld until both the neighbour in need and the volunteer confirm the connection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFE7D6]/50 dark:bg-[#10201F]/50 border border-[#D9CFB9] dark:border-[#243E3B]">
              <ShieldCheck className="w-5 h-5 text-[#3D4F9F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">Verified Civic Organizations</h4>
                <p className="text-[#5B6B6E] leading-relaxed mt-0.5">
                  Schools, youth clubs, registered NGOs, and mutual aid groups are audited and carry verified civic badges.
                </p>
              </div>
            </div>
          </div>

          {/* Calm Reporting / Flagging form */}
          <div className="pt-3 border-t border-[#D9CFB9]/60 dark:border-[#243E3B]/60 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[#5B6B6E] flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5" />
              <span>Report or Flag Content Calmly</span>
            </h4>

            {reportSubmitted ? (
              <div className="p-3 rounded-xl bg-[#3E9B6B]/20 text-[#2B7A50] font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you. Your report has been dispatched to community moderators.</span>
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-2">
                <textarea
                  rows={2}
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                  placeholder="Notice an issue, duplicate, or safety concern? Let the moderators know..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#1F2A2E] dark:text-[#F3EEE2] placeholder-[#5B6B6E] focus:outline-none focus:ring-1 focus:ring-[#1F5C5A]"
                />
                <button
                  type="submit"
                  disabled={!reportText.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] text-[#1F2A2E] dark:text-[#F3EEE2] hover:bg-[#EFE7D6] cursor-pointer disabled:opacity-50"
                >
                  Submit Confidential Flag
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
