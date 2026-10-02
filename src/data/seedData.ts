import {
  Need,
  Resource,
  Person,
  Organization,
  Situation,
  Task,
  Match,
  SituationUpdate,
  Lesson
} from '../types';

export const SEED_SITUATIONS: Situation[] = [
  {
    id: 'sit-riverside-water',
    title: 'Riverside Clean Water Support',
    summary: 'A main water line burst in eastern Riverside. Neighbours and local volunteers are helping bring clean drinking water to elderly residents, clinics, and families.',
    area: {
      areaName: 'Eastern Riverside',
      lat: 45.518,
      lng: -122.678,
      descriptor: 'East River District'
    },
    status: 'active',
    leadIds: ['p-marcus', 'p-dr-aris'],
    needsCount: 4,
    needsMetCount: 2,
    createdAt: '2026-09-28T08:00:00Z'
  },
  {
    id: 'sit-winter-shelter-2025',
    title: 'Winter Freeze Warmth Hubs 2025',
    summary: 'Organized warm shelters and thermos soup distribution during the record December cold spell. 180 neighbours stayed safe and warm.',
    area: {
      areaName: 'Central Riverside',
      lat: 45.52,
      lng: -122.675,
      descriptor: 'Central District'
    },
    status: 'resolved',
    leadIds: ['p-dr-aris', 'p-elena'],
    needsCount: 5,
    needsMetCount: 5,
    createdAt: '2025-12-10T06:00:00Z',
    resolvedAt: '2025-12-22T18:00:00Z',
    lessonId: 'lesson-winter-2025'
  }
];

export const SEED_NEEDS: Need[] = [
  {
    id: 'need-water-elderly',
    authorId: 'p-martha',
    authorName: 'Martha Jenkins',
    title: 'Drinking water jugs for elderly neighbours at Oak Court',
    description: '14 senior residents in apartments without lifts cannot carry heavy water jugs up stairs. We need helpers to bring containers to their doors.',
    category: 'water',
    urgency: 'today',
    locationApprox: { areaName: 'Oak Court Senior Apartments', lat: 45.519, lng: -122.676 },
    status: 'open',
    situationId: 'sit-riverside-water',
    visibility: 'public',
    createdAt: '2026-09-28T09:30:00Z'
  },
  {
    id: 'need-transport-truck',
    authorId: 'p-dr-aris',
    authorName: 'Dr. Aris Thorne',
    title: 'Pickup truck to move water tanks to the community clinic',
    description: 'We need a truck with straps to move two 200-litre clean water containers from the supply station to the health clinic.',
    category: 'transport',
    urgency: 'today',
    locationApprox: { areaName: 'Riverside Community Clinic', lat: 45.517, lng: -122.677 },
    status: 'in_progress',
    situationId: 'sit-riverside-water',
    visibility: 'public',
    createdAt: '2026-09-28T11:00:00Z'
  },
  {
    id: 'need-volunteers-distribution',
    authorId: 'p-elena',
    authorName: 'Elena Rostova',
    title: '2 volunteers to hand out water containers at St. Jude Hall',
    description: 'Looking for friendly neighbours to help guide cars and carry clean water bottles into cars for 2 hours this afternoon.',
    category: 'care',
    urgency: 'this_week',
    locationApprox: { areaName: 'St. Jude Community Hall', lat: 45.513, lng: -122.674 },
    status: 'open',
    situationId: 'sit-riverside-water',
    visibility: 'public',
    createdAt: '2026-09-29T08:00:00Z'
  },
  {
    id: 'need-pump-repair',
    authorId: 'p-tariq',
    authorName: 'Tariq Al-Mansoor',
    title: 'High-pressure garden hoses for the backup well pump',
    description: 'Need two 25-metre clean hoses to connect the standby well pump to the temporary water storage tanks.',
    category: 'tools',
    urgency: 'this_week',
    locationApprox: { areaName: 'East Well Station', lat: 45.516, lng: -122.673 },
    status: 'met',
    situationId: 'sit-riverside-water',
    visibility: 'public',
    createdAt: '2026-09-28T10:15:00Z'
  }
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: 'res-pickup-trucks',
    ownerType: 'person',
    ownerId: 'p-marcus',
    ownerName: 'Marcus Chen',
    kind: 'vehicle',
    title: 'Pickup truck with tie-down straps',
    description: 'Available with a driver all afternoon to shuttle drinking water and heavy boxes anywhere in Riverside.',
    quantity: '1 truck with driver',
    availabilityWindow: 'Today from 1:00 PM to 6:00 PM',
    radiusKm: 15,
    locationApprox: { areaName: 'North Riverside', lat: 45.524, lng: -122.682 },
    status: 'available',
    visibility: 'public',
    createdAt: '2026-09-28T09:00:00Z'
  },
  {
    id: 'res-water-cans',
    ownerType: 'person',
    ownerId: 'p-elena',
    ownerName: 'Elena Rostova',
    kind: 'supplies',
    title: '15 clean 20-litre water containers',
    description: 'Clean, food-safe plastic containers with carry handles and easy-pour spigots.',
    quantity: '15 containers',
    availabilityWindow: 'Ready for pickup anytime',
    radiusKm: 8,
    locationApprox: { areaName: 'Central Riverside', lat: 45.519, lng: -122.678 },
    status: 'available',
    visibility: 'public',
    createdAt: '2026-09-28T09:45:00Z'
  },
  {
    id: 'res-st-jude-hall',
    ownerType: 'org',
    ownerId: 'org-st-jude',
    ownerName: 'St. Jude School & Hall',
    kind: 'space',
    title: 'Covered hall & parking lot for water distribution',
    description: 'Dry ground-floor hall with wide double doors and plenty of space to park and load cars.',
    quantity: 'Full hall & apron',
    availabilityWindow: 'Open all week',
    radiusKm: 5,
    locationApprox: { areaName: 'St. Jude Campus', lat: 45.513, lng: -122.674 },
    status: 'committed',
    visibility: 'public',
    createdAt: '2026-09-28T09:15:00Z'
  },
  {
    id: 'res-volunteer-hours',
    ownerType: 'person',
    ownerId: 'p-maya-l',
    ownerName: 'Maya Lin',
    kind: 'time',
    title: 'Volunteer helper (lifting & carrying)',
    description: 'Happy to help carry boxes, walk up stairs, or help hand out supplies.',
    quantity: '3 hours this afternoon',
    availabilityWindow: 'Today 2:00 PM - 5:00 PM',
    radiusKm: 6,
    locationApprox: { areaName: 'Riverside Central', lat: 45.519, lng: -122.68 },
    status: 'available',
    visibility: 'public',
    createdAt: '2026-09-29T14:00:00Z'
  }
];

