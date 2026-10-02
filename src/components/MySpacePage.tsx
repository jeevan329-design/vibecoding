import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { User, CheckCircle2, Clock, AlertCircle, Package, Bell, Shield, ArrowRight } from 'lucide-react';

export const MySpacePage: React.FC = () => {
  const {
    currentUser,
    userRole,
    setUserRole,
    needs,
    resources,
    tasks,
    toggleTaskDone,
    openPostNeedModal,
    openOfferHelpModal,
    openSituationRoom
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<'committed' | 'asked' | 'offered' | 'notifications'>('committed');

  // I Asked
  const myAsks = needs.filter(n => n.authorId === currentUser.id);

  // I Offered
  const myOffers = resources.filter(r => r.ownerId === currentUser.id);

  // I Committed To
  const myTasks = tasks.filter(t => t.ownerId === currentUser.id);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Match Proposed',
      desc: 'Your offered flatbed truck was matched with the Community Clinic water shuttle.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Task Due Reminder',
      desc: 'Deliver potable water jugs to Oak Court Seniors due at 2:00 PM.',
      time: '4 hours ago',
      read: true
    },
    {
      id: 'notif-3',
      title: 'Situation Update',
      desc: 'Dr. Aris Thorne updated: East Well standby pump testing scheduled for 5pm.',
      time: 'Yesterday',
      read: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1F5C5A] text-white flex items-center justify-center font-display font-bold text-xl shadow-md">
            {currentUser.avatarStyle}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
                {currentUser.displayName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1F5C5A]/10 text-[#1F5C5A] dark:text-[#5FB3AE] font-semibold capitalize">
                {userRole}
              </span>
            </div>
            <p className="text-xs text-[#5B6B6E] dark:text-[#8F9FA1] mt-0.5">
              {currentUser.area.areaName} · {currentUser.completedCommitments} Completed Commitments · {currentUser.pastReliability}% Reliability
            </p>
          </div>
        </div>

        {/* Perspective Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#EFE7D6]/60 dark:bg-[#10201F]/60 border border-[#D9CFB9] dark:border-[#243E3B]">
          <span className="text-xs font-semibold text-[#5B6B6E] px-2">Role:</span>
          {(['volunteer', 'resident', 'coordinator', 'moderator'] as const).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                userRole === role
                  ? 'bg-[#1F5C5A] text-white shadow-xs'
                  : 'text-[#5B6B6E] hover:text-[#1F2A2E]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Row (I committed to, I asked, I offered, Notifications) */}
      <div className="flex items-center gap-2 border-b border-[#D9CFB9] dark:border-[#243E3B] pb-2">
        <button
          onClick={() => setActiveTab('committed')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'committed'
              ? 'bg-[#1F5C5A] text-white shadow-xs'
              : 'text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2]'
          }`}
        >
          I Committed To ({myTasks.length})
        </button>

        <button
          onClick={() => setActiveTab('asked')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'asked'
              ? 'bg-[#1F5C5A] text-white shadow-xs'
              : 'text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2]'
          }`}
        >
          I Asked ({myAsks.length})
        </button>

        <button
          onClick={() => setActiveTab('offered')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'offered'
              ? 'bg-[#1F5C5A] text-white shadow-xs'
              : 'text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2]'
          }`}
        >
          I Offered ({myOffers.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'bg-[#1F5C5A] text-white shadow-xs'
              : 'text-[#5B6B6E] hover:text-[#1F2A2E] dark:hover:text-[#F3EEE2]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>
      </div>

      {/* TAB: I COMMITTED TO */}
      {activeTab === 'committed' && (
        <div className="space-y-4">
          {myTasks.length === 0 ? (
            <div className="p-12 text-center bg-[#FAF6EE] dark:bg-[#172A29] rounded-2xl border border-[#D9CFB9] dark:border-[#243E3B] space-y-3">
              <p className="text-sm text-[#5B6B6E]">You have no active task commitments right now.</p>
              <button
                onClick={() => openSituationRoom('sit-riverside-water')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2B7A50] text-white cursor-pointer"
              >
                Browse Riverside Tasks to Claim
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTasks.map(t => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F5C5A] dark:text-[#5FB3AE]">
                        Status: {t.status === 'done' ? 'Completed' : 'Claimed'}
                      </span>
                      <span className="text-[#5B6B6E] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{t.dueAt}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">
                      {t.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#D9CFB9]/50 flex items-center justify-between">
                    <button
                      onClick={() => toggleTaskDone(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        t.status === 'done'
                          ? 'bg-[#EFE7D6] dark:bg-[#10201F] text-[#5B6B6E]'
                          : 'bg-[#2B7A50] text-white hover:bg-[#236843]'
                      }`}
                    >
                      {t.status === 'done' ? 'Mark In Progress' : 'Mark Completed'}
                    </button>

                    <button
                      onClick={() => openSituationRoom(t.situationId)}
                      className="text-xs font-semibold text-[#1F5C5A] hover:underline"
                    >
                      View Situation &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: I ASKED */}
      {activeTab === 'asked' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5B6B6E]">Requests you published</span>
            <button
              onClick={openPostNeedModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F2A93B] text-[#1F2A2E] cursor-pointer"
            >
              + Post New Need
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAsks.map(n => (
              <div
                key={n.id}
                className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8A5A00] bg-[#F2A93B]/20 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>
                  <span className="capitalize font-semibold text-[#1F5C5A]">{n.status}</span>
                </div>
                <h4 className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{n.title}</h4>
                <p className="text-xs text-[#5B6B6E] line-clamp-2">{n.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: I OFFERED */}
      {activeTab === 'offered' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5B6B6E]">Resources you pledged</span>
            <button
              onClick={openOfferHelpModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2B7A50] text-white cursor-pointer"
            >
              + Offer Help
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myOffers.map(r => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2B7A50] bg-[#3E9B6B]/20 px-2 py-0.5 rounded-md">
                    {r.kind}
                  </span>
                  <span className="capitalize font-semibold text-[#1F5C5A]">{r.status}</span>
                </div>
                <h4 className="text-sm font-bold text-[#1F2A2E] dark:text-[#F3EEE2]">{r.title}</h4>
                <p className="text-xs text-[#5B6B6E] line-clamp-2">{r.description}</p>
                <div className="text-[11px] text-[#5B6B6E]">Capacity: {r.quantity} · {r.availabilityWindow}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-3 max-w-2xl">
          {notifications.map(n => (
            <div
              key={n.id}
              className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-[#172A29] border border-[#D9CFB9] dark:border-[#243E3B] space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1F2A2E] dark:text-[#F3EEE2]">{n.title}</span>
                <span className="text-[#5B6B6E] text-[11px]">{n.time}</span>
              </div>
              <p className="text-[#5B6B6E] dark:text-[#8F9FA1]">{n.desc}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
