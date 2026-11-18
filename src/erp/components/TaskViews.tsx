import { DndContext, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { addDays, addMonths, differenceInCalendarDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { AlertTriangle, ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtDate, toDate, toMillis } from '../lib/dates';
import { cx, TASK_STATUS_DOT, TASK_STATUS_LABEL } from '../lib/ui';
import { checkTransition, isOverdue, openBlockers, resolveTransition, type TransitionKind } from '../lib/workflow';
import { performTransition } from '../services/workflow';
import { PRIORITIES, TASK_STATUSES, type Priority, type Task, type TaskStatus } from '../types';
import { TransitionDialog } from './TransitionDialog';
import { AvatarStack, Badge, Button, EmptyState, Input, PriorityBadge, ProgressBar, Select, StatusBadge, Table } from './ui';

/** Open the global task drawer (rendered by the layout) via ?task=<id>. */
export function useOpenTask() {
  const [params, setParams] = useSearchParams();
  return (id: string) => {
    const next = new URLSearchParams(params);
    next.set('task', id);
    setParams(next);
  };
}

export interface TaskFilterState {
  q: string;
  projectId: string;
  departmentId: string;
  assigneeId: string;
  priority: '' | Priority;
  status: '' | TaskStatus;
  dueFrom: string;
  dueTo: string;
  overdue: boolean;
  showArchived: boolean;
}
export const EMPTY_FILTER: TaskFilterState = { q: '', projectId: '', departmentId: '', assigneeId: '', priority: '', status: '', dueFrom: '', dueTo: '', overdue: false, showArchived: false };

export function applyTaskFilter(tasks: Task[], f: TaskFilterState): Task[] {
  const from = f.dueFrom ? new Date(f.dueFrom).getTime() : null;
  const to = f.dueTo ? new Date(f.dueTo).getTime() + 86_399_999 : null;
  const q = f.q.trim().toLowerCase();
  return tasks.filter((t) => {
    if (!f.showArchived && t.isArchived) return false;
    if (q && !`${t.code} ${t.title} ${t.tags.join(' ')}`.toLowerCase().includes(q)) return false;
    if (f.projectId && t.projectId !== f.projectId) return false;
    if (f.departmentId && t.departmentId !== f.departmentId) return false;
    if (f.assigneeId && !t.assigneeIds.includes(f.assigneeId)) return false;
    if (f.priority && t.priority !== f.priority) return false;
    if (f.status && t.status !== f.status) return false;
    if (f.overdue && !isOverdue(t)) return false;
    const due = toMillis(t.dueDate);
    if (from !== null && (due === null || due < from)) return false;
    if (to !== null && (due === null || due > to)) return false;
    return true;
  });
}

export function TaskFilters({ value, onChange, hideProject }: { value: TaskFilterState; onChange: (f: TaskFilterState) => void; hideProject?: boolean }) {
  const ws = useWorkspace();
  const set = <K extends keyof TaskFilterState>(k: K, v: TaskFilterState[K]) => onChange({ ...value, [k]: v });
  const active = Object.entries(value).some(([k, v]) => v !== EMPTY_FILTER[k as keyof TaskFilterState]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2 items-end">
      <Input aria-label="Search tasks" placeholder="Search code, title, tag…" value={value.q} onChange={(e) => set('q', e.target.value)} className="col-span-2" />
      {!hideProject && (
        <Select aria-label="Project" value={value.projectId} onChange={(e) => set('projectId', e.target.value)}>
          <option value="">All projects</option>
          {ws.projects.filter((p) => !p.isArchived).map((p) => <option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}
        </Select>
      )}
      <Select aria-label="Department" value={value.departmentId} onChange={(e) => set('departmentId', e.target.value)}>
        <option value="">All departments</option>
        {ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </Select>
      <Select aria-label="Assignee" value={value.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
        <option value="">Anyone</option>
        {ws.employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </Select>
      <Select aria-label="Priority" value={value.priority} onChange={(e) => set('priority', e.target.value as TaskFilterState['priority'])}>
        <option value="">Any priority</option>
        {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
      </Select>
      <Select aria-label="Status" value={value.status} onChange={(e) => set('status', e.target.value as TaskFilterState['status'])}>
        <option value="">Any status</option>
        {TASK_STATUSES.map((s) => <option key={s} value={s}>{TASK_STATUS_LABEL[s]}</option>)}
      </Select>
      <div className="col-span-2 flex items-center gap-1.5">
        <Input type="date" aria-label="Due from" value={value.dueFrom} onChange={(e) => set('dueFrom', e.target.value)} />
        <span className="text-slate-400 text-xs">to</span>
        <Input type="date" aria-label="Due to" value={value.dueTo} onChange={(e) => set('dueTo', e.target.value)} />
      </div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><input type="checkbox" checked={value.overdue} onChange={(e) => set('overdue', e.target.checked)} className="rounded border-slate-300" /> Overdue only</label>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><input type="checkbox" checked={value.showArchived} onChange={(e) => set('showArchived', e.target.checked)} className="rounded border-slate-300" /> Archived</label>
      {active && <Button size="sm" variant="ghost" onClick={() => onChange(EMPTY_FILTER)}>Clear filters</Button>}
    </div>
  );
}

const DueCell = ({ t }: { t: Task }) => {
  const overdue = isOverdue(t);
  return <span className={cx('whitespace-nowrap', overdue && 'text-rose-700 font-semibold')}>{overdue && <AlertTriangle className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}{fmtDate(t.dueDate)}</span>;
};

export function TaskTable({ tasks, showProject = true }: { tasks: Task[]; showProject?: boolean }) {
  const ws = useWorkspace();
  const open = useOpenTask();
  const [sort, setSort] = useState<'due' | 'code' | 'priority' | 'status'>('due');
  const rank = (p: Priority) => PRIORITIES.indexOf(p);
  const sorted = useMemo(() => {
    const s = tasks.slice();
    if (sort === 'due') s.sort((a, b) => (toMillis(a.dueDate) ?? Infinity) - (toMillis(b.dueDate) ?? Infinity));
    if (sort === 'priority') s.sort((a, b) => rank(b.priority) - rank(a.priority));
    if (sort === 'status') s.sort((a, b) => TASK_STATUSES.indexOf(a.status) - TASK_STATUSES.indexOf(b.status));
    return s;
  }, [tasks, sort]);
  if (tasks.length === 0) return <EmptyState title="No tasks match" hint="Adjust filters or create a task." icon={<ListChecks className="w-5 h-5" />} />;
  const H = ({ id, children }: { id: typeof sort; children: string }) => (
    <button onClick={() => setSort(id)} className={cx('uppercase', sort === id && 'text-indigo-700')}>{children}{sort === id ? ' ↓' : ''}</button>
  );
  return (
    <Table head={[<H id="code">Task</H>, ...(showProject ? ['Project'] : []), 'Assignees', <H id="priority">Priority</H>, <H id="status">Status</H>, <H id="due">Due</H>, 'Checklist']}>
      {sorted.map((t) => (
        <tr key={t.id} onClick={() => open(t.id)} className={cx('cursor-pointer hover:bg-indigo-50/40', t.isArchived && 'opacity-60')} data-testid={`task-row-${t.code}`}>
          <td className="px-3 py-2.5 min-w-[220px]">
            <span className="text-[11px] font-mono text-slate-400 mr-1.5">{t.code}</span>
            <span className="font-medium text-slate-800">{t.title}</span>
            {openBlockers(t, ws.tasks).length > 0 && <Badge tone="amber">blocked</Badge>}
          </td>
          {showProject && <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{ws.project(t.projectId)?.code ?? '—'}</td>}
          <td className="px-3 py-2.5"><AvatarStack names={t.assigneeIds.map(ws.empName)} /></td>
          <td className="px-3 py-2.5"><PriorityBadge priority={t.priority} /></td>
          <td className="px-3 py-2.5"><StatusBadge status={t.status} /></td>
          <td className="px-3 py-2.5"><DueCell t={t} /></td>
          <td className="px-3 py-2.5 w-32">{t.checklistTotal ? <ProgressBar value={(t.checklistDone / t.checklistTotal) * 100} /> : <span className="text-slate-300">—</span>}</td>
        </tr>
      ))}
    </Table>
  );
}

function KanbanCard({ t }: { t: Task }) {
  const ws = useWorkspace();
  const open = useOpenTask();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: t.id, data: { status: t.status } });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => open(t.id)}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className={cx('rounded-lg bg-white ring-1 ring-slate-200 p-2.5 shadow-sm cursor-grab active:cursor-grabbing select-none touch-none', isDragging && 'opacity-80 shadow-lg ring-indigo-300 z-10 relative')}
      data-testid={`kanban-card-${t.code}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono text-slate-400">{t.code}</span>
        <PriorityBadge priority={t.priority} />
      </div>
      <p className="text-sm font-medium text-slate-800 mt-1 line-clamp-2">{t.title}</p>
      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{ws.project(t.projectId)?.name}</p>
      {t.checklistTotal > 0 && <ProgressBar value={(t.checklistDone / t.checklistTotal) * 100} className="mt-1.5" />}
      <div className="flex items-center justify-between mt-2">
        <AvatarStack names={t.assigneeIds.map(ws.empName)} />
        <span className="text-[11px]"><DueCell t={t} /></span>
      </div>
    </div>
  );
}

function KanbanColumn({ status, tasks, hint }: { status: TaskStatus; tasks: Task[]; hint: boolean | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={cx('flex flex-col rounded-xl bg-slate-50 ring-1 ring-slate-200 min-w-[260px] w-[260px] lg:w-auto lg:min-w-0 lg:flex-1 transition-colors', isOver && hint === true && 'ring-2 ring-indigo-400 bg-indigo-50/50', isOver && hint === false && 'ring-2 ring-rose-300 bg-rose-50/50')} data-testid={`kanban-col-${status}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className={cx('w-2 h-2 rounded-full', TASK_STATUS_DOT[status])} />
        <span className="text-xs font-semibold text-slate-700">{TASK_STATUS_LABEL[status]}</span>
        <span className="ml-auto text-[11px] font-bold text-slate-400">{tasks.length}</span>
      </div>
      <div className="flex-1 space-y-2 px-2 pb-2 min-h-24 max-h-[65vh] overflow-y-auto">
        {tasks.map((t) => <KanbanCard key={t.id} t={t} />)}
      </div>
    </div>
  );
}

/** Drag & drop changes status only along legal transitions; approvals/cancels open a dialog. */
export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const ws = useWorkspace();
  const toast = useToast();
  const [dialog, setDialog] = useState<{ task: Task; kind: TransitionKind } | null>(null);
  const [dragFrom, setDragFrom] = useState<TaskStatus | null>(null);
  const [dragTask, setDragTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }));
  const allowed = (to: TaskStatus): boolean | null => {
    if (!dragTask || !dragFrom || dragFrom === to) return null;
    const kind = resolveTransition(dragFrom, to);
    return !!kind && checkTransition(ws.me, dragTask, ws.project(dragTask.projectId) ?? null, kind, { comment: 'x', reason: 'x' }).ok;
  };
  const onDragEnd = async (e: DragEndEvent) => {
    setDragFrom(null);
    setDragTask(null);
    const task = tasks.find((t) => t.id === e.active.id);
    const to = e.over?.id as TaskStatus | undefined;
    if (!task || !to || to === task.status) return;
    const kind = resolveTransition(task.status, to);
    if (!kind) return toast.fail(`Can't move from ${TASK_STATUS_LABEL[task.status]} to ${TASK_STATUS_LABEL[to]}`);
    const project = ws.project(task.projectId) ?? null;
    const check = checkTransition(ws.me, task, project, kind, { comment: 'x', reason: 'x' });
    if (!check.ok) return toast.fail(check.reason);
    if (kind === 'START' || kind === 'REOPEN' || kind === 'REINSTATE') {
      await toast.run(() => performTransition({ actor: ws.me, task, project }, kind), `${task.code} → ${TASK_STATUS_LABEL[to]}`);
    } else setDialog({ task, kind });
  };
  return (
    <>
      <DndContext sensors={sensors} onDragStart={(e) => { const t = tasks.find((x) => x.id === e.active.id) ?? null; setDragTask(t); setDragFrom(t?.status ?? null); }} onDragEnd={onDragEnd} onDragCancel={() => { setDragFrom(null); setDragTask(null); }}>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {TASK_STATUSES.map((s) => <KanbanColumn key={s} status={s} hint={allowed(s)} tasks={tasks.filter((t) => t.status === s)} />)}
        </div>
      </DndContext>
      {dialog && <TransitionDialog task={dialog.task} kind={dialog.kind} onClose={() => setDialog(null)} />}
    </>
  );
}

export interface CalendarItem { id: string; date: Date; label: string; tone: string; onClick?: () => void }

export function MonthCalendar({ items }: { items: CalendarItem[] }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const days: Date[] = [];
  for (let d = startOfWeek(startOfMonth(month), { weekStartsOn: 1 }); d <= endOfWeek(endOfMonth(month), { weekStartsOn: 1 }); d = addDays(d, 1)) days.push(d);
  const today = new Date();
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Button size="sm" variant="secondary" aria-label="Previous month" onClick={() => setMonth((m) => addMonths(m, -1))}><ChevronLeft className="w-4 h-4" /></Button>
        <h3 className="text-sm font-semibold text-slate-800 w-36 text-center">{format(month, 'MMMM yyyy')}</h3>
        <Button size="sm" variant="secondary" aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}><ChevronRight className="w-4 h-4" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setMonth(startOfMonth(new Date()))}>Today</Button>
      </div>
      <div className="grid grid-cols-7 text-[11px] font-semibold text-slate-500 mb-1">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="px-1.5">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden ring-1 ring-slate-200">
        {days.map((d) => {
          const dayItems = items.filter((i) => isSameDay(i.date, d));
          return (
            <div key={d.toISOString()} className={cx('bg-white min-h-16 sm:min-h-24 p-1', !isSameMonth(d, month) && 'bg-slate-50 text-slate-400')}>
              <div className={cx('text-[11px] font-semibold w-5 h-5 flex items-center justify-center rounded-full', isSameDay(d, today) && 'bg-indigo-600 text-white')}>{format(d, 'd')}</div>
              <div className="space-y-0.5 mt-0.5">
                {dayItems.slice(0, 3).map((i) => (
                  <button key={i.id} onClick={i.onClick} title={i.label} className={cx('block w-full truncate text-left rounded px-1 py-0.5 text-[10px] font-medium', i.tone)}>{i.label}</button>
                ))}
                {dayItems.length > 3 && <span className="block text-[10px] text-slate-400 px-1">+{dayItems.length - 3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function useTaskCalendarItems(tasks: Task[]): CalendarItem[] {
  const open = useOpenTask();
  return tasks
    .filter((t) => t.dueDate)
    .map((t) => ({
      id: t.id,
      date: toDate(t.dueDate)!,
      label: `${t.code} ${t.title}`,
      tone: isOverdue(t) ? 'bg-rose-100 text-rose-800' : t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : t.status === 'WAITING_APPROVAL' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800',
      onClick: () => open(t.id),
    }));
}

/** Gantt-style bars from start (or created) date to due date. */
export function TimelineView({ rows }: { rows: { id: string; label: string; sub?: string; start: Date | null; end: Date | null; status?: TaskStatus; onClick?: () => void; progress?: number }[] }) {
  const dated = rows.filter((r) => r.start || r.end);
  if (dated.length === 0) return <EmptyState title="Nothing to plot" hint="Add start and due dates to see the timeline." />;
  const min = new Date(Math.min(...dated.map((r) => (r.start ?? r.end)!.getTime())));
  const max = new Date(Math.max(...dated.map((r) => (r.end ?? r.start)!.getTime())));
  const from = startOfWeek(addDays(min, -2), { weekStartsOn: 1 });
  const span = Math.max(14, differenceInCalendarDays(max, from) + 5);
  const dayW = span > 120 ? 6 : span > 60 ? 12 : 24;
  const weeks: Date[] = [];
  for (let d = from; differenceInCalendarDays(d, from) < span; d = addDays(d, 7)) weeks.push(d);
  const todayX = differenceInCalendarDays(new Date(), from) * dayW;
  return (
    <div className="overflow-x-auto">
      <div style={{ width: 220 + span * dayW }} className="relative">
        <div className="flex sticky top-0 bg-white border-b border-slate-200 text-[10px] text-slate-500 font-semibold">
          <div className="w-[220px] shrink-0 px-2 py-1.5">Item</div>
          {weeks.map((w) => <div key={w.toISOString()} style={{ width: 7 * dayW }} className="py-1.5 border-l border-slate-100 px-1 truncate">{format(w, 'dd MMM')}</div>)}
        </div>
        {todayX >= 0 && todayX <= span * dayW && <div className="absolute top-0 bottom-0 w-px bg-rose-400 z-10" style={{ left: 220 + todayX }} title="Today" />}
        {rows.map((r) => {
          const s = r.start ?? r.end;
          const e = r.end ?? r.start;
          const left = s ? differenceInCalendarDays(s, from) * dayW : 0;
          const width = s && e ? Math.max(dayW, (differenceInCalendarDays(e, s) + 1) * dayW) : 0;
          return (
            <div key={r.id} className="flex items-center border-b border-slate-50 hover:bg-slate-50 h-9">
              <button onClick={r.onClick} className="w-[220px] shrink-0 px-2 text-left truncate text-xs">
                <span className="font-medium text-slate-800">{r.label}</span>
                {r.sub && <span className="block text-[10px] text-slate-400 truncate">{r.sub}</span>}
              </button>
              <div className="relative flex-1 h-full">
                {s && (
                  <button onClick={r.onClick} title={`${r.label}: ${format(s, 'dd MMM')} → ${e ? format(e, 'dd MMM') : ''}`} className={cx('absolute top-2 h-5 rounded-md text-[10px] text-white px-1.5 truncate text-left overflow-hidden', r.status ? TASK_STATUS_DOT[r.status] : 'bg-indigo-500')} style={{ left, width }}>
                    {r.progress !== undefined && <span className="absolute inset-y-0 left-0 bg-black/15" style={{ width: `${r.progress}%` }} />}
                    <span className="relative">{r.progress !== undefined ? `${r.progress}%` : ''}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function useTaskTimelineRows(tasks: Task[]) {
  const ws = useWorkspace();
  const open = useOpenTask();
  return tasks.map((t) => ({
    id: t.id,
    label: `${t.code} ${t.title}`,
    sub: `${ws.project(t.projectId)?.code ?? ''} · ${t.assigneeIds.map(ws.empName).join(', ')}`,
    start: toDate(t.startDate) ?? toDate(t.createdAt),
    end: toDate(t.dueDate),
    status: t.status,
    onClick: () => open(t.id),
  }));
}
