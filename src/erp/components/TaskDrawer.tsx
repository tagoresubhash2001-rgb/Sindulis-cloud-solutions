import { AlertTriangle, Archive, Check, Clock, Pause, Pencil, Play, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLive } from '../hooks/useLive';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtAgo, fmtDate, fmtDateTime } from '../lib/dates';
import { canArchive, canManageProject, canManageTasks, canWorkOnTask } from '../lib/permissions';
import { checkTransition, isOverdue, openBlockers, TRANSITIONS, type TransitionKind } from '../lib/workflow';
import { subscribeEntityActivity } from '../services/activity';
import { subscribeSubmissions } from '../services/approvals';
import { archiveEntity } from '../services/archive';
import { addChecklistItem, removeChecklistItem, subscribeChecklist, toggleChecklistItem } from '../services/checklists';
import { COL } from '../services/db';
import { subscribeProjectFiles } from '../services/files';
import { logTime, subscribeTimeEntries } from '../services/timeEntries';
import { performTransition } from '../services/workflow';
import type { ActivityLog, ChecklistItem, ProjectFile, Submission, Task, TimeEntry } from '../types';
import { ActivityList, CommentThread, FileList, UploadButton } from './Collab';
import { TaskForm } from './forms';
import { TransitionDialog } from './TransitionDialog';
import { AvatarStack, Badge, Button, ConfirmDialog, EmptyState, ErrorBanner, Input, PriorityBadge, ProgressBar, Spinner, StatusBadge, Tabs } from './ui';

type Tab = 'details' | 'checklist' | 'work' | 'comments' | 'files' | 'time' | 'history';

const ACTION_STYLE: Partial<Record<TransitionKind, 'primary' | 'success' | 'danger' | 'secondary'>> = { START: 'primary', SUBMIT: 'primary', APPROVE: 'success', REJECT: 'danger', CANCEL: 'secondary', REOPEN: 'secondary', REINSTATE: 'secondary' };
const IMMEDIATE: TransitionKind[] = ['START', 'REOPEN', 'REINSTATE'];

