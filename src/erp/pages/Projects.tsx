import { LayoutGrid, List, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProjectForm } from '../components/forms';
import { AvatarStack, Button, Card, EmptyState, Input, PageHeader, PriorityBadge, ProgressBar, ProjectStatusBadge, Segmented, Select, Table } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtDate } from '../lib/dates';
import { projectProgress } from '../lib/metrics';
import { canCreateProject } from '../lib/permissions';
import { humanize } from '../lib/ui';
import { PROJECT_STATUSES, type ProjectStatus } from '../types';

export function ProjectsPage() {
  const ws = useWorkspace();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const status = (params.get('status') ?? '') as '' | ProjectStatus;
  const dept = params.get('dept') ?? '';
  const client = params.get('client') ?? '';
  const setParam = (k: string, v: string) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); setParams(n); };
  const rows = useMemo(
    () => ws.projects.filter((p) => !p.isArchived && (!status || p.status === status) && (!dept || p.departmentId === dept) && (!client || p.clientId === client) && (!q || `${p.code} ${p.name}`.toLowerCase().includes(q.toLowerCase()))),
    [ws.projects, status, dept, client, q],
  );
  return (
    <div>
      <PageHeader title="Projects" subtitle={`${rows.length} project${rows.length === 1 ? '' : 's'}`} actions={
        <>
          <Segmented value={view} onChange={setView} options={[{ id: 'table', label: 'Table', icon: <List className="w-3.5 h-3.5" /> }, { id: 'cards', label: 'Cards', icon: <LayoutGrid className="w-3.5 h-3.5" /> }]} />
          {canCreateProject(ws.me) && <Button onClick={() => setCreating(true)} data-testid="new-project"><Plus className="w-4 h-4" /> New project</Button>}
        </>
      } />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <Input className="col-span-2 md:col-span-1" placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search projects" />
        <Select aria-label="Status" value={status} onChange={(e) => setParam('status', e.target.value)}><option value="">All statuses</option>{PROJECT_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}</Select>
        <Select aria-label="Department" value={dept} onChange={(e) => setParam('dept', e.target.value)}><option value="">All departments</option>{ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
        <Select aria-label="Client" value={client} onChange={(e) => setParam('client', e.target.value)}><option value="">All clients</option>{ws.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
      </div>
      {rows.length === 0 ? (
        <Card><EmptyState title="No projects" hint={canCreateProject(ws.me) ? 'Create your first project to start planning work.' : 'You are not a member of any project yet.'} action={canCreateProject(ws.me) && <Button onClick={() => setCreating(true)}><Plus className="w-4 h-4" /> New project</Button>} /></Card>
      ) : view === 'table' ? (
        <Card padded={false}>
          <Table head={['Project', 'Client', 'Department', 'Manager', 'Team', 'Status', 'Priority', 'Due', 'Progress']}>
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-indigo-50/40">
                <td className="px-3 py-2.5 min-w-[200px]"><Link to={`/erp/projects/${p.id}`} className="font-medium text-slate-800 hover:text-indigo-700"><span className="text-[11px] font-mono text-slate-400 mr-1.5">{p.code}</span>{p.name}</Link></td>
                <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{ws.client(p.clientId)?.name ?? '—'}</td>
                <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{ws.dept(p.departmentId)?.name ?? '—'}</td>
                <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{ws.empName(p.projectManagerId)}</td>
                <td className="px-3 py-2.5"><AvatarStack names={p.memberIds.map(ws.empName)} /></td>
                <td className="px-3 py-2.5"><ProjectStatusBadge status={p.status} /></td>
                <td className="px-3 py-2.5"><PriorityBadge priority={p.priority} /></td>
                <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{fmtDate(p.endDate)}</td>
                <td className="px-3 py-2.5 w-36"><ProgressBar value={projectProgress(p.id, ws.tasks)} /></td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((p) => {
            const tasks = ws.tasks.filter((t) => t.projectId === p.id && !t.isArchived);
            return (
              <Link key={p.id} to={`/erp/projects/${p.id}`} className="bg-white rounded-xl ring-1 ring-slate-200 shadow-sm p-4 hover:ring-indigo-300 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="text-[11px] font-mono text-slate-400">{p.code}</p><h3 className="font-semibold text-slate-900 truncate">{p.name}</h3><p className="text-xs text-slate-500 truncate">{ws.client(p.clientId)?.name} · {ws.dept(p.departmentId)?.name}</p></div>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <ProgressBar value={projectProgress(p.id, ws.tasks)} />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <AvatarStack names={p.memberIds.map(ws.empName)} max={5} />
                  <span>{tasks.length} tasks · due {fmtDate(p.endDate, 'dd MMM')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {creating && <ProjectForm onClose={() => setCreating(false)} />}
    </div>
  );
}
