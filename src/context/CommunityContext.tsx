import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  EntityType,
  Need,
  Resource,
  Person,
  Organization,
  Situation,
  Task,
  Match,
  SituationUpdate,
  Lesson,
  PlaybookTemplate
} from '../types';
import {
  SEED_SITUATIONS,
  SEED_NEEDS,
  SEED_RESOURCES,
  SEED_ORGANIZATIONS,
  SEED_PEOPLE,
  SEED_TASKS,
  SEED_MATCHES,
  SEED_UPDATES,
  SEED_LESSONS
} from '../data/seedData';

interface MatchCelebrationData {
  needTitle: string;
  resourceTitle: string;
  score: number;
}

interface CommunityContextType {
  situations: Situation[];
  needs: Need[];
  resources: Resource[];
  organizations: Organization[];
  people: Person[];
  tasks: Task[];
  matches: Match[];
  updates: SituationUpdate[];
  lessons: Lesson[];
  selectedEntity: { type: EntityType; id: string; data: any } | null;
  activeView: 'constellation' | 'map' | 'list';
  theme: 'light' | 'dark';
  currentUser: Person;
  userRole: 'resident' | 'volunteer' | 'coordinator' | 'moderator';
  searchQuery: string;
  filterTypes: Record<EntityType, boolean>;
  filterUrgency: string;
  filterCategory: string;
  activePage: 'network' | 'situations' | 'situation-room' | 'needs' | 'commons' | 'memory' | 'my-space' | 'explore';
  activeSituationId: string | null;
  matchCelebration: MatchCelebrationData | null;
  toastMessage: string | null;
  isPostNeedOpen: boolean;
  isOfferHelpOpen: boolean;
  isCloseLoopOpen: boolean;
  isOrgConsoleOpen: boolean;
  isSearchModalOpen: boolean;
  isTrustSafetyOpen: boolean;
  // Actions
  setActiveView: (view: 'constellation' | 'map' | 'list') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setUserRole: (role: 'resident' | 'volunteer' | 'coordinator' | 'moderator') => void;
  setSearchQuery: (query: string) => void;
  setFilterTypes: React.Dispatch<React.SetStateAction<Record<EntityType, boolean>>>;
  toggleEntityTypeFilter: (type: EntityType) => void;
  setFilterUrgency: (urgency: string) => void;
  setFilterCategory: (category: string) => void;
  setActivePage: (page: 'network' | 'situations' | 'situation-room' | 'needs' | 'commons' | 'memory' | 'my-space' | 'explore') => void;
  openSituationRoom: (situationId: string) => void;
  selectEntity: (type: EntityType, id: string) => void;
  clearSelectedEntity: () => void;
  openPostNeedModal: () => void;
  closePostNeedModal: () => void;
  openOfferHelpModal: () => void;
  closeOfferHelpModal: () => void;
  openCloseLoopModal: () => void;
  closeCloseLoopModal: () => void;
  openOrgConsole: () => void;
  closeOrgConsole: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openTrustSafetyModal: () => void;
  closeTrustSafetyModal: () => void;
  showToast: (msg: string) => void;
  dismissToast: () => void;
  addNeed: (needData: Partial<Need>, targetSituationId?: string | null) => { need: Need; joinedSituation?: Situation };
  addResource: (resourceData: Partial<Resource>) => Resource;
  confirmMatch: (matchId: string) => void;
  declineMatch: (matchId: string) => void;
  claimTask: (taskId: string) => void;
  toggleTaskDone: (taskId: string) => void;
  addSituationUpdate: (situationId: string, tag: 'update' | 'ask' | 'thanks', body: string) => void;
  resolveSituation: (situationId: string, whatWorked: string, whatWasMissing: string, tags: string[]) => void;
  createSituationFromPlaybook: (lesson: Lesson, customTitle?: string) => Situation;
  checkDuplicateNudges: (text: string) => Array<{ need: Need; situation?: Situation; similarityReason: string }>;
  resetToSeedData: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const STORAGE_KEY = 'common_thread_state_v2';

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [situations, setSituations] = useState<Situation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_situations');
    return saved ? JSON.parse(saved) : SEED_SITUATIONS;
  });

  const [needs, setNeeds] = useState<Need[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_needs');
    return saved ? JSON.parse(saved) : SEED_NEEDS;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_resources');
    return saved ? JSON.parse(saved) : SEED_RESOURCES;
  });

  const [organizations] = useState<Organization[]>(SEED_ORGANIZATIONS);
  const [people] = useState<Person[]>(SEED_PEOPLE);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_tasks');
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_matches');
    return saved ? JSON.parse(saved) : SEED_MATCHES;
  });

  const [updates, setUpdates] = useState<SituationUpdate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_updates');
    return saved ? JSON.parse(saved) : SEED_UPDATES;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_lessons');
    return saved ? JSON.parse(saved) : SEED_LESSONS;
  });

  // UI state
  const [activeView, setActiveView] = useState<'constellation' | 'map' | 'list'>('constellation');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => { try { const v = localStorage.getItem('ct-theme'); if (v === 'dark' || v === 'light') return v; } catch {} return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; });
  const [userRole, setUserRole] = useState<'resident' | 'volunteer' | 'coordinator' | 'moderator'>('volunteer');
  const [activePage, setActivePage] = useState<'network' | 'situations' | 'situation-room' | 'needs' | 'commons' | 'memory' | 'my-space' | 'explore'>('network');
  const [activeSituationId, setActiveSituationId] = useState<string | null>('sit-riverside-water');
  const [selectedEntity, setSelectedEntity] = useState<{ type: EntityType; id: string; data: any } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState<Record<EntityType, boolean>>({
    situation: true,
    need: true,
    resource: true,
    person: true,
    organization: true
  });
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals & Overlays
  const [isPostNeedOpen, setIsPostNeedOpen] = useState(false);
  const [isOfferHelpOpen, setIsOfferHelpOpen] = useState(false);
  const [isCloseLoopOpen, setIsCloseLoopOpen] = useState(false);
  const [isOrgConsoleOpen, setIsOrgConsoleOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTrustSafetyOpen, setIsTrustSafetyOpen] = useState(false);

  const [matchCelebration, setMatchCelebration] = useState<MatchCelebrationData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme to root element
  useEffect(() => { try { localStorage.setItem('ct-theme', theme); } catch {} }, [theme]);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Persist modified collections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_situations', JSON.stringify(situations));
  }, [situations]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_needs', JSON.stringify(needs));
  }, [needs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_resources', JSON.stringify(resources));
  }, [resources]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_matches', JSON.stringify(matches));
  }, [matches]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_updates', JSON.stringify(updates));
  }, [updates]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const currentUser = useMemo(() => {
    if (userRole === 'resident') return people.find(p => p.id === 'p-martha') || people[0];
    if (userRole === 'coordinator') return people.find(p => p.id === 'p-marcus') || people[0];
    if (userRole === 'moderator') return people.find(p => p.id === 'p-dr-aris') || people[0];
    return people.find(p => p.id === 'p-maya-l') || people[0]; // volunteer default
  }, [userRole, people]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const toggleEntityTypeFilter = (type: EntityType) => {
    setFilterTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToastMessage(null);

  const openSituationRoom = (situationId: string) => {
    setActiveSituationId(situationId);
    setActivePage('situation-room');
    setSelectedEntity(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectEntity = (type: EntityType, id: string) => {
    let data: any = null;
    if (type === 'situation') data = situations.find(s => s.id === id);
    else if (type === 'need') data = needs.find(n => n.id === id);
    else if (type === 'resource') data = resources.find(r => r.id === id);
    else if (type === 'person') data = people.find(p => p.id === id);
    else if (type === 'organization') data = organizations.find(o => o.id === id);

    if (data) {
      setSelectedEntity({ type, id, data });
    }
  };

  const clearSelectedEntity = () => setSelectedEntity(null);

  // Duplicate Nudge algorithm (Section 10.3)
  const checkDuplicateNudges = (text: string) => {
    if (!text || text.trim().length < 3) return [];
    const query = text.toLowerCase();
    const keywords = ['water', 'tank', 'elderly', 'pump', 'truck', 'deliver', 'food', 'garden', 'tool', 'repair', 'translat', 'soup', 'infant', 'formula'];
    const matchedKeywords = keywords.filter(k => query.includes(k));

    if (matchedKeywords.length === 0 && query.length < 6) return [];

    return needs
      .filter(n => n.status !== 'closed')
      .filter(n => {
        const titleMatch = n.title.toLowerCase();
        const descMatch = n.description.toLowerCase();
        return (
          matchedKeywords.some(kw => titleMatch.includes(kw) || descMatch.includes(kw)) ||
          titleMatch.includes(query) ||
          query.includes(n.category)
        );
      })
      .slice(0, 3)
      .map(n => {
        const sit = situations.find(s => s.id === n.situationId);
        return {
          need: n,
          situation: sit,
          similarityReason: `Similar request in ${sit ? sit.title : n.locationApprox.areaName} regarding ${n.category}`
        };
      });
  };

  // Add Need (F3)
  const addNeed = (needData: Partial<Need>, targetSituationId?: string | null) => {
    const id = `need-${Date.now()}`;
    const sitId = targetSituationId !== undefined ? targetSituationId : 'sit-riverside-water';

    const newNeed: Need = {
      id,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      title: needData.title || 'Community Request',
      description: needData.description || '',
      category: needData.category || 'water',
      urgency: needData.urgency || 'today',
      locationApprox: needData.locationApprox || {
        areaName: currentUser.area.areaName,
        lat: currentUser.area.lat,
        lng: currentUser.area.lng
      },
      status: 'open',
      situationId: sitId,
      visibility: needData.visibility || 'public',
      createdAt: new Date().toISOString()
    };

    setNeeds(prev => [newNeed, ...prev]);

    // Update situation count
    let joinedSituation: Situation | undefined;
    if (sitId) {
      setSituations(prev =>
        prev.map(s => {
          if (s.id === sitId) {
            joinedSituation = { ...s, needsCount: s.needsCount + 1 };
            return joinedSituation;
          }
          return s;
        })
      );
    }

    // Auto calculate match with available resources
    const matchingResource = resources.find(
      r => r.status === 'available' && (r.title.toLowerCase().includes(newNeed.category) || r.kind === 'time')
    ) || resources[0];

    if (matchingResource) {
      const matchId = `match-${Date.now()}`;
      const newMatch: Match = {
        id: matchId,
        needId: newNeed.id,
        needTitle: newNeed.title,
        resourceId: matchingResource.id,
        resourceTitle: `${matchingResource.title} (${matchingResource.ownerName})`,
        score: 89,
        reasons: [
          `Category fit: 38/40 (${matchingResource.kind} directly relates to ${newNeed.category})`,
          `Distance: 24/25 (Located ~1.2 km away)`,
          `Availability: 18/20 (Available in current window)`,
          `Reliability: 9/10 (High verified track record)`
        ],
        state: 'suggested',
        createdAt: new Date().toISOString()
      };
      setMatches(prev => [newMatch, ...prev]);
    }

    showToast(`Thank you. Your request is now part of the picture.`);
    return { need: newNeed, joinedSituation };
  };

  // Add Resource (F4)
  const addResource = (resourceData: Partial<Resource>) => {
    const id = `res-${Date.now()}`;
    const newRes: Resource = {
      id,
      ownerType: 'person',
      ownerId: currentUser.id,
      ownerName: currentUser.displayName,
      kind: resourceData.kind || 'time',
      title: resourceData.title || 'Community Offer',
      description: resourceData.description || '',
      quantity: resourceData.quantity || '1',
      availabilityWindow: resourceData.availabilityWindow || 'This week',
      radiusKm: resourceData.radiusKm || 10,
      locationApprox: resourceData.locationApprox || {
        areaName: currentUser.area.areaName,
        lat: currentUser.area.lat,
        lng: currentUser.area.lng
      },
      status: 'available',
      visibility: resourceData.visibility || 'public',
      createdAt: new Date().toISOString()
    };

    setResources(prev => [newRes, ...prev]);

    // Check open needs to suggest immediate match
    const openNeed = needs.find(n => n.status === 'open');
    if (openNeed) {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        needId: openNeed.id,
        needTitle: openNeed.title,
        resourceId: newRes.id,
        resourceTitle: `${newRes.title} (${newRes.ownerName})`,
        score: 93,
        reasons: [
          `Skill & resource fit: 39/40 (Direct assistance offer)`,
          `Distance: 25/25 (Immediate vicinity)`,
          `Availability: 19/20 (Offered actively for this week)`,
          `Volunteer commitment bonus: 10/10`
        ],
        state: 'suggested',
        createdAt: new Date().toISOString()
      };
      setMatches(prev => [newMatch, ...prev]);
    }

    showToast(`Offer published! We're connecting your capacity to local needs.`);
    return newRes;
  };

  // Confirm match with celebration moment (F7, Section 8.7)
  const confirmMatch = (matchId: string) => {
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    // Trigger Match Moment Celebration
    setMatchCelebration({
      needTitle: targetMatch.needTitle,
      resourceTitle: targetMatch.resourceTitle,
      score: targetMatch.score
    });

    // Update match state
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId ? { ...m, state: 'confirmed', confirmedBy: currentUser.displayName } : m
      )
    );

    // Update resource state to committed
    setResources(prev =>
      prev.map(r => (r.id === targetMatch.resourceId ? { ...r, status: 'committed' } : r))
    );

    // Update target need status
    setNeeds(prev =>
      prev.map(n => {
        if (n.id === targetMatch.needId) {
          // If need belongs to situation, bump met count
          if (n.situationId) {
            setSituations(sits =>
              sits.map(s => {
                if (s.id === n.situationId) {
                  return { ...s, needsMetCount: Math.min(s.needsCount, s.needsMetCount + 1) };
                }
                return s;
              })
            );
          }
          return { ...n, status: 'in_progress' };
        }
        return n;
      })
    );

    // Create or claim a coordinated task automatically
    const newTask: Task = {
      id: `task-${Date.now()}`,
      situationId: activeSituationId || 'sit-riverside-water',
      needId: targetMatch.needId,
      title: `Coordinate ${targetMatch.resourceTitle} for ${targetMatch.needTitle}`,
      ownerType: 'person',
      ownerId: currentUser.id,
      ownerName: currentUser.displayName,
      resourceId: targetMatch.resourceId,
      dueAt: 'Today, within 3 hours',
      status: 'claimed'
    };
    setTasks(prev => [newTask, ...prev]);

    // Clear celebration after 2.8s
    setTimeout(() => {
      setMatchCelebration(null);
    }, 2800);

    showToast(`Match confirmed! Solid thread connected between need and resource.`);
  };

  const declineMatch = (matchId: string) => {
    setMatches(prev =>
      prev.map(m => (m.id === matchId ? { ...m, state: 'declined' } : m))
    );
    showToast(`Match suggestion dismissed.`);
  };

  // Claim task in 1-tap (F6)
  const claimTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'claimed',
              ownerType: 'person',
              ownerId: currentUser.id,
              ownerName: currentUser.displayName
            }
          : t
      )
    );
    showToast(`You claimed this task. Thank you for stepping up!`);
  };

  // Toggle task done (F6)
  const toggleTaskDone = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newStatus = t.status === 'done' ? 'claimed' : 'done';
          if (newStatus === 'done' && t.needId) {
            // Check if need can be marked met
            setNeeds(allNeeds =>
              allNeeds.map(n => (n.id === t.needId ? { ...n, status: 'met' } : n))
            );
            // Increase situation met count
            if (t.situationId) {
              setSituations(sits =>
                sits.map(s =>
                  s.id === t.situationId
                    ? { ...s, needsMetCount: Math.min(s.needsCount, s.needsMetCount + 1) }
                    : s
                )
              );
            }
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
    showToast(`Task updated. This situation is one step closer to resolved.`);
  };

  // Add situation update (F6)
  const addSituationUpdate = (situationId: string, tag: 'update' | 'ask' | 'thanks', body: string) => {
    const newUpd: SituationUpdate = {
      id: `upd-${Date.now()}`,
      situationId,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      tag,
      body,
      createdAt: new Date().toISOString()
    };
    setUpdates(prev => [newUpd, ...prev]);
    showToast(`Notice posted to situation updates.`);
  };

  // Close the loop and create lesson (F8)
  const resolveSituation = (
    situationId: string,
    whatWorked: string,
    whatWasMissing: string,
    tags: string[]
  ) => {
    const sit = situations.find(s => s.id === situationId);
    if (!sit) return;

    const lessonId = `lesson-${Date.now()}`;
    const newLesson: Lesson = {
      id: lessonId,
      situationId,
      situationTitle: sit.title,
      whatWorked,
      whatWasMissing,
      tags: tags.length ? tags : ['Civic Coordination', 'Rapid Deployment', 'Mutual Aid'],
      helpers: [
        currentUser.displayName,
        'Marcus Chen',
        'St. Jude Community School',
        'Green Wheel Logistics',
        'Elena Rostova',
        '18 Neighbours'
      ],
      playbookTemplate: {
        recurringNeeds: [
          'Direct door-to-door water check-ins for mobility-impaired residents',
          'Heavy flatbed transport shuttle with secured strap mounts',
          'Multilingual advisory flyers (Spanish, Somali, Mandarin)',
          'Pre-allocated emergency fuel reimbursement voucher pool'
        ],
        suggestedRoles: [
          'Logistics Fleet Dispatcher',
          'Door-to-door Welfare Marshall',
          'Language & Public Health Translator',
          'Hardware & Hydraulic Valve Technician'
        ],
        estimatedDays: 4
      },
      createdAt: new Date().toISOString()
    };

    setLessons(prev => [newLesson, ...prev]);

    setSituations(prev =>
      prev.map(s =>
        s.id === situationId
          ? {
              ...s,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              lessonId,
              needsMetCount: s.needsCount
            }
          : s
      )
    );

    setIsCloseLoopOpen(false);
    showToast(`Situation marked resolved. Lesson preserved in community memory.`);
  };

  // Create situation from playbook template (F8)
  const createSituationFromPlaybook = (lesson: Lesson, customTitle?: string) => {
    const newSitId = `sit-pb-${Date.now()}`;
    const newSit: Situation = {
      id: newSitId,
      title: customTitle || `New Effort: ${lesson.situationTitle} Playbook`,
      summary: `Mobilized using playbook from ${lesson.situationTitle}. Focus: ${lesson.playbookTemplate.recurringNeeds.slice(0, 2).join('; ')}.`,
      area: currentUser.area,
      status: 'active',
      leadIds: [currentUser.id],
      needsCount: lesson.playbookTemplate.recurringNeeds.length,
      needsMetCount: 0,
      createdAt: new Date().toISOString()
    };

    setSituations(prev => [newSit, ...prev]);

    // Pre-seed needs from recurring needs in playbook
    const newNeeds: Need[] = lesson.playbookTemplate.recurringNeeds.map((rn, idx) => ({
      id: `need-pb-${Date.now()}-${idx}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      title: rn,
      description: `Established recurring requirement from past lesson: ${lesson.situationTitle}.`,
      category: 'tools',
      urgency: idx === 0 ? 'today' : 'this_week',
      locationApprox: currentUser.area,
      status: 'open',
      situationId: newSitId,
      visibility: 'public',
      createdAt: new Date().toISOString()
    }));

    setNeeds(prev => [...newNeeds, ...prev]);

    // Pre-seed tasks from suggested roles
    const newTasks: Task[] = lesson.playbookTemplate.suggestedRoles.map((role, idx) => ({
      id: `task-pb-${Date.now()}-${idx}`,
      situationId: newSitId,
      title: `Role: ${role}`,
      ownerType: null,
      ownerId: null,
      ownerName: null,
      dueAt: 'Day 1 setup',
      status: 'open'
    }));

    setTasks(prev => [...newTasks, ...prev]);

    openSituationRoom(newSitId);
    showToast(`Playbook deployed! Pre-filled with ${newNeeds.length} needs and roles.`);
    return newSit;
  };

  const resetToSeedData = () => {
    setSituations(SEED_SITUATIONS);
    setNeeds(SEED_NEEDS);
    setResources(SEED_RESOURCES);
    setTasks(SEED_TASKS);
    setMatches(SEED_MATCHES);
    setUpdates(SEED_UPDATES);
    setLessons(SEED_LESSONS);
    localStorage.removeItem(STORAGE_KEY + '_situations');
    localStorage.removeItem(STORAGE_KEY + '_needs');
    localStorage.removeItem(STORAGE_KEY + '_resources');
    localStorage.removeItem(STORAGE_KEY + '_tasks');
    localStorage.removeItem(STORAGE_KEY + '_matches');
    localStorage.removeItem(STORAGE_KEY + '_updates');
    localStorage.removeItem(STORAGE_KEY + '_lessons');
    showToast('Reset to original seed data.');
  };

  return (
    <CommunityContext.Provider
      value={{
        situations,
        needs,
        resources,
        organizations,
        people,
        tasks,
        matches,
        updates,
        lessons,
        selectedEntity,
        activeView,
        theme,
        currentUser,
        userRole,
        searchQuery,
        filterTypes,
        filterUrgency,
        filterCategory,
        activePage,
        activeSituationId,
        matchCelebration,
        toastMessage,
        isPostNeedOpen,
        isOfferHelpOpen,
        isCloseLoopOpen,
        isOrgConsoleOpen,
        isSearchModalOpen,
        isTrustSafetyOpen,
        setActiveView,
        setTheme,
        toggleTheme,
        setUserRole,
        setSearchQuery,
        setFilterTypes,
        toggleEntityTypeFilter,
        setFilterUrgency,
        setFilterCategory,
        setActivePage,
        openSituationRoom,
        selectEntity,
        clearSelectedEntity,
        openPostNeedModal: () => setIsPostNeedOpen(true),
        closePostNeedModal: () => setIsPostNeedOpen(false),
        openOfferHelpModal: () => setIsOfferHelpOpen(true),
        closeOfferHelpModal: () => setIsOfferHelpOpen(false),
        openCloseLoopModal: () => setIsCloseLoopOpen(true),
        closeCloseLoopModal: () => setIsCloseLoopOpen(false),
        openOrgConsole: () => setIsOrgConsoleOpen(true),
        closeOrgConsole: () => setIsOrgConsoleOpen(false),
        openSearchModal: () => setIsSearchModalOpen(true),
        closeSearchModal: () => setIsSearchModalOpen(false),
        openTrustSafetyModal: () => setIsTrustSafetyOpen(true),
        closeTrustSafetyModal: () => setIsTrustSafetyOpen(false),
        showToast,
        dismissToast,
        addNeed,
        addResource,
        confirmMatch,
        declineMatch,
        claimTask,
        toggleTaskDone,
        addSituationUpdate,
        resolveSituation,
        createSituationFromPlaybook,
        checkDuplicateNudges,
        resetToSeedData
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