export function TaskDrawerBody({ task }: { task: Task }) {
  const ws = useWorkspace();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('details');
  const [dialog, setDialog] = useState<TransitionKind | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [busy, setBusy] = useState<TransitionKind | null>(null);
  const project = ws.project(task.projectId) ?? null;
  const checklist = useLive<ChecklistItem[]>((d, e) => subscribeChecklist(task, d, e), [task.id], []);
  const files = useLive<ProjectFile[]>((d, e) => subscribeProjectFiles(task.projectId, d, e), [task.projectId], []);
  const taskFiles = files.data.filter((f) => f.taskId === task.id && !f.isArchived);
  const blockers = openBlockers(task, ws.tasks);
  const actions = TRANSITIONS.filter((t) => checkTransition(ws.me, task, project, t.kind, { comment: 'x', reason: 'x' }).ok);
  const canEdit = !task.isArchived && canManageTasks(ws.me, project);
  const pendingReview = ws.approvals.find((a) => a.entityId === task.id && a.decision === null);

  const run = async (kind: TransitionKind) => {
    if (!IMMEDIATE.includes(kind)) return setDialog(kind);
    setBusy(kind);
    await toast.run(() => performTransition({ actor: ws.me, task, project }, kind), `${task.code} updated`);
    setBusy(null);
  };

  return (
    <div>
      <div className="px-4 sm:px-5 py-3 border-b border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {isOverdue(task) && <Badge tone="red">Overdue</Badge>}
          {task.revisionCount > 0 && <Badge tone="amber">Revision {task.revisionCount}</Badge>}
          {task.isArchived && <Badge>Archived</Badge>}
        </div>
        {blockers.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 ring-1 ring-amber-200 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Blocked by {blockers.map((id) => ws.task(id)?.code ?? id).join(', ')} — these are not completed yet.</span>
          </div>
        )}
        {task.status === 'IN_PROGRESS' && task.revisionCount > 0 && <LatestFeedback task={task} />}
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button key={a.kind} size="sm" variant={ACTION_STYLE[a.kind]} loading={busy === a.kind} onClick={() => run(a.kind)} data-testid={`action-${a.kind}`}>
              {a.kind === 'START' && <Play className="w-3.5 h-3.5" />}
              {a.kind === 'APPROVE' && <Check className="w-3.5 h-3.5" />}
              {a.kind === 'SUBMIT' && task.revisionCount > 0 ? 'Resubmit for approval' : a.label}
            </Button>
          ))}
          {canEdit && <Button size="sm" variant="ghost" onClick={() => setEditing(true)}><Pencil className="w-3.5 h-3.5" /> Edit</Button>}
          {!task.isArchived && canArchive(ws.me, task.departmentId) && ['COMPLETED', 'CANCELLED'].includes(task.status) && (
            <Button size="sm" variant="ghost" onClick={() => setConfirmArchive(true)} data-testid="archive-task"><Archive className="w-3.5 h-3.5" /> Archive</Button>
          )}
          {!task.isArchived && project && canManageProject(ws.me, project) && !canArchive(ws.me, task.departmentId) && ['COMPLETED', 'CANCELLED'].includes(task.status) && (
            <span className="text-[11px] text-slate-400 self-center">Ask an admin or department head to archive.</span>
          )}
        </div>
        {task.status === 'WAITING_APPROVAL' && pendingReview && <p className="text-xs text-slate-500">Waiting for <b>{ws.empName(pendingReview.reviewerId)}</b> to review.</p>}
      </div>

      <div className="px-4 sm:px-5 pt-2">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'details', label: 'Details' },
            { id: 'checklist', label: 'Checklist', count: task.checklistTotal },
            { id: 'work', label: 'Submissions' },
            { id: 'comments', label: 'Comments' },
            { id: 'files', label: 'Files', count: taskFiles.length },
            { id: 'time', label: 'Time' },
            { id: 'history', label: 'History' },
          ]}
        />
      </div>
      <div className="px-4 sm:px-5 py-4">
        {tab === 'details' && <Details task={task} />}
        {tab === 'checklist' && <Checklist task={task} items={checklist.data} loading={checklist.loading} error={checklist.error} />}
        {tab === 'work' && <Submissions task={task} files={files.data} />}
        {tab === 'comments' && project && <CommentThread project={project} task={task} />}
        {tab === 'files' && project && (
          <div className="space-y-3">
            {canWorkOnTask(ws.me, task, project) && <div className="flex justify-end"><UploadButton project={project} task={task} existing={files.data} /></div>}
            {files.error && <ErrorBanner message={files.error} />}
            <FileList files={taskFiles} empty="No files attached to this task" />
          </div>
        )}
        {tab === 'time' && <TimeLog task={task} />}
        {tab === 'history' && <History task={task} />}
      </div>

      {dialog && <TransitionDialog task={task} kind={dialog} files={files.data} onClose={() => setDialog(null)} />}
      {editing && <TaskForm task={task} onClose={() => setEditing(false)} />}
      {confirmArchive && (
        <ConfirmDialog title={`Archive ${task.code}?`} message="Archived tasks become read-only and move to the Archive Center. Admins can restore them." confirmLabel="Archive"
          onConfirm={() => toast.run(() => archiveEntity(ws.me, COL.tasks, task), `${task.code} archived`)} onClose={() => setConfirmArchive(false)} />
      )}
    </div>
  );
}

function LatestFeedback({ task }: { task: Task }) {
  const ws = useWorkspace();
  const last = ws.approvals.filter((a) => a.entityId === task.id && a.decision && a.decision !== 'APPROVED').sort((a, b) => (b.decidedAt?.toMillis() ?? 0) - (a.decidedAt?.toMillis() ?? 0))[0];
  if (!last) return null;
  return (
    <div className="rounded-lg bg-rose-50 ring-1 ring-rose-200 px-3 py-2 text-xs text-rose-800" data-testid="latest-feedback">
      <b>Feedback from {ws.empName(last.decidedBy)}:</b> {last.comment}
    </div>
  );
}

