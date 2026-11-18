import { CalendarDays, GanttChart, KanbanSquare, List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskForm } from '../components/forms';
import { applyTaskFilter, EMPTY_FILTER, KanbanBoard, MonthCalendar, TaskFilters, TaskTable, TimelineView, useOpenTask, useTaskCalendarItems, useTaskTimelineRows, type TaskFilterState } from '../components/TaskViews';
import { Button, Card, PageHeader, Segmented } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { canManageTasks } from '../lib/permissions';
import type { TaskStatus } from '../types';

type View = 'table' | 'kanban' | 'calendar' | 'timeline';

export function TasksPage() {
  const ws = useWorkspace();
  const open = useOpenTask();
  const [params] = useSearchParams();
  const [view, setView] = useState<View>(() => { try { return (localStorage.getItem('erp-task-view') as View) || 'table'; } catch { return 'table'; } });
  const [filter, setFilter] = useState<TaskFilterState>(() => ({ ...EMPTY_FILTER, status: (params.get('status') ?? '') as '' | TaskStatus, overdue: params.get('overdue') === '1', projectId: params.get('project') ?? '' }));
  const [creating, setCreating] = useState(false);
  useEffect(() => { try { localStorage.setItem('erp-task-view', view); } catch { /* ignore */ } }, [view]);
  const tasks = applyTaskFilter(ws.tasks, filter);
  const cal = useTaskCalendarItems(tasks);
  const rows = useTaskTimelineRows(tasks);
  const canCreate = ws.projects.some((p) => !p.isArchived && canManageTasks(ws.me, p));
  return (
    <div className="space-y-4">
      <PageHeader title="Tasks" subtitle={`${tasks.length} of ${ws.tasks.filter((t) => !t.isArchived).length} tasks`} actions={
        <>
          <Segmented<View> value={view} onChange={setView} options={[
            { id: 'table', label: 'Table', icon: <List className="w-3.5 h-3.5" /> },
            { id: 'kanban', label: 'Kanban', icon: <KanbanSquare className="w-3.5 h-3.5" /> },
            { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-3.5 h-3.5" /> },
            { id: 'timeline', label: 'Timeline', icon: <GanttChart className="w-3.5 h-3.5" /> },
          ]} />
          {canCreate && <Button onClick={() => setCreating(true)} data-testid="new-task"><Plus className="w-4 h-4" /> New task</Button>}
        </>
      } />
      <Card><TaskFilters value={filter} onChange={setFilter} /></Card>
      {view === 'table' && <Card padded={false}><TaskTable tasks={tasks} /></Card>}
      {view === 'kanban' && <KanbanBoard tasks={tasks.filter((t) => !t.isArchived)} />}
      {view === 'calendar' && <Card><MonthCalendar items={cal} /></Card>}
      {view === 'timeline' && <Card padded={false}><TimelineView rows={rows} /></Card>}
      {creating && <TaskForm onClose={() => setCreating(false)} onCreated={open} defaultProjectId={filter.projectId || undefined} />}
    </div>
  );
}
