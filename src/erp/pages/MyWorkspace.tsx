import { endOfDay, startOfDay } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KanbanBoard, MonthCalendar, TaskTable, useTaskCalendarItems } from '../components/TaskViews';
import { Card, EmptyState, PageHeader, ProgressBar, ProjectStatusBadge, Stat, Tabs } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { toMillis } from '../lib/dates';
import { employeePerformance, projectProgress } from '../lib/metrics';
import { isOverdue } from '../lib/workflow';

type Tab = 'all' | 'today' | 'upcoming' | 'overdue' | 'progress' | 'waiting' | 'completed' | 'board' | 'projects' | 'calendar' | 'performance';

export function MyWorkspacePage() {
  const ws = useWorkspace();
  const [tab, setTab] = useState<Tab>('all');
  const mine = ws.tasks.filter((t) => t.assigneeIds.includes(ws.me.id) && !t.isArchived);
  const open = mine.filter((t) => !['COMPLETED', 'CANCELLED'].includes(t.status));
  const s = startOfDay(new Date()).getTime();
  const e = endOfDay(new Date()).getTime();
  const due = (t: (typeof mine)[number]) => toMillis(t.dueDate);
  const lists: Record<Exclude<Tab, 'board' | 'projects' | 'calendar' | 'performance'>, typeof mine> = {
    all: open,
    today: open.filter((t) => { const d = due(t); return d !== null && d >= s && d <= e; }),
    upcoming: open.filter((t) => { const d = due(t); return d !== null && d > e; }),
    overdue: open.filter((t) => isOverdue(t)),
    progress: mine.filter((t) => t.status === 'IN_PROGRESS'),
    waiting: mine.filter((t) => t.status === 'WAITING_APPROVAL'),
    completed: mine.filter((t) => t.status === 'COMPLETED'),
  };
  const myProjects = ws.projects.filter((p) => p.memberIds.includes(ws.me.id) && !p.isArchived);
  const perf = employeePerformance(ws.me, ws.tasks);
  const cal = useTaskCalendarItems(mine);
  const needsFix = mine.filter((t) => t.status === 'IN_PROGRESS' && t.revisionCount > 0);
  return (
    <div className="space-y-4">
      <PageHeader title="My Workspace" subtitle="Everything assigned to you" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Open tasks" value={open.length} tone="blue" onClick={() => setTab('all')} />
        <Stat label="Due today" value={lists.today.length} tone="amber" onClick={() => setTab('today')} />
        <Stat label="Overdue" value={lists.overdue.length} tone="red" onClick={() => setTab('overdue')} />
        <Stat label="Waiting approval" value={lists.waiting.length} tone="indigo" onClick={() => setTab('waiting')} />
      </div>
      {needsFix.length > 0 && (
        <div className="rounded-lg bg-rose-50 ring-1 ring-rose-200 px-4 py-3 text-sm text-rose-800">
          <b>{needsFix.length} task{needsFix.length > 1 ? 's' : ''} returned with feedback.</b> Open {needsFix.length > 1 ? 'them' : 'it'} to see what to change, then resubmit.
        </div>
      )}
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: 'all', label: 'My tasks', count: lists.all.length },
        { id: 'today', label: 'Today', count: lists.today.length },
        { id: 'upcoming', label: 'Upcoming', count: lists.upcoming.length },
        { id: 'overdue', label: 'Overdue', count: lists.overdue.length },
        { id: 'progress', label: 'In progress', count: lists.progress.length },
        { id: 'waiting', label: 'Waiting approval', count: lists.waiting.length },
        { id: 'completed', label: 'Completed', count: lists.completed.length },
        { id: 'board', label: 'Board' },
        { id: 'projects', label: 'My projects', count: myProjects.length },
        { id: 'calendar', label: 'My calendar' },
        { id: 'performance', label: 'My performance' },
      ]} />
      {tab in lists && <Card padded={false}><TaskTable tasks={lists[tab as keyof typeof lists]} /></Card>}
      {tab === 'board' && <KanbanBoard tasks={mine} />}
      {tab === 'calendar' && <Card><MonthCalendar items={cal} /></Card>}
      {tab === 'projects' && (
        myProjects.length === 0 ? <Card><EmptyState title="You are not on any project yet" /></Card> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {myProjects.map((p) => (
              <Link key={p.id} to={`/erp/projects/${p.id}`} className="bg-white rounded-xl ring-1 ring-slate-200 p-4 hover:ring-indigo-300 space-y-2">
                <div className="flex justify-between gap-2"><h3 className="font-semibold truncate">{p.name}</h3><ProjectStatusBadge status={p.status} /></div>
                <p className="text-xs text-slate-500">{mine.filter((t) => t.projectId === p.id && !['COMPLETED', 'CANCELLED'].includes(t.status)).length} open tasks for you</p>
                <ProgressBar value={projectProgress(p.id, ws.tasks)} />
              </Link>
            ))}
          </div>
        )
      )}
      {tab === 'performance' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Stat label="Assigned" value={perf.assigned} />
          <Stat label="Completed" value={perf.completed} tone="green" />
          <Stat label="On-time completion" value={perf.completed ? `${perf.onTimePct}%` : '—'} tone="indigo" />
          <Stat label="Overdue now" value={perf.overdue} tone="red" />
          <Stat label="Avg. revisions" value={perf.avgRevisions} tone="amber" />
          <Stat label="Hours logged" value={Math.round(perf.actualHours * 10) / 10} tone="blue" />
        </div>
      )}
    </div>
  );
}