function Details({ task }: { task: Task }) {
  const ws = useWorkspace();
  const project = ws.project(task.projectId);
  const row = (k: string, v: React.ReactNode) => (
    <div className="grid grid-cols-3 gap-2 py-1.5 text-sm"><dt className="text-slate-500">{k}</dt><dd className="col-span-2 text-slate-800">{v}</dd></div>
  );
  return (
    <div className="space-y-4">
      {task.description ? <p className="text-sm text-slate-700 whitespace-pre-wrap">{task.description}</p> : <p className="text-sm text-slate-400">No description.</p>}
      <dl className="divide-y divide-slate-100">
        {row('Project', project ? <Link className="text-indigo-700 hover:underline" to={`/erp/projects/${project.id}`}>{project.code} · {project.name}</Link> : '—')}
        {row('Milestone', ws.milestone(task.milestoneId)?.title ?? '—')}
        {row('Owner', ws.empName(task.ownerId))}
        {row('Assignees', <span className="inline-flex items-center gap-2"><AvatarStack names={task.assigneeIds.map(ws.empName)} /> {task.assigneeIds.map(ws.empName).join(', ')}</span>)}
        {row('Reviewer', ws.empName(task.reviewerId))}
        {row('Start', fmtDate(task.startDate))}
        {row('Due', <span className={isOverdue(task) ? 'text-rose-700 font-semibold' : ''}>{fmtDate(task.dueDate)}</span>)}
        {row('Hours', `${Math.round(task.actualHours * 10) / 10}h logged / ${task.estimatedHours}h estimated`)}
        {row('Checklist', task.checklistTotal ? <ProgressBar value={(task.checklistDone / task.checklistTotal) * 100} /> : '—')}
        {task.completedAt && row('Completed', fmtDateTime(task.completedAt))}
        {task.cancelReason && row('Cancel reason', task.cancelReason)}
        {task.tags.length > 0 && row('Tags', <span className="flex flex-wrap gap-1">{task.tags.map((t) => <Badge key={t} tone="indigo">{t}</Badge>)}</span>)}
        {row('Created', `${fmtDateTime(task.createdAt)} by ${ws.empName(task.createdBy)}`)}
      </dl>
    </div>
  );
}

