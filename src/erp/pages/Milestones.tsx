import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MilestoneForm } from '../components/forms';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar, Select } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtDate, toMillis } from '../lib/dates';
import { milestoneProgress } from '../lib/metrics';
import { canManageProject } from '../lib/permissions';
import type { Milestone, Project } from '../types';

export function MilestonesPage() {
  const ws = useWorkspace();
  const [projectId, setProjectId] = useState('');
  const [form, setForm] = useState<{ project: Project; milestone?: Milestone } | null>(null);
  const projects = ws.projects.filter((p) => !p.isArchived && (!projectId || p.id === projectId));
  return (
    <div className="space-y-4">
      <PageHeader title="Milestones" subtitle="Progress is computed from completed vs. non-cancelled tasks" actions={
        <Select aria-label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-64"><option value="">All projects</option>{ws.projects.filter((p) => !p.isArchived).map((p) => <option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}</Select>
      } />
      {projects.length === 0 && <Card><EmptyState title="No projects" /></Card>}
      {projects.map((p) => {
        const ms = ws.milestones.filter((m) => m.projectId === p.id && !m.isArchived);
        const manage = canManageProject(ws.me, p);
        if (!ms.length && !manage && !projectId) return null;
        return (
          <Card key={p.id} title={<Link to={`/erp/projects/${p.id}`} className="hover:text-indigo-700">{p.code} · {p.name}</Link>} actions={manage && <Button size="sm" variant="ghost" onClick={() => setForm({ project: p })}><Plus className="w-3.5 h-3.5" /> Milestone</Button>} padded={false}>
            {ms.length === 0 ? <EmptyState title="No milestones yet" /> : (
              <ul className="divide-y divide-slate-100">
                {ms.map((m) => {
                  const tasks = ws.tasks.filter((t) => t.milestoneId === m.id && !t.isArchived);
                  const prog = milestoneProgress(m.id, ws.tasks.filter((t) => !t.isArchived));
                  const late = toMillis(m.dueDate) !== null && toMillis(m.dueDate)! < Date.now() && prog < 100;
                  return (
                    <li key={m.id} className="px-4 py-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <button disabled={!manage} onClick={() => setForm({ project: p, milestone: m })} className="md:col-span-5 text-left">
                        <span className="text-sm font-medium text-slate-800">{m.title}</span>
                        {m.description && <span className="block text-xs text-slate-500 truncate">{m.description}</span>}
                      </button>
                      <span className="md:col-span-2 text-xs text-slate-500">{tasks.filter((t) => t.status === 'COMPLETED').length}/{tasks.filter((t) => t.status !== 'CANCELLED').length} tasks</span>
                      <span className="md:col-span-2 text-xs">{late ? <Badge tone="red">Due {fmtDate(m.dueDate, 'dd MMM')}</Badge> : <span className="text-slate-500">Due {fmtDate(m.dueDate, 'dd MMM')}</span>}</span>
                      <ProgressBar value={prog} className="md:col-span-3" />
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        );
      })}
      {form && <MilestoneForm project={form.project} milestone={form.milestone} onClose={() => setForm(null)} />}
    </div>
  );
}
