/**
 * The single place task status changes happen. Each transition is one atomic batch that
 * updates the task, records submissions/approvals, appends an activity log and notifies people.
 */
import { getDocs, query, serverTimestamp, where, writeBatch, type DocumentData } from 'firebase/firestore';
import { cancelSchema, decisionSchema, submissionSchema } from '../lib/schemas';
import { checkTransition, transitionPatch, type TransitionKind } from '../lib/workflow';
import type { Approval, Decision, Employee, Project, Task } from '../types';
import { COL, asWriter, auditCreate, colRef, db, docRef, newDocRef, notifyMany, rowsOf, touched, writeLog, writeNotification } from './db';

export interface TransitionContext {
  actor: Employee;
  task: Task;
  project: Project | null;
  /** Other tasks in the same milestone, to detect milestone completion. */
  milestoneTasks?: Task[];
  milestoneTitle?: string;
}

export interface TransitionOptions {
  /** SUBMIT */
  note?: string;
  fileRefs?: string[];
  /** APPROVE / REJECT */
  decision?: Decision;
  comment?: string;
  /** CANCEL */
  reason?: string;
}

async function pendingApprovals(task: Task): Promise<Approval[]> {
  const q = query(colRef(COL.approvals), where('projectId', '==', task.projectId), where('entityId', '==', task.id));
  const snap = await getDocs(q);
  return rowsOf<Approval>(snap).filter((a) => a.decision === null);
}

