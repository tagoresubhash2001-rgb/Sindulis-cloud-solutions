import { Archive, Pencil, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ActivityList, CommentThread, FileList, UploadButton } from '../components/Collab';
import { MilestoneForm, ProjectForm, TaskForm } from '../components/forms';
import { applyTaskFilter, EMPTY_FILTER, KanbanBoard, MonthCalendar, TaskFilters, TaskTable, TimelineView, useOpenTask, useTaskCalendarItems, useTaskTimelineRows, type TaskFilterState } from '../components/TaskViews';
import { Avatar, Badge, Button, Card, ConfirmDialog, EmptyState, ErrorBanner, PageHeader, PriorityBadge, ProgressBar, ProjectStatusBadge, Spinner, Stat, StatusBadge, Tabs } from '../components/ui';
import { useLive } from '../hooks/useLive';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtAgo, fmtDate, toDate } from '../lib/dates';
import { countTasks, employeePerformance, milestoneProgress, projectProgress } from '../lib/metrics';
import { canArchive, canManageProject, canManageTasks, canWrite } from '../lib/permissions';
import { TASK_STATUS_LABEL } from '../lib/ui';
import { subscribeActivity } from '../services/activity';
import { archiveEntity } from '../services/archive';
import { COL } from '../services/db';
import { subscribeProjectFiles } from '../services/files';
import type { ActivityLog, Project, ProjectFile } from '../types';

type Tab = 'overview' | 'timeline' | 'tasks' | 'kanban' | 'calendar' | 'files' | 'discussions' | 'approvals' | 'reports' | 'activity';

export function ProjectWorkspacePage() {
  const { id = '' } = useParams();
  const ws = useWorkspace();
  const project = ws.project(id);
  if (!project) return <Card><EmptyState title="Project not found" hint="It may not exist, or you may not have access." action={<Link to="/erp/projects" className="text-sm font-semibold text-indigo-700">Back to projects</Link>} /></Card>;
  return <Workspace project={project} />;
}

