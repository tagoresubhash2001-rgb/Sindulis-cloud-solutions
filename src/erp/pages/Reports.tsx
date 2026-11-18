import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { Download, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TimelineView, useTaskTimelineRows } from '../components/TaskViews';
import { Button, Card, EmptyState, PageHeader, Select, Stat } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { downloadCsv, toCsv } from '../lib/csv';
import { fmtDate, toMillis } from '../lib/dates';
import { departmentPerformance, employeePerformance, projectProgress, tasksInWindow } from '../lib/metrics';
import { TASK_STATUS_LABEL } from '../lib/ui';
import { isOverdue } from '../lib/workflow';
import type { Task } from '../types';

type Report = 'work' | 'department' | 'employee' | 'project' | 'delayed' | 'approvals' | 'workload' | 'timeline';
type Period = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';
const REPORTS: { id: Report; label: string }[] = [
  { id: 'work', label: 'Daily / Weekly / Monthly work report' },
  { id: 'department', label: 'Department performance' },
  { id: 'employee', label: 'Employee performance' },
  { id: 'project', label: 'Project completion' },
  { id: 'delayed', label: 'Delayed tasks' },
  { id: 'approvals', label: 'Approvals pending' },
  { id: 'workload', label: 'Workload distribution' },
  { id: 'timeline', label: 'Timeline report' },
];
const PERIODS: Record<Period, { label: string; range: () => [Date, Date] }> = {
  today: { label: 'Today', range: () => [startOfDay(new Date()), endOfDay(new Date())] },
  yesterday: { label: 'Yesterday', range: () => [startOfDay(subDays(new Date(), 1)), endOfDay(subDays(new Date(), 1))] },
  thisWeek: { label: 'This week', range: () => [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })] },
  lastWeek: { label: 'Last week', range: () => [startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }), endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })] },
  thisMonth: { label: 'This month', range: () => [startOfMonth(new Date()), endOfMonth(new Date())] },
  lastMonth: { label: 'Last month', range: () => [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))] },
};