export async function performTransition(ctx: TransitionContext, kind: TransitionKind, opts: TransitionOptions = {}): Promise<void> {
  const { actor, task, project } = ctx;
  if (kind === 'CANCEL') cancelSchema.parse({ reason: opts.reason ?? '' });
  if (kind === 'REJECT') decisionSchema.parse({ decision: opts.decision ?? 'REJECTED', comment: opts.comment ?? '' });
  const check = checkTransition(actor, task, project, kind, { comment: opts.comment, reason: opts.reason });
  if (!check.ok) throw new Error(check.reason);

  const patch = transitionPatch(task, kind, { reason: opts.reason });
  const b = writeBatch(db);
  const w = asWriter(b);
  const taskRef = docRef(COL.tasks, task.id);
  const link = `/erp/tasks?task=${task.id}`;
  const update: DocumentData = { ...patch, ...touched(actor.id) };
  if (kind === 'APPROVE') update.completedAt = serverTimestamp();
  b.update(taskRef, update);

  const log = (action: string, summary: string, extra: Record<string, unknown> = {}) =>
    writeLog(w, actor.id, {
      entityType: 'task',
      entityId: task.id,
      projectId: task.projectId,
      departmentId: task.departmentId,
      action,
      summary,
      before: { status: task.status },
      after: { status: patch.status, ...extra },
    });

  switch (kind) {
    case 'START':
      log('started', `${actor.name} started ${task.code}`);
      if (task.ownerId !== actor.id) writeNotification(w, actor.id, { userId: task.ownerId, type: 'TASK_ASSIGNED', title: `${task.code} started`, body: `${actor.name} started “${task.title}”`, link });
      break;

    case 'SUBMIT': {
      const sub = submissionSchema.parse({ note: opts.note ?? '', fileRefs: opts.fileRefs ?? [] });
      const version = task.revisionCount + 1;
      const subRef = newDocRef(COL.submissions);
      b.set(subRef, { taskId: task.id, projectId: task.projectId, submittedBy: actor.id, note: sub.note, fileRefs: sub.fileRefs, version, status: 'SUBMITTED', ...auditCreate(actor.id) });
      b.set(newDocRef(COL.approvals), {
        entityType: 'task',
        entityId: task.id,
        projectId: task.projectId,
        departmentId: task.departmentId,
        submissionId: subRef.id,
        level: 1,
        reviewerId: task.reviewerId,
        requestedBy: actor.id,
        decision: null,
        comment: '',
        decidedAt: null,
        decidedBy: null,
        ...auditCreate(actor.id),
      });
      log('submitted', `${actor.name} submitted ${task.code} (v${version}) for approval`, { version });
      writeNotification(w, actor.id, { userId: task.reviewerId ?? '', type: 'APPROVAL_PENDING', title: `Approval needed: ${task.code}`, body: `${actor.name} submitted “${task.title}” (v${version})`, link: '/erp/approvals' });
      if (task.ownerId !== task.reviewerId) writeNotification(w, actor.id, { userId: task.ownerId, type: 'TASK_SUBMITTED', title: `${task.code} submitted`, body: `${actor.name} submitted v${version}`, link });
      break;
    }

    case 'APPROVE':
    case 'REJECT': {
      const decision: Decision = kind === 'APPROVE' ? 'APPROVED' : (opts.decision === 'CHANGES_REQUESTED' ? 'CHANGES_REQUESTED' : 'REJECTED');
      const comment = (opts.comment ?? '').trim();
      const pending = await pendingApprovals(task);
      if (pending.length === 0) {
        // A manager deciding directly (e.g. from Kanban) without a recorded request.
        b.set(newDocRef(COL.approvals), {
          entityType: 'task', entityId: task.id, projectId: task.projectId, departmentId: task.departmentId, submissionId: '',
          level: 1, reviewerId: actor.id, requestedBy: actor.id, decision, comment, decidedAt: serverTimestamp(), decidedBy: actor.id,
          ...auditCreate(actor.id),
        });
      }
      for (const a of pending) {
        b.update(docRef(COL.approvals, a.id), { decision, comment, decidedAt: serverTimestamp(), decidedBy: actor.id, ...touched(actor.id) });
        if (a.submissionId) b.update(docRef(COL.submissions, a.submissionId), { status: kind === 'APPROVE' ? 'APPROVED' : 'REJECTED', ...touched(actor.id) });
      }
      if (kind === 'APPROVE') {
        log('approved', `${actor.name} approved ${task.code}${comment ? `: ${comment}` : ''}`);
        notifyMany(w, actor.id, [...task.assigneeIds, task.ownerId], { type: 'TASK_APPROVED', title: `${task.code} approved`, body: comment || `“${task.title}” is complete`, link });
        const siblings = (ctx.milestoneTasks ?? []).filter((t) => t.id !== task.id && t.status !== 'CANCELLED');
        if (task.milestoneId && ctx.milestoneTasks && siblings.every((t) => t.status === 'COMPLETED') && project) {
          writeLog(w, actor.id, { entityType: 'milestone', entityId: task.milestoneId, projectId: task.projectId, departmentId: task.departmentId, action: 'completed', summary: `Milestone “${ctx.milestoneTitle ?? ''}” completed` });
          notifyMany(w, actor.id, [project.projectManagerId, ...task.assigneeIds], { type: 'MILESTONE_COMPLETED', title: `Milestone completed`, body: `${ctx.milestoneTitle ?? 'A milestone'} in ${project.code} is complete`, link: `/erp/projects/${project.id}` });
        }
      } else {
        log(decision === 'CHANGES_REQUESTED' ? 'changes_requested' : 'rejected', `${actor.name} ${decision === 'CHANGES_REQUESTED' ? 'requested changes on' : 'rejected'} ${task.code}: ${comment}`, { revisionCount: task.revisionCount + 1 });
        notifyMany(w, actor.id, task.assigneeIds, { type: 'TASK_REJECTED', title: `${task.code} needs changes`, body: comment, link });
      }
      break;
    }

    case 'CANCEL': {
      const pending = await pendingApprovals(task);
      for (const a of pending) b.update(docRef(COL.approvals, a.id), { decision: 'REJECTED', comment: 'Task cancelled', decidedAt: serverTimestamp(), decidedBy: actor.id, ...touched(actor.id) });
      log('cancelled', `${actor.name} cancelled ${task.code}: ${opts.reason}`, { cancelReason: opts.reason });
      notifyMany(w, actor.id, task.assigneeIds, { type: 'TASK_REASSIGNED', title: `${task.code} cancelled`, body: opts.reason ?? '', link });
      break;
    }

    case 'REOPEN':
    case 'REINSTATE':
      log(kind === 'REOPEN' ? 'reopened' : 'reinstated', `${actor.name} ${kind === 'REOPEN' ? 'reopened' : 'reinstated'} ${task.code}`);
      notifyMany(w, actor.id, task.assigneeIds, { type: 'TASK_REASSIGNED', title: `${task.code} ${kind === 'REOPEN' ? 'reopened' : 'reinstated'}`, body: task.title, link });
      break;
  }
  await b.commit();
}
