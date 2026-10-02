export type EntityType = 'need' | 'resource' | 'person' | 'organization' | 'situation';

export type UrgencyLevel = 'today' | 'this_week' | 'ongoing';
export type NeedStatus = 'open' | 'in_progress' | 'met' | 'closed';
export type SituationStatus = 'forming' | 'active' | 'resolving' | 'resolved';
export type ResourceStatus = 'available' | 'committed' | 'idle';
export type ResourceKind = 'time' | 'skill' | 'space' | 'equipment' | 'money' | 'knowledge' | 'supplies' | 'vehicle';
export type Visibility = 'public' | 'members' | 'private';
export type TaskStatus = 'open' | 'claimed' | 'done';

export interface LocationApprox {
  areaName: string;
  lat: number;
  lng: number;
  descriptor?: string; // e.g. "Riverside North (approx)"
}

export interface Person {
  id: string;
  displayName: string;
  avatarStyle: string; // seed for avatar or initials
  role?: string;
  area: LocationApprox;
  language: string;
  skills: string[];
  availability: string;
  visibility: Visibility;
  pastReliability: number; // 0 - 100
  completedCommitments: number;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'ngo' | 'school' | 'club' | 'business' | 'neighbourhood_association' | 'institution';
  description: string;
  verified: boolean;
  area: LocationApprox;
  contactMethod: string;
  capacityNote: string;
  membersCount: number;
  activeSituationIds: string[];
  createdAt: string;
}

export interface Resource {
  id: string;
  ownerType: 'person' | 'org';
  ownerId: string;
  ownerName: string;
  kind: ResourceKind;
  title: string;
  description: string;
  quantity: string;
  availabilityWindow: string;
  radiusKm: number;
  locationApprox: LocationApprox;
  status: ResourceStatus;
  visibility: Visibility;
  createdAt: string;
}

export interface Need {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  category: 'water' | 'food' | 'shelter' | 'transport' | 'tools' | 'health' | 'education' | 'care';
  urgency: UrgencyLevel;
  locationApprox: LocationApprox;
  status: NeedStatus;
  situationId: string | null;
  visibility: Visibility;
  photoUrl?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  situationId: string;
  needId?: string | null;
  title: string;
  ownerType: 'person' | 'org' | null;
  ownerId: string | null;
  ownerName: string | null;
  resourceId?: string | null;
  dueAt: string;
  status: TaskStatus;
}

export interface MatchReason {
  label: string;
  weight: number;
  description: string;
}

export interface Match {
  id: string;
  needId: string;
  needTitle: string;
  resourceId: string;
  resourceTitle: string;
  score: number; // 0 to 100
  reasons: string[];
  state: 'suggested' | 'confirmed' | 'declined';
  confirmedBy?: string;
  createdAt: string;
}

export interface SituationUpdate {
  id: string;
  situationId: string;
  authorId: string;
  authorName: string;
  tag: 'update' | 'ask' | 'thanks';
  body: string;
  createdAt: string;
}

export interface PlaybookTemplate {
  recurringNeeds: string[];
  suggestedRoles: string[];
  estimatedDays: number;
}

export interface Lesson {
  id: string;
  situationId: string;
  situationTitle: string;
  whatWorked: string;
  whatWasMissing: string;
  tags: string[];
  helpers: string[];
  playbookTemplate: PlaybookTemplate;
  createdAt: string;
}

export interface Situation {
  id: string;
  title: string;
  summary: string;
  area: LocationApprox;
  status: SituationStatus;
  leadIds: string[];
  needsCount: number;
  needsMetCount: number;
  createdAt: string;
  resolvedAt?: string | null;
  lessonId?: string | null;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  status?: string;
  urgency?: UrgencyLevel;
  situationId?: string | null;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  data: Person | Organization | Resource | Need | Situation;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'hub' | 'matched' | 'suggested' | 'member';
  pulse?: boolean;
}
