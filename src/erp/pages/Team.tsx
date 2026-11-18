import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskTable } from '../components/TaskViews';
import { Avatar, Badge, Card, EmptyState, PageHeader, ProgressBar, Select, Table } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { employeePerformance } from '../lib/metrics';
import { isAdmin, ROLE_LABELS } from '../lib/permissions';

export function TeamPage() {
  const ws = useWorkspace();
  const [params, setParams] = useSearchParams();
  const [dept, setDept] = useState(isAdmin(ws.me) ? '' : (ws.me.departmentId ?? ''));
  const person = params.get('person');
  const people = ws.employees.filter((e) => e.active && (!dept || e.departmentId === dept));
  const live = ws.tasks.filter((t) => !t.isArchived);
  const rows = people.map((e) => ({ e, p: employeePerformance(e, live), cap: e.weeklyCapacityHours || ws.settings.defaultWeeklyCapacityHours }));
  const groups = ws.departments.filter((d) => !dept || d.id === dept).map((d) => ({ d, rows: rows.filter((r) => r.e.departmentId === d.id) })).filter((g) => g.rows.length);
  const unassigned = rows.filter((r) => !r.e.departmentId || !ws.dept(r.e.departmentId));
  const selected = person ? ws.emp(person) : undefined;
  return (
    <div className="space-y-4">
      <PageHeader title="Team Management" subtitle="Allocation and workload by department. Open a person to see and reassign their tasks." actions={
        <Select aria-label="Department" value={dept} onChange={(e) => setDept(e.target.value)} className="w-56"><option value="">All departments</option>{ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
      } />
      {[...groups, ...(unassigned.length ? [{ d: { id: '_', name: 'No department' }, rows: unassigned }] : [])].map((g) => (
        <Card key={g.d.id} title={`${g.d.name} · ${g.rows.length} people`} padded={false}>
          <Table head={['Person', 'Role', 'Open tasks', 'Overdue', 'Est. open hours vs weekly capacity', 'Completed', 'On time']}>
            {g.rows.sort((a, b) => b.p.estimatedOpenHours - a.p.estimatedOpenHours).map(({ e, p, cap }) => {
              const load = cap ? (p.estimatedOpenHours / cap) * 100 : 0;
              return (
                <tr key={e.id} className="hover:bg-indigo-50/40 cursor-pointer" onClick={() => setParams({ person: e.id })}>
                  <td className="px-3 py-2.5"><span className="flex items-center gap-2"><Avatar name={e.name} /><span><span className="block font-medium">{e.name}</span><span className="block text-[11px] text-slate-500">{e.designation}</span></span></span></td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{ROLE_LABELS[e.role]}</td>
                  <td className="px-3 py-2.5">{p.open}</td>
                  <td className="px-3 py-2.5">{p.overdue ? <Badge tone="red">{p.overdue}</Badge> : 0}</td>
                  <td className="px-3 py-2.5 w-64"><div className="flex items-center gap-2"><ProgressBar value={Math.min(100, load)} className="flex-1" /><span className={`text-[11px] whitespace-nowrap ${load > 100 ? 'text-rose-700 font-bold' : 'text-slate-500'}`}>{Math.round(p.estimatedOpenHours)}h / {cap}h</span></div></td>
                  <td className="px-3 py-2.5">{p.completed}</td>
                  <td className="px-3 py-2.5">{p.completed ? `${p.onTimePct}%` : '—'}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
      ))}
      {groups.length === 0 && unassigned.length === 0 && <Card><EmptyState title="No people in this department" /></Card>}
      {selected && (
        <Card title={`${selected.name}’s open tasks`} actions={<button className="text-xs font-semibold text-slate-500" onClick={() => setParams({})}>Close</button>} padded={false}>
          <p className="px-4 pt-3 text-xs text-slate-500">To reassign, open a task and choose Edit → Assignees (project managers and team leaders).</p>
          <TaskTable tasks={live.filter((t) => t.assigneeIds.includes(selected.id) && !['COMPLETED', 'CANCELLED'].includes(t.status))} />
        </Card>
      )}
    </div>
  );
}