function Checklist({ task, items, loading, error }: { task: Task; items: ChecklistItem[]; loading: boolean; error: string | null }) {
  const ws = useWorkspace();
  const toast = useToast();
  const [text, setText] = useState('');
  const editable = canWorkOnTask(ws.me, task, ws.project(task.projectId) ?? null) && !['COMPLETED', 'CANCELLED'].includes(task.status);
  if (loading) return <Spinner />;
  return (
    <div className="space-y-3">
      {error && <ErrorBanner message={error} />}
      {items.length > 0 && <ProgressBar value={(items.filter((i) => i.done).length / items.length) * 100} />}
      {items.length === 0 && <EmptyState title="No checklist items" hint="Break the task into steps." />}
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.id} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
            <input type="checkbox" checked={i.done} disabled={!editable} aria-label={i.text} onChange={() => toast.run(() => toggleChecklistItem(ws.me, task, items, i))} className="rounded border-slate-300 text-indigo-600 w-4 h-4" />
            <span className={`flex-1 text-sm ${i.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{i.text}</span>
            {i.done && i.doneBy && <span className="text-[11px] text-slate-400">{ws.empName(i.doneBy)}</span>}
            {editable && <button aria-label="Remove item" onClick={() => toast.run(() => removeChecklistItem(ws.me, task, items, i))} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>}
          </li>
        ))}
      </ul>
      {editable && (
        <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (text.trim() && (await toast.run(() => addChecklistItem(ws.me, task, items, text)))) setText(''); }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a step…" data-testid="checklist-input" />
          <Button type="submit" variant="secondary" disabled={!text.trim()}><Plus className="w-4 h-4" /> Add</Button>
        </form>
      )}
    </div>
  );
}

function Submissions({ task, files }: { task: Task; files: ProjectFile[] }) {
  const ws = useWorkspace();
  const subs = useLive<Submission[]>((d, e) => subscribeSubmissions(task, d, e), [task.id], []);
  const approvals = ws.approvals.filter((a) => a.entityId === task.id);
  if (subs.loading) return <Spinner />;
  if (subs.data.length === 0) return <EmptyState title="Nothing submitted yet" hint="Assignees submit work for review when it is ready." />;
  return (
    <ul className="space-y-3">
      {subs.error && <ErrorBanner message={subs.error} />}
      {subs.data.map((s) => {
        const a = approvals.find((x) => x.submissionId === s.id);
        return (
          <li key={s.id} className="rounded-lg ring-1 ring-slate-200 p-3">
            <div className="flex items-center gap-2 text-sm">
              <b>Version {s.version}</b>
              <Badge tone={s.status === 'APPROVED' ? 'green' : s.status === 'REJECTED' ? 'red' : 'amber'}>{s.status.toLowerCase()}</Badge>
              <span className="ml-auto text-[11px] text-slate-400">{ws.empName(s.submittedBy)} · {fmtAgo(s.createdAt)}</span>
            </div>
            {s.note && <p className="text-sm text-slate-700 mt-1.5 whitespace-pre-wrap">{s.note}</p>}
            {s.fileRefs.length > 0 && <p className="text-xs text-slate-500 mt-1">Files: {s.fileRefs.map((id) => files.find((f) => f.id === id)?.name ?? 'file').join(', ')}</p>}
            {a?.decision && (
              <div className={`mt-2 rounded-md px-2.5 py-1.5 text-xs ${a.decision === 'APPROVED' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                <b>{a.decision.replace('_', ' ').toLowerCase()}</b> by {ws.empName(a.decidedBy)} {fmtAgo(a.decidedAt)}{a.comment ? `: ${a.comment}` : ''}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TimeLog({ task }: { task: Task }) {
  const ws = useWorkspace();
  const toast = useToast();
  const entries = useLive<TimeEntry[]>((d, e) => subscribeTimeEntries(task, d, e), [task.id], []);
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [, tick] = useState(0);
  const timerRef = useRef<number | null>(null);
  const can = ws.settings.timeTrackingEnabled && canWorkOnTask(ws.me, task, ws.project(task.projectId) ?? null);
  const key = `erp-timer-${task.id}`;
  useEffect(() => {
    try { const v = localStorage.getItem(key); if (v) setTimerStart(Number(v)); } catch { /* storage unavailable */ }
  }, [key]);
  useEffect(() => {
    if (timerStart === null) return;
    timerRef.current = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [timerStart]);
  const elapsed = timerStart ? Math.floor((Date.now() - timerStart) / 1000) : 0;
  const total = entries.data.reduce((s, e) => s + e.minutes, 0);
  return (
    <div className="space-y-4">
      {!ws.settings.timeTrackingEnabled && <p className="text-sm text-slate-500">Time tracking is disabled in Settings.</p>}
      {can && (
        <div className="rounded-lg ring-1 ring-slate-200 p-3 space-y-3">
          <div className="flex items-center gap-2">
            {timerStart === null ? (
              <Button size="sm" variant="secondary" onClick={() => { const now = Date.now(); setTimerStart(now); try { localStorage.setItem(key, String(now)); } catch { /* ignore */ } }}><Play className="w-3.5 h-3.5" /> Start timer</Button>
            ) : (
              <Button size="sm" onClick={async () => {
                const mins = Math.max(1, Math.round(elapsed / 60));
                if (await toast.run(() => logTime(ws.me, task, { minutes: mins, note: note || 'Timer', start: new Date(timerStart) }), `Logged ${mins} min`)) {
                  setTimerStart(null); setNote(''); try { localStorage.removeItem(key); } catch { /* ignore */ }
                }
              }}><Pause className="w-3.5 h-3.5" /> Stop & log {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</Button>
            )}
            <span className="text-xs text-slate-400">or log manually</span>
          </div>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={async (e) => { e.preventDefault(); if (await toast.run(() => logTime(ws.me, task, { minutes: Number(minutes), note }), 'Time logged')) { setMinutes(''); setNote(''); } }}>
            <Input type="number" min={1} placeholder="Minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="sm:w-28" data-testid="time-minutes" />
            <Input placeholder="What did you work on?" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button type="submit" variant="secondary" disabled={!minutes}><Clock className="w-4 h-4" /> Log</Button>
          </form>
        </div>
      )}
      <p className="text-sm text-slate-600">Total logged: <b>{Math.floor(total / 60)}h {total % 60}m</b> · Estimate {task.estimatedHours}h</p>
      {entries.loading ? <Spinner /> : entries.data.length === 0 ? <EmptyState title="No time logged" /> : (
        <ul className="divide-y divide-slate-100">
          {entries.data.map((e) => (
            <li key={e.id} className="flex items-center gap-2 py-1.5 text-sm">
              <b className="w-16">{e.minutes}m</b><span className="flex-1 text-slate-600 truncate">{e.note || '—'}</span>
              <span className="text-[11px] text-slate-400">{ws.empName(e.employeeId)} · {fmtAgo(e.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function History({ task }: { task: Task }) {
  const logs = useLive<ActivityLog[]>((d, e) => subscribeEntityActivity(task.projectId, task.id, d, e), [task.id], []);
  if (logs.loading) return <Spinner />;
  return <>{logs.error && <ErrorBanner message={logs.error} />}<ActivityList logs={logs.data} /></>;
}