export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-st-jude',
    name: 'St. Jude Community School',
    type: 'school',
    description: 'Local public community school serving Riverside families with after-school activities and community facilities.',
    verified: true,
    area: { areaName: 'St. Jude Campus', lat: 45.513, lng: -122.674 },
    contactMethod: 'office@stjudecivic.org',
    capacityNote: 'Large parking area, indoor hall, clean water taps.',
    membersCount: 42,
    activeSituationIds: ['sit-riverside-water'],
    createdAt: '2024-09-01T08:00:00Z'
  },
  {
    id: 'org-rna',
    name: 'Riverside Neighbourhood Association',
    type: 'neighbourhood_association',
    description: 'Resident volunteer group connecting neighbours across Riverside.',
    verified: true,
    area: { areaName: 'Central Riverside', lat: 45.52, lng: -122.68 },
    contactMethod: 'contact@riversidena.org',
    capacityNote: 'Volunteer phone tree and local street leads.',
    membersCount: 65,
    activeSituationIds: ['sit-riverside-water'],
    createdAt: '2023-01-15T09:00:00Z'
  }
];

export const SEED_PEOPLE: Person[] = [
  {
    id: 'p-marcus',
    displayName: 'Marcus Chen',
    avatarStyle: 'MC',
    role: 'Neighbour with Truck',
    area: { areaName: 'North Riverside', lat: 45.524, lng: -122.682 },
    language: 'English',
    skills: ['Driving', 'Heavy lifting'],
    availability: 'Afternoons',
    visibility: 'public',
    pastReliability: 98,
    completedCommitments: 19,
    createdAt: '2025-05-10T08:00:00Z'
  },
  {
    id: 'p-dr-aris',
    displayName: 'Dr. Aris Thorne',
    avatarStyle: 'AT',
    role: 'Retired Water Engineer',
    area: { areaName: 'Riverside East', lat: 45.518, lng: -122.675 },
    language: 'English',
    skills: ['Plumbing', 'Water testing'],
    availability: 'Daily',
    visibility: 'public',
    pastReliability: 100,
    completedCommitments: 24,
    createdAt: '2024-11-03T10:00:00Z'
  },
  {
    id: 'p-elena',
    displayName: 'Elena Rostova',
    avatarStyle: 'ER',
    role: 'Community Nurse',
    area: { areaName: 'Central Riverside', lat: 45.519, lng: -122.678 },
    language: 'English',
    skills: ['Elderly check-ins', 'First aid'],
    availability: 'Tues & Thurs',
    visibility: 'public',
    pastReliability: 96,
    completedCommitments: 15,
    createdAt: '2025-02-14T11:00:00Z'
  },
  {
    id: 'p-maya-l',
    displayName: 'Maya Lin',
    avatarStyle: 'ML',
    role: 'Student Volunteer',
    area: { areaName: 'Riverside Central', lat: 45.519, lng: -122.68 },
    language: 'English',
    skills: ['Carrying', 'Helping at tables'],
    availability: 'Afternoons',
    visibility: 'public',
    pastReliability: 92,
    completedCommitments: 7,
    createdAt: '2025-09-01T16:00:00Z'
  }
];