function Workspace({ project }: { project: Project }) {
  const ws = useWorkspace();
  const toast = useToast();
  const open = useOpenTask();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'overview';
  const setTab = (t: Tab) => { const n = new URLSearchParams(params); n.set('tab', t); setParams(n, { replace: true }); };
  const [filter, setFilter] = useState<TaskFilterState>(EMPTY_FILTER);
  const [modal, setModal] = useState<'edit' | 'task' | 'milestone' | 'archive' | null>(null);
  const [editMilestone, setEditMilestone] = useState<string | null>(null);
  const tasks = ws.tasks.filter((t) => t.projectId === project.id);
  const visible = applyTaskFilter(tasks, filter);
  const milestones = ws.milestones.filter((m) => m.projectId === project.id && !m.isArchived);
  const files = useLive<ProjectFile[]>((d, e) => subscribeProjectFiles(project.id, d, e), [project.id], []);
  const activity = useLive<ActivityLog[]>(tab === 'activity' || tab === 'overview' ? (d, e) => subscribeActivity(ws.me, [project.id], d, e) : null, [project.id, tab === 'activity' || tab === 'overview'], []);
  const projectLogs = activity.data.filter((l) => l.projectId === project.id);
  const calItems = useTaskCalendarItems(visible);
  const timelineRows = useTaskTimelineRows(visible);
  const counts = countTasks(tasks);
  const progress = projectProgress(project.id, ws.tasks);
  const manage = canManageProject(ws.me, project);
  const manageTasks = canManageTasks(ws.me, project);
  const approvals = ws.approvals.filter((a) => a.projectId === project.id);

  const milestoneRows = useMemo(
    () => milestones.map((m) => ({ id: m.id, label: m.title, sub: `${tasks.filter((t) => t.milestoneId === m.id).length} tasks`, start: toDate(m.createdAt), end: toDate(m.dueDate), progress: milestoneProgress(m.id, tasks), onClick: () => setEditMilestone(m.id) })),
    [milestones, tasks],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title={<span className="flex items-center gap-2 flex-wrap"><span className="text-sm font-mono text-slate-400">{project.code}</span>{project.name}</span>}
        subtitle={<span className="flex flex-wrap items-center gap-2"><ProjectStatusBadge status={project.status} /><PriorityBadge priority={project.priority} />{project.isArchived && <Badge>Archived · read-only</Badge>}<span>{ws.client(project.clientId)?.name} · {ws.dept(project.departmentId)?.name} · PM {ws.empName(project.projectManagerId)}</span></span>}
        actions={!project.isArchived && (
          <>
            {manageTasks && <Button onClick={() => setModal('task')} data-testid="project-new-task"><Plus className="w-4 h-4" /> Task</Button>}
            {manage && <Button variant="secondary" onClick={() => setModal('milestone')}><Plus className="w-4 h-4" /> Milestone</Button>}
            {manage && <Button variant="secondary" onClick={() => setModal('edit')}><Pencil className="w-4 h-4" /> Edit</Button>}
            {canArchive(ws.me, project.departmentId) && <Button variant="ghost" onClick={() => setModal('archive')}><Archive className="w-4 h-4" /> Archive</Button>}
          </>
        )}
      />
      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'tasks', label: 'Tasks', count: tasks.filter((t) => !t.isArchived).length },
          { id: 'kanban', label: 'Kanban' },
          { id: 'calendar', label: 'Calendar' },
          { id: 'files', label: 'Files', count: files.data.length },
          { id: 'discussions', label: 'Discussions' },
          { id: 'approvals', label: 'Approvals', count: approvals.filter((a) => a.decision === null).length },
          { id: 'reports', label: 'Reports' },
          { id: 'activity', label: 'Activity' },
        ]}
      />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Progress" value={`${progress}%`} tone="indigo" />
              <Stat label="Open tasks" value={counts.total - counts.completed - counts.cancelled} tone="blue" />
              <Stat label="Overdue" value={counts.overdue} tone="red" />
              <Stat label="Awaiting approval" value={counts.waitingApproval} tone="amber" />
            </div>
            <Card title="Milestones" actions={manage && !project.isArchived && <Button size="sm" variant="ghost" onClick={() => setModal('milestone')}><Plus className="w-3.5 h-3.5" /> Add</Button>} padded={false}>
              {milestones.length === 0 ? <EmptyState title="No milestones" hint="Milestones group tasks into deliverable phases." /> : (
                <ul className="divide-y divide-slate-100">
                  {milestones.map((m) => {
                    const mp = milestoneProgress(m.id, tasks);
                    return (
                      <li key={m.id} className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => manage && setEditMilestone(m.id)} className="text-sm font-medium text-slate-800 hover:text-indigo-700 text-left flex-1 truncate">{m.title}</button>
                          {mp === 100 && tasks.some((t) => t.milestoneId === m.id) && <Badge tone="green">Complete</Badge>}
                          <span className="text-xs text-slate-500 whitespace-nowrap">Due {fmtDate(m.dueDate, 'dd MMM')}</span>
                        </div>
                        <ProgressBar value={mp} className="mt-1.5" />
                        {m.deliverables.length > 0 && <p className="text-[11px] text-slate-500 mt-1">Deliverables: {m.deliverables.join(' · ')}</p>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
            <Card title="Recent tasks" padded={false}><TaskTable tasks={tasks.filter((t) => !t.isArchived).slice(0, 8)} showProject={false} /></Card>
          </div>
          <div className="space-y-4">
            <Card title="Details">
              <dl className="text-sm space-y-2">
                <div className="flex justify-between"><dt className="text-slate-500">Start</dt><dd>{fmtDate(project.startDate)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">End</dt><dd>{fmtDate(project.endDate)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Budget</dt><dd>₹{project.budget.toLocaleString('en-IN')}</dd></div>
              </dl>
              {project.description && <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{project.description}</p>}
            </Card>
            <Card title={`Team (${project.memberIds.length})`}>
              <ul className="space-y-2">
                {project.memberIds.map((id) => {
                  const e = ws.emp(id);
                  const open = tasks.filter((t) => t.assigneeIds.includes(id) && !['COMPLETED', 'CANCELLED'].includes(t.status) && !t.isArchived).length;
                  return (
                    <li key={id} className="flex items-center gap-2"><Avatar name={ws.empName(id)} /><span className="flex-1 min-w-0"><span className="block text-sm truncate">{ws.empName(id)}{id === project.projectManagerId && <span className="text-[10px] font-bold text-indigo-600 ml-1">PM</span>}</span><span className="block text-[11px] text-slate-500">{e?.designation || e?.role.toLowerCase().replace('_', ' ')}</span></span><span className="text-xs text-slate-500">{open} open</span></li>
                  );
                })}
              </ul>
            </Card>
            <Card title="Recent activity"><ActivityList logs={projectLogs.slice(0, 6)} /></Card>
          </div>
        </div>
      )}

      {(tab === 'tasks' || tab === 'kanban' || tab === 'calendar') && <Card><TaskFilters value={filter} onChange={setFilter} hideProject /></Card>}
      {tab === 'tasks' && <Card padded={false}><TaskTable tasks={visible} showProject={false} /></Card>}
      {tab === 'kanban' && <KanbanBoard tasks={visible.filter((t) => !t.isArchived)} />}
      {tab === 'calendar' && <Card><MonthCalendar items={calItems} /></Card>}
      {tab === 'timeline' && (
        <div className="space-y-4">
          {milestoneRows.length > 0 && <Card title="Milestones" padded={false}><TimelineView rows={milestoneRows} /></Card>}
          <Card title="Tasks" padded={false}><TimelineView rows={timelineRows.filter((r) => !ws.task(r.id)?.isArchived)} /></Card>
        </div>
      )}
      {tab === 'files' && (
        <Card title="Project files" actions={canWrite(ws.me) && !project.isArchived && project.memberIds.includes(ws.me.id) && <UploadButton project={project} task={null} existing={files.data} />}>
          {files.error && <ErrorBanner message={files.error} />}
          {files.loading ? <Spinner /> : <FileList files={files.data.filter((f) => !f.isArchived)} />}
        </Card>
      )}
      {tab === 'discussions' && <Card title="Project discussion"><CommentThread project={project} task={null} /></Card>}
      {tab === 'approvals' && (
        <Card padded={false}>
          {approvals.length === 0 ? <EmptyState title="No approval requests yet" /> : (
            <ul className="divide-y divide-slate-100">
              {approvals.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)).map((a) => {
                const t = ws.task(a.entityId);
                return (
                  <li key={a.id}><button onClick={() => t && open(t.id)} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium flex-1 min-w-[200px]">{t ? `${t.code} · ${t.title}` : a.entityId}</span>
                    <span className="text-xs text-slate-500">Reviewer {ws.empName(a.reviewerId)} · requested {fmtAgo(a.createdAt)}</span>
                    <Badge tone={a.decision === 'APPROVED' ? 'green' : a.decision ? 'red' : 'amber'}>{a.decision ? a.decision.replace('_', ' ').toLowerCase() : 'pending'}</Badge>
                  </button></li>
                );
              })}
            </ul>
          )}
        </Card>
      )}
      {tab === 'reports' && <ProjectReport project={project} />}
      {tab === 'activity' && <Card title="Audit trail">{activity.loading ? <Spinner /> : <ActivityList logs={projectLogs} />}</Card>}

      {modal === 'edit' && <ProjectForm project={project} onClose={() => setModal(null)} />}
      {modal === 'task' && <TaskForm defaultProjectId={project.id} onClose={() => setModal(null)} onCreated={open} />}
      {modal === 'milestone' && <MilestoneForm project={project} onClose={() => setModal(null)} />}
      {editMilestone && ws.milestone(editMilestone) && <MilestoneForm project={project} milestone={ws.milestone(editMilestone)} onClose={() => setEditMilestone(null)} />}
      {modal === 'archive' && (
        <ConfirmDialog title={`Archive ${project.code}?`} message="The project becomes read-only for everyone and moves to the Archive Center. Admins can restore it." confirmLabel="Archive project"
          onConfirm={() => toast.run(() => archiveEntity(ws.me, COL.projects, project), `${project.code} archived`)} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

const PIE = ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981', '#e11d48'];
function ProjectReport({ project }: { project: Project }) {
  const ws = useWorkspace();
  const tasks = ws.tasks.filter((t) => t.projectId === project.id && !t.isArchived);
  const c = countTasks(tasks);
  const pie = [
    { name: TASK_STATUS_LABEL.PENDING, value: c.pending },
    { name: TASK_STATUS_LABEL.IN_PROGRESS, value: c.inProgress },
    { name: TASK_STATUS_LABEL.WAITING_APPROVAL, value: c.waitingApproval },
    { name: TASK_STATUS_LABEL.COMPLETED, value: c.completed },
    { name: TASK_STATUS_LABEL.CANCELLED, value: c.cancelled },
  ];
  const people = project.memberIds.map((id) => employeePerformance({ id, name: ws.empName(id) }, tasks)).filter((p) => p.assigned > 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Status breakdown">
        {c.total === 0 ? <EmptyState title="No tasks" /> : (
          <div className="h-64"><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label={(e) => (e.value ? `${e.name}: ${e.value}` : '')} labelLine={false}>{pie.map((_, i) => <Cell key={i} fill={PIE[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        )}
      </Card>
      <Card title="Team performance" padded={false}>
        {people.length === 0 ? <EmptyState title="No assignments" /> : (
          <table className="min-w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase text-slate-500 bg-slate-50"><th className="px-3 py-2">Person</th><th className="px-3 py-2">Done</th><th className="px-3 py-2">Open</th><th className="px-3 py-2">On time</th><th className="px-3 py-2">Overdue</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{people.map((p) => <tr key={p.employeeId}><td className="px-3 py-2">{p.name}</td><td className="px-3 py-2">{p.completed}</td><td className="px-3 py-2">{p.open}</td><td className="px-3 py-2">{p.completed ? `${p.onTimePct}%` : '—'}</td><td className="px-3 py-2">{p.overdue}</td></tr>)}</tbody>
          </table>
        )}
      </Card>
      <Card title="Delayed tasks" className="lg:col-span-2" padded={false}>
        <TaskTable tasks={tasks.filter((t) => t.dueDate && ((t.status === 'COMPLETED' && t.completedAt && t.completedAt.toMillis() > t.dueDate.toMillis()) || (t.dueDate.toMillis() < Date.now() && !['COMPLETED', 'CANCELLED'].includes(t.status))))} showProject={false} />
      </Card>
      <p className="text-xs text-slate-400 lg:col-span-2">Full exports are in <Link className="text-indigo-700" to={`/erp/reports?project=${project.id}`}>Reports</Link>. Status: {(['PENDING', 'IN_PROGRESS', 'WAITING_APPROVAL', 'COMPLETED'] as const).map((s) => <StatusBadge key={s} status={s} />)}</p>
    </div>
  );
}
