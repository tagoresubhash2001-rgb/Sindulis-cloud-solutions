import { AlertTriangle, CheckCircle2, ClipboardCheck, Clock, FolderKanban, FolderOpen, ListTodo, Loader, PlayCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ActivityList } from '../components/Collab';
import { useOpenTask } from '../components/TaskViews';
import { Card, EmptyState, PageHeader, ProgressBar, Stat, StatusBadge } from '../components/ui';
import { useLive } from '../hooks/useLive';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtDate, toMillis } from '../lib/dates';
import { countProjects, countTasks, departmentPerformance, employeePerformance, projectProgress } from '../lib/metrics';
import { isAdmin } from '../lib/permissions';
import { isOverdue } from '../lib/workflow';
import { subscribeActivity } from '../services/activity';
import type { ActivityLog } from '../types';

export function DashboardPage() {
  const ws = useWorkspace();
  const navigate = useNavigate();
  const open = useOpenTask();
  const projectIds = useMemo(() => ws.projects.map((p) => p.id), [ws.projects]);
  const activity = useLive<ActivityLog[]>((d, e) => subscribeActivity(ws.me, projectIds, d, e), [ws.me.id, projectIds.join(',')], []);
  const tc = countTasks(ws.tasks);
  const pc = countProjects(ws.projects);
  const pendingApproval = ws.approvals.filter((a) => a.decision === null && !a.isArchived).length;
  const liveTasks = ws.tasks.filter((t) => !t.isArchived);
  const people = ws.employees.filter((e) => e.active && liveTasks.some((t) => t.assigneeIds.includes(e.id)));
  const workload = people
    .map((e) => {
      const p = employeePerformance(e, liveTasks);
      const mine = liveTasks.filter((t) => t.assigneeIds.includes(e.id));
      return { name: e.name.split(' ')[0], Pending: mine.filter((t) => t.status === 'PENDING').length, 'In progress': mine.filter((t) => t.status === 'IN_PROGRESS').length, Review: mine.filter((t) => t.status === 'WAITING_APPROVAL').length, open: p.open };
    })
    .sort((a, b) => b.open - a.open)
    .slice(0, 12);
  const depts = ws.departments
    .map((d) => ({ name: d.name, ...departmentPerformance(d.id, liveTasks) }))
    .filter((d) => d.total > 0);
  const upcoming = liveTasks
    .filter((t) => t.dueDate && !['COMPLETED', 'CANCELLED'].includes(t.status))
    .sort((a, b) => (toMillis(a.dueDate) ?? 0) - (toMillis(b.dueDate) ?? 0))
    .slice(0, 8);
  const scope = isAdmin(ws.me) ? 'across the organisation' : ws.me.role === 'DEPARTMENT_HEAD' ? `in ${ws.dept(ws.me.departmentId)?.name ?? 'your department'}` : 'in your projects';

  return (
    <div className="space-y-5">
      <PageHeader title={`Welcome, ${ws.me.name.split(' ')[0]}`} subtitle={`Work overview ${scope}`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <Stat label="Total projects" value={pc.total} icon={<FolderKanban className="w-4 h-4" />} tone="indigo" onClick={() => navigate('/erp/projects')} />
        <Stat label="Active projects" value={pc.active} icon={<FolderOpen className="w-4 h-4" />} tone="blue" onClick={() => navigate('/erp/projects?status=ACTIVE')} />
        <Stat label="Completed projects" value={pc.completed} icon={<CheckCircle2 className="w-4 h-4" />} tone="green" onClick={() => navigate('/erp/projects?status=COMPLETED')} />
        <Stat label="Total tasks" value={tc.total} icon={<ListTodo className="w-4 h-4" />} onClick={() => navigate('/erp/tasks')} />
        <Stat label="Pending tasks" value={tc.pending} icon={<Clock className="w-4 h-4" />} onClick={() => navigate('/erp/tasks?status=PENDING')} />
        <Stat label="In progress" value={tc.inProgress} icon={<PlayCircle className="w-4 h-4" />} tone="blue" onClick={() => navigate('/erp/tasks?status=IN_PROGRESS')} />
        <Stat label="Overdue tasks" value={tc.overdue} icon={<AlertTriangle className="w-4 h-4" />} tone="red" onClick={() => navigate('/erp/tasks?overdue=1')} />
        <Stat label="Pending approval" value={pendingApproval} icon={<ClipboardCheck className="w-4 h-4" />} tone="amber" onClick={() => navigate('/erp/approvals')} />
        <Stat label="Completed tasks" value={tc.completed} icon={<CheckCircle2 className="w-4 h-4" />} tone="green" onClick={() => navigate('/erp/tasks?status=COMPLETED')} />
        <Stat label="Waiting approval" value={tc.waitingApproval} icon={<Loader className="w-4 h-4" />} tone="amber" onClick={() => navigate('/erp/tasks?status=WAITING_APPROVAL')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card title="Employee workload (open tasks)" className="xl:col-span-2">
          {workload.length === 0 ? <EmptyState title="No assigned work yet" /> : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workload} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Pending" stackId="a" fill="#94a3b8" />
                  <Bar dataKey="In progress" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Review" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card title="Upcoming deadlines" actions={<Link to="/erp/calendar" className="text-xs font-semibold text-indigo-700">Calendar</Link>} padded={false}>
          {upcoming.length === 0 ? <EmptyState title="Nothing due" /> : (
            <ul className="divide-y divide-slate-100">
              {upcoming.map((t) => (
                <li key={t.id}>
                  <button onClick={() => open(t.id)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 truncate flex-1">{t.title}</span>
                      <span className={`text-xs whitespace-nowrap ${isOverdue(t) ? 'text-rose-700 font-semibold' : 'text-slate-500'}`}>{fmtDate(t.dueDate, 'dd MMM')}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5"><span className="text-[11px] font-mono text-slate-400">{t.code}</span><StatusBadge status={t.status} /></div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card title="Department performance" className="xl:col-span-2">
          {depts.length === 0 ? <EmptyState title="No department data yet" /> : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depts} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" />
                  <Bar dataKey="inProgress" name="In progress" fill="#3b82f6" />
                  <Bar dataKey="overdue" name="Overdue" fill="#e11d48" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card title="Active projects" padded={false}>
          <ul className="divide-y divide-slate-100">
            {ws.projects.filter((p) => !p.isArchived && p.status === 'ACTIVE').slice(0, 6).map((p) => (
              <li key={p.id}><Link to={`/erp/projects/${p.id}`} className="block px-4 py-2.5 hover:bg-slate-50">
                <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                <ProgressBar value={projectProgress(p.id, ws.tasks)} className="mt-1" />
              </Link></li>
            ))}
            {ws.projects.filter((p) => !p.isArchived && p.status === 'ACTIVE').length === 0 && <li><EmptyState title="No active projects" /></li>}
          </ul>
        </Card>
      </div>

      <Card title="Recent activity" actions={<Link to="/erp/activity" className="text-xs font-semibold text-indigo-700">View all</Link>}>
        <ActivityList logs={activity.data.slice(0, 12)} showEntity />
      </Card>
    </div>
  );
}
