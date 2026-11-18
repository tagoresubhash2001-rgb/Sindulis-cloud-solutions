import type { Timestamp } from 'firebase/firestore';

export const ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'DEPARTMENT_HEAD',
  'PROJECT_MANAGER',
  'TEAM_LEADER',
  'EMPLOYEE',
  'VIEWER',
] as const;
export type Role = (typeof ROLES)[number];

export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'WAITING_APPROVAL', 'COMPLETED', 'CANCELLED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PROJECT_STATUSES = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const MILESTONE_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const CLIENT_STATUSES = ['ACTIVE', 'INACTIVE', 'PROSPECT'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const DECISIONS = ['APPROVED', 'REJECTED', 'CHANGES_REQUESTED'] as const;
export type Decision = (typeof DECISIONS)[number];

export const LEAD_SOURCES = [
  'portal-waitlist',
  'techlis-contact',
  'techlis-quote',
  'sinfox-contact',
  'sinfox-quote',
  'edulis-contact',
  'edulis-enroll',
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Anything with a millisecond clock: Firestore Timestamp, Date, or test doubles. */
export type DateLike = { toMillis(): number } | Date | null | undefined;

export interface Audit {
  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
  isArchived: boolean;
  archivedAt?: Timestamp | null;
  archivedBy?: string | null;
}

export interface WithId {
  id: string;
}

export interface Department extends Audit, WithId {
  name: string;
  code: string;
  headId: string | null;
  active: boolean;
}

export interface Employee extends Audit, WithId {
  name: string;
  email: string;
  phone: string;
  departmentId: string | null;
  role: Role;
  designation: string;
  managerId: string | null;
  active: boolean;
  avatarUrl: string | null;
  weeklyCapacityHours: number;
}

export interface Invite extends Audit, WithId {
  email: string;
  name: string;
  role: Role;
  departmentId: string | null;
  designation: string;
  claimedBy: string | null;
}

export interface Client extends Audit, WithId {
  code: string;
  name: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  departmentIds: string[];
  status: ClientStatus;
}

export interface Project extends Audit, WithId {
  code: string;
  name: string;
  clientId: string;
  departmentId: string;
  projectManagerId: string;
  memberIds: string[];
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  priority: Priority;
  budget: number;
  description: string;
  status: ProjectStatus;
  clientVisible: boolean;
}

export interface Milestone extends Audit, WithId {
  projectId: string;
  departmentId: string;
  title: string;
  description: string;
  dueDate: Timestamp | null;
  order: number;
  status: MilestoneStatus;
  deliverables: string[];
}

export interface Task extends Audit, WithId {
  code: string;
  title: string;
  description: string;
  projectId: string;
  milestoneId: string | null;
  departmentId: string;
  ownerId: string;
  assigneeIds: string[];
  reviewerId: string | null;
  priority: Priority;
  startDate: Timestamp | null;
  dueDate: Timestamp | null;
  estimatedHours: number;
  actualHours: number;
  status: TaskStatus;
  checklistTotal: number;
  checklistDone: number;
  blockedByTaskIds: string[];
  revisionCount: number;
  completedAt: Timestamp | null;
  cancelReason: string | null;
  tags: string[];
}

export interface ChecklistItem extends Audit, WithId {
  taskId: string;
  projectId: string;
  text: string;
  done: boolean;
  doneBy: string | null;
  doneAt: Timestamp | null;
  order: number;
}

export interface Submission extends Audit, WithId {
  taskId: string;
  projectId: string;
  submittedBy: string;
  note: string;
  fileRefs: string[];
  version: number;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

export interface Approval extends Audit, WithId {
  entityType: 'task';
  entityId: string;
  projectId: string;
  departmentId: string;
  submissionId: string;
  level: number;
  reviewerId: string;
  requestedBy: string;
  decision: Decision | null;
  comment: string;
  decidedAt: Timestamp | null;
  decidedBy: string | null;
}

export interface Comment extends Audit, WithId {
  projectId: string;
  taskId: string | null;
  authorId: string;
  body: string;
  mentions: string[];
  editedAt: Timestamp | null;
}

export interface ProjectFile extends Audit, WithId {
  projectId: string;
  taskId: string | null;
  name: string;
  storagePath: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  version: number;
}

export interface ActivityLog extends WithId {
  entityType: string;
  entityId: string;
  projectId: string | null;
  departmentId: string | null;
  action: string;
  summary: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  actorId: string;
  at: Timestamp | null;
}

export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_REASSIGNED'
  | 'DEADLINE_APPROACHING'
  | 'TASK_OVERDUE'
  | 'TASK_SUBMITTED'
  | 'APPROVAL_PENDING'
  | 'TASK_APPROVED'
  | 'TASK_REJECTED'
  | 'MILESTONE_COMPLETED'
  | 'PROJECT_DEADLINE'
  | 'COMMENT'
  | 'MENTION';

export interface AppNotification extends WithId {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: Timestamp | null;
  createdBy: string;
}

export interface TimeEntry extends Audit, WithId {
  taskId: string;
  projectId: string;
  employeeId: string;
  start: Timestamp | null;
  end: Timestamp | null;
  minutes: number;
  note: string;
}

export interface ArchiveRecord extends WithId {
  originalCollection: string;
  originalId: string;
  originalProjectId: string | null;
  departmentId: string | null;
  title: string;
  finalStatus: string;
  historicalOwnerId: string | null;
  archivedAt: Timestamp | null;
  archivedBy: string;
  documentRefs: string[];
  restoredAt: Timestamp | null;
  restoredBy: string | null;
}

export interface Lead extends WithId {
  source: LeadSource;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  extra: Record<string, string>;
  status: LeadStatus;
  createdAt: Timestamp | null;
}

export interface OrgSettings {
  orgName: string;
  defaultWeeklyCapacityHours: number;
  deadlineWarningHours: number;
  allowMultipleAssignees: boolean;
  timeTrackingEnabled: boolean;
}

export const DEFAULT_SETTINGS: OrgSettings = {
  orgName: 'SINDULIS',
  defaultWeeklyCapacityHours: 40,
  deadlineWarningHours: 24,
  allowMultipleAssignees: true,
  timeTrackingEnabled: true,
};
