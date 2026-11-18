import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MonthCalendar, TimelineView, useTaskCalendarItems, useTaskTimelineRows, type CalendarItem } from '../components/TaskViews';
import { Card, PageHeader, Segmented } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { toDate } from '../lib/dates';

export function CalendarPage() {
  const ws = useWorkspace();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'calendar' | 'timeline'>('calendar');
  const [scope, setScope] = useState<'mine' | 'all'>('mine');
  const tasks = ws.tasks.filter((t) => !t.isArchived && (scope === 'all' || t.assigneeIds.includes(ws.me.id)));
  const taskItems = useTaskCalendarItems(tasks);
  const rows = useTaskTimelineRows(tasks);
  const extra: CalendarItem[] = [
    ...ws.milestones.filter((m) => m.dueDate && !m.isArchived).map((m) => ({ id: `m-${m.id}`, date: toDate(m.dueDate)!, label: `◆ ${m.title}`, tone: 'bg-violet-100 text-violet-800', onClick: () => navigate(`/erp/projects/${m.projectId}?tab=timeline`) })),
    ...ws.projects.filter((p) => p.endDate && !p.isArchived).map((p) => ({ id: `p-${p.id}`, date: toDate(p.endDate)!, label: `■ ${p.code} deadline`, tone: 'bg-slate-800 text-white', onClick: () => navigate(`/erp/projects/${p.id}`) })),
  ];
  const projectRows = ws.projects.filter((p) => !p.isArchived).map((p) => ({ id: p.id, label: `${p.code} ${p.name}`, sub: ws.client(p.clientId)?.name, start: toDate(p.startDate), end: toDate(p.endDate), onClick: () => navigate(`/erp/projects/${p.id}`) }));
  return (
    <div className="space-y-4">
      <PageHeader title="Calendar & Timeline" subtitle="Task due dates, milestones (◆) and project deadlines (■)" actions={
        <>
          <Segmented value={scope} onChange={setScope} options={[{ id: 'mine', label: 'My tasks' }, { id: 'all', label: 'All visible' }]} />
          <Segmented value={mode} onChange={setMode} options={[{ id: 'calendar', label: 'Calendar' }, { id: 'timeline', label: 'Timeline' }]} />
        </>
      } />
      {mode === 'calendar' ? <Card><MonthCalendar items={[...taskItems, ...extra]} /></Card> : (
        <>
          <Card title="Projects" padded={false}><TimelineView rows={projectRows} /></Card>
          <Card title="Tasks" padded={false}><TimelineView rows={rows} /></Card>
        </>
      )}
    </div>
  );
}
