/** zod validation for every write the ERP performs. */
import { z } from 'zod';
import {
  CLIENT_STATUSES,
  DECISIONS,
  LEAD_SOURCES,
  MILESTONE_STATUSES,
  PRIORITIES,
  PROJECT_STATUSES,
  ROLES,
} from '../types';

const id = z.string().min(1).max(128);
const text = (max: number) => z.string().trim().max(max);
const required = (max: number, label: string) => z.string().trim().min(1, `${label} is required`).max(max);
const optionalDate = z.date().nullable();

export const departmentSchema = z.object({
  name: required(80, 'Name'),
  code: required(12, 'Code').regex(/^[A-Z0-9_-]+$/, 'Code must be upper-case letters/digits'),
  headId: id.nullable(),
  active: z.boolean(),
});
export type DepartmentInput = z.infer<typeof departmentSchema>;

export const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email('Valid email required'),
  name: required(100, 'Name'),
  role: z.enum(ROLES),
  departmentId: id.nullable(),
  designation: text(80),
});
export type InviteInput = z.infer<typeof inviteSchema>;

export const employeeUpdateSchema = z.object({
  name: required(100, 'Name'),
  phone: text(30),
  departmentId: id.nullable(),
  role: z.enum(ROLES),
  designation: text(80),
  managerId: id.nullable(),
  active: z.boolean(),
  weeklyCapacityHours: z.number().min(0).max(80),
});
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;

export const clientSchema = z.object({
  name: required(120, 'Client name'),
  company: text(120),
  contactPerson: text(100),
  phone: text(30),
  email: z.union([z.literal(''), z.string().trim().email('Invalid email')]),
  address: text(300),
  departmentIds: z.array(id).max(20),
  status: z.enum(CLIENT_STATUSES),
});
export type ClientInput = z.infer<typeof clientSchema>;

export const projectSchema = z
  .object({
    name: required(140, 'Project name'),
    clientId: required(128, 'Client'),
    departmentId: required(128, 'Department'),
    projectManagerId: required(128, 'Project manager'),
    memberIds: z.array(id).max(100),
    startDate: optionalDate,
    endDate: optionalDate,
    priority: z.enum(PRIORITIES),
    budget: z.number().min(0).max(1e12),
    description: text(4000),
    status: z.enum(PROJECT_STATUSES),
    clientVisible: z.boolean(),
  })
  .refine((p) => !p.startDate || !p.endDate || p.endDate >= p.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  // The project manager is always a member, so membership-based rules include them.
  .transform((p) => ({ ...p, memberIds: Array.from(new Set([p.projectManagerId, ...p.memberIds])) }));
export type ProjectInput = z.input<typeof projectSchema>;

export const milestoneSchema = z.object({
  projectId: id,
  title: required(140, 'Title'),
  description: text(2000),
  dueDate: optionalDate,
  order: z.number().int().min(0).max(10000),
  status: z.enum(MILESTONE_STATUSES),
  deliverables: z.array(text(200)).max(50),
});
export type MilestoneInput = z.infer<typeof milestoneSchema>;

export const taskSchema = z
  .object({
    title: required(200, 'Title'),
    description: text(8000),
    projectId: required(128, 'Project'),
    milestoneId: id.nullable(),
    ownerId: required(128, 'Owner'),
    assigneeIds: z.array(id).min(1, 'Assign at least one person').max(20),
    reviewerId: id.nullable(),
    priority: z.enum(PRIORITIES),
    startDate: optionalDate,
    dueDate: optionalDate,
    estimatedHours: z.number().min(0).max(10000),
    blockedByTaskIds: z.array(id).max(20),
    tags: z.array(text(30)).max(20),
  })
  .refine((t) => !t.startDate || !t.dueDate || t.dueDate >= t.startDate, {
    message: 'Due date must be after start date',
    path: ['dueDate'],
  })
  .transform((t) => ({ ...t, assigneeIds: Array.from(new Set([t.ownerId, ...t.assigneeIds])) }));
export type TaskInput = z.input<typeof taskSchema>;

export const checklistItemSchema = z.object({ text: required(300, 'Checklist item') });
export const commentSchema = z.object({ body: required(5000, 'Comment') });
export const submissionSchema = z.object({ note: text(5000), fileRefs: z.array(id).max(20) });
export const decisionSchema = z
  .object({ decision: z.enum(DECISIONS), comment: text(5000) })
  .refine((d) => d.decision === 'APPROVED' || d.comment.length > 0, {
    message: 'Feedback is required when rejecting or requesting changes',
    path: ['comment'],
  });
export const cancelSchema = z.object({ reason: required(1000, 'Cancellation reason') });
export const timeEntrySchema = z.object({
  minutes: z.number().int().min(1, 'At least 1 minute').max(24 * 60),
  note: text(500),
});

export const leadSchema = z.object({
  source: z.enum(LEAD_SOURCES),
  name: text(120),
  email: z.union([z.literal(''), z.string().trim().email('Valid email required').max(200)]),
  phone: text(40),
  company: text(160),
  service: text(160),
  message: text(4000),
  extra: z.record(z.string(), z.string().max(500)).refine((r) => Object.keys(r).length <= 15, 'Too many fields'),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const settingsSchema = z.object({
  orgName: required(80, 'Organisation name'),
  defaultWeeklyCapacityHours: z.number().min(1).max(80),
  deadlineWarningHours: z.number().int().min(1).max(168),
  allowMultipleAssignees: z.boolean(),
  timeTrackingEnabled: z.boolean(),
});

/** Turn a zod error into a single readable message. */
export function firstIssue(err: unknown): string {
  if (err instanceof z.ZodError) return err.issues[0]?.message ?? 'Invalid input';
  if (err instanceof Error) return err.message;
  return String(err);
}

/** Pull @mentions out of a comment body, resolving against employee names/emails. */
export function extractMentions(body: string, people: { id: string; name: string; email: string }[]): string[] {
  const lower = body.toLowerCase();
  return people
    .filter((p) => {
      const handle = p.email.split('@')[0].toLowerCase();
      const first = p.name.split(' ')[0].toLowerCase();
      return lower.includes(`@${handle}`) || (first.length > 1 && lower.includes(`@${first}`));
    })
    .map((p) => p.id);
}