export function ReportsPage() {
  const ws = useWorkspace();
  const [params] = useSearchParams();
  const [report, setReport] = useState<Report>('work');
  const [period, setPeriod] = useState<Period>('thisWeek');
  const [projectId, setProjectId] = useState(params.get('project') ?? '');
  const [deptId, setDeptId] = useState('');
  const tasks = useMemo(() => ws.tasks.filter((t) => !t.isArchived && (!projectId || t.projectId === projectId) && (!deptId || t.departmentId === deptId)), [ws.tasks, projectId, deptId]);
  const [from, to] = PERIODS[period].range();
  const timelineRows = useTaskTimelineRows(tasks);
  const title = REPORTS.find((r) => r.id === report)!.label;

  const taskRow = (t: Task) => [t.code, t.title, ws.project(t.projectId)?.code ?? '', ws.dept(t.departmentId)?.name ?? '', t.assigneeIds.map(ws.empName).join('; '), TASK_STATUS_LABEL[t.status], t.priority, fmtDate(t.dueDate), fmtDate(t.completedAt), t.revisionCount, t.estimatedHours, Math.round(t.actualHours * 100) / 100];
  const TASK_HEAD = ['Code', 'Title', 'Project', 'Department', 'Assignees', 'Status', 'Priority', 'Due', 'Completed', 'Revisions', 'Est. h', 'Actual h'];

  const data = useMemo((): { head: string[]; rows: (string | number)[][]; summary?: { label: string; value: string | number }[]; chart?: { name: string; value: number }[] } => {
    switch (report) {
      case 'work': {
        const w = tasksInWindow(tasks, from.getTime(), to.getTime() + 1);
        const all = Array.from(new Map([...w.created, ...w.completed, ...w.due].map((t) => [t.id, t])).values());
        return { head: TASK_HEAD, rows: all.map(taskRow), summary: [{ label: 'Created', value: w.created.length }, { label: 'Completed', value: w.completed.length }, { label: 'Due in period', value: w.due.length }, { label: 'Overdue now', value: tasks.filter((t) => isOverdue(t)).length }] };
      }
      case 'department': {
        const rows = ws.departments.map((d) => ({ d, p: departmentPerformance(d.id, tasks) })).filter((r) => r.p.total > 0);
        return { head: ['Department', 'Total', 'Pending', 'In progress', 'Waiting approval', 'Completed', 'Cancelled', 'Overdue', 'Completion %'], rows: rows.map(({ d, p }) => [d.name, p.total, p.pending, p.inProgress, p.waitingApproval, p.completed, p.cancelled, p.overdue, p.completionPct]), chart: rows.map(({ d, p }) => ({ name: d.name, value: p.completionPct })) };
      }
      case 'employee': {
        const rows = ws.employees.filter((e) => (!deptId || e.departmentId === deptId)).map((e) => employeePerformance(e, tasks)).filter((p) => p.assigned > 0);
        return { head: ['Employee', 'Assigned', 'Open', 'Completed', 'On-time %', 'Overdue', 'Avg revisions', 'Hours logged'], rows: rows.map((p) => [p.name, p.assigned, p.open, p.completed, p.completed ? p.onTimePct : '', p.overdue, p.avgRevisions, Math.round(p.actualHours * 10) / 10]), chart: rows.map((p) => ({ name: p.name.split(' ')[0], value: p.completed })) };
      }
      case 'project': {
        const ps = ws.projects.filter((p) => !p.isArchived && (!projectId || p.id === projectId) && (!deptId || p.departmentId === deptId));
        return { head: ['Code', 'Project', 'Client', 'Status', 'Tasks', 'Completed', 'Overdue', 'Progress %', 'End date'], rows: ps.map((p) => { const pt = ws.tasks.filter((t) => t.projectId === p.id && !t.isArchived); return [p.code, p.name, ws.client(p.clientId)?.name ?? '', p.status, pt.length, pt.filter((t) => t.status === 'COMPLETED').length, pt.filter((t) => isOverdue(t)).length, projectProgress(p.id, ws.tasks), fmtDate(p.endDate)]; }), chart: ps.map((p) => ({ name: p.code, value: projectProgress(p.id, ws.tasks) })) };
      }
      case 'delayed': {
        const late = tasks.filter((t) => isOverdue(t) || (t.status === 'COMPLETED' && toMillis(t.completedAt) !== null && toMillis(t.dueDate) !== null && toMillis(t.completedAt)! > toMillis(t.dueDate)!));
        return { head: [...TASK_HEAD, 'Days late'], rows: late.map((t) => [...taskRow(t), Math.ceil(((toMillis(t.completedAt) ?? Date.now()) - (toMillis(t.dueDate) ?? 0)) / 86_400_000)]), summary: [{ label: 'Overdue (open)', value: late.filter((t) => isOverdue(t)).length }, { label: 'Completed late', value: late.filter((t) => t.status === 'COMPLETED').length }] };
      }
      case 'approvals': {
        const pend = ws.approvals.filter((a) => a.decision === null && (!projectId || a.projectId === projectId) && (!deptId || a.departmentId === deptId));
        return { head: ['Task', 'Title', 'Project', 'Reviewer', 'Submitted by', 'Waiting (days)'], rows: pend.map((a) => { const t = ws.task(a.entityId); return [t?.code ?? '', t?.title ?? '', ws.project(a.projectId)?.code ?? '', ws.empName(a.reviewerId), ws.empName(a.requestedBy), Math.floor((Date.now() - (toMillis(a.createdAt) ?? Date.now())) / 86_400_000)]; }) };
      }
      case 'workload': {
        const rows = ws.employees.filter((e) => e.active && (!deptId || e.departmentId === deptId)).map((e) => ({ e, p: employeePerformance(e, tasks) }));
        return { head: ['Employee', 'Department', 'Open tasks', 'Est. open hours', 'Weekly capacity', 'Load %'], rows: rows.map(({ e, p }) => { const cap = e.weeklyCapacityHours || ws.settings.defaultWeeklyCapacityHours; return [e.name, ws.dept(e.departmentId)?.name ?? '', p.open, Math.round(p.estimatedOpenHours), cap, cap ? Math.round((p.estimatedOpenHours / cap) * 100) : 0]; }), chart: rows.filter((r) => r.p.open).map(({ e, p }) => ({ name: e.name.split(' ')[0], value: p.open })) };
      }
      case 'timeline':
        return { head: TASK_HEAD, rows: tasks.filter((t) => t.dueDate).map(taskRow) };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report, tasks, ws, from.getTime(), to.getTime(), projectId, deptId]);

  return (
    <div className="space-y-4 print:space-y-2">
      <PageHeader title="Reports & Analytics" subtitle="Figures are computed live from the tasks you can access" actions={
        <div className="flex gap-2 print:hidden">
          <Button variant="secondary" onClick={() => downloadCsv(`${report}-report-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(data.head, data.rows))} data-testid="export-csv"><Download className="w-4 h-4" /> CSV</Button>
          <Button variant="secondary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print / PDF</Button>
        </div>
      } />
      <Card className="print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Select aria-label="Report" value={report} onChange={(e) => setReport(e.target.value as Report)}>{REPORTS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</Select>
          <Select aria-label="Period" value={period} disabled={report !== 'work'} onChange={(e) => setPeriod(e.target.value as Period)}>{(Object.keys(PERIODS) as Period[]).map((p) => <option key={p} value={p}>{PERIODS[p].label}</option>)}</Select>
          <Select aria-label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">All projects</option>{ws.projects.map((p) => <option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}</Select>
          <Select aria-label="Department" value={deptId} onChange={(e) => setDeptId(e.target.value)}><option value="">All departments</option>{ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
        </div>
      </Card>
      <div className="hidden print:block text-sm"><b>{title}</b>{report === 'work' && ` · ${fmtDate(from)} – ${fmtDate(to)}`} · generated {fmtDate(new Date(), 'dd MMM yyyy HH:mm')} by {ws.me.name}</div>
      {data.summary && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{data.summary.map((s) => <Stat key={s.label} label={s.label} value={s.value} />)}</div>}
      {data.chart && data.chart.length > 0 && (
        <Card title={title}>
          <div className="h-60"><ResponsiveContainer><BarChart data={data.chart} margin={{ left: -20 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
      )}
      {report === 'timeline' ? <Card padded={false}><TimelineView rows={timelineRows} /></Card> : (
        <Card padded={false} title={`${title} · ${data.rows.length} rows`}>
          {data.rows.length === 0 ? <EmptyState title="No data for this selection" /> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs" data-testid="report-table">
                <thead><tr className="bg-slate-50 text-left text-slate-500">{data.head.map((h) => <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">{data.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="px-3 py-1.5 whitespace-nowrap">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