export const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    situationId: 'sit-riverside-water',
    needId: 'need-water-elderly',
    title: 'Carry 5 water bottles to Martha at Oak Court (Apt 304)',
    ownerType: null,
    ownerId: null,
    ownerName: null,
    resourceId: 'res-water-cans',
    dueAt: 'Today, by 3:00 PM',
    status: 'open'
  },
  {
    id: 'task-2',
    situationId: 'sit-riverside-water',
    needId: 'need-transport-truck',
    title: 'Drive clean water containers to the health clinic',
    ownerType: 'person',
    ownerId: 'p-marcus',
    ownerName: 'Marcus Chen',
    resourceId: 'res-pickup-trucks',
    dueAt: 'Today, 2:30 PM',
    status: 'claimed'
  },
  {
    id: 'task-3',
    situationId: 'sit-riverside-water',
    needId: 'need-volunteers-distribution',
    title: 'Help hand out water bottles at St. Jude Hall table',
    ownerType: null,
    ownerId: null,
    ownerName: null,
    resourceId: null,
    dueAt: 'Today, 4:00 PM',
    status: 'open'
  }
];

export const SEED_MATCHES: Match[] = [
  {
    id: 'match-1',
    needId: 'need-water-elderly',
    needTitle: 'Drinking water jugs for elderly neighbours at Oak Court',
    resourceId: 'res-water-cans',
    resourceTitle: '15 clean 20-litre water containers (Elena Rostova)',
    score: 95,
    reasons: [
      'Right match: Clean containers ready for drinking water',
      'Nearby: Elena lives 3 blocks away',
      'Ready now: Available for pickup today'
    ],
    state: 'suggested',
    createdAt: '2026-09-28T10:00:00Z'
  },
  {
    id: 'match-2',
    needId: 'need-volunteers-distribution',
    needTitle: '2 volunteers to hand out water containers at St. Jude Hall',
    resourceId: 'res-volunteer-hours',
    resourceTitle: 'Volunteer helper (Maya Lin)',
    score: 92,
    reasons: [
      'Free this afternoon from 2pm to 5pm',
      'Lives in Central Riverside within walking distance',
      'Ready to help with lifting and distribution'
    ],
    state: 'suggested',
    createdAt: '2026-09-29T15:00:00Z'
  }
];

export const SEED_UPDATES: SituationUpdate[] = [
  {
    id: 'upd-1',
    situationId: 'sit-riverside-water',
    authorId: 'p-marcus',
    authorName: 'Marcus Chen',
    tag: 'update',
    body: 'First round of water containers delivered to the St. Jude Hall. The clinic has full supply for the rest of today.',
    createdAt: '2026-09-28T15:30:00Z'
  },
  {
    id: 'upd-2',
    situationId: 'sit-riverside-water',
    authorId: 'p-martha',
    authorName: 'Martha Jenkins',
    tag: 'thanks',
    body: 'Thank you so much to whoever carried the water jugs up the stairs for us. We really appreciate it.',
    createdAt: '2026-09-29T11:15:00Z'
  }
];

export const SEED_LESSONS: Lesson[] = [
  {
    id: 'lesson-winter-2025',
    situationId: 'sit-winter-shelter-2025',
    situationTitle: 'Winter Freeze Warmth Hubs 2025',
    whatWorked: 'Setting up warm hubs at the local school and faith hall early helped 180 neighbours stay warm. Having a simple list of volunteer drivers with snow tires kept things moving smoothly.',
    whatWasMissing: 'We ran low on thermal blankets on the second night and had to ask for emergency donations.',
    tags: ['Cold Weather', 'Shelters', 'Hot Meals'],
    helpers: ['St. Jude School', 'Elena Rostova', 'Marcus Chen', 'Neighbours on Elm Street'],
    playbookTemplate: {
      recurringNeeds: [
        'Extra thermal blankets and warm coats',
        'Large thermos flasks for hot tea and soup',
        'Drivers with all-weather vehicles'
      ],
      suggestedRoles: [
        'Hall Welcome Steward',
        'Soup & Hot Drinks Helper',
        'Check-in Driver'
      ],
      estimatedDays: 4
    },
    createdAt: '2025-12-23T10:00:00Z'
  }
];
