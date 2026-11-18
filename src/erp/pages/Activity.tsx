import { useMemo, useState } from 'react';
import { ActivityList } from '../components/Collab';
import { Button, Card, Input, PageHeader, Select, Spinner } from '../components/ui';
import { useLive } from '../hooks/useLive';
import { useWorkspace } from '../hooks/useWorkspace';
import { toMillis } from '../lib/dates';
import { downloadCsv, toCsv } from '../lib/csv';
import { subscribeActivity } from '../services/activity';
import type { ActivityLog } from '../types';

export function ActivityPage() {
  const ws = useWorkspace();
  const ids = useMemo(() => ws.projects.map((p) => p.id), [ws.projects]);
  const live = useLive<ActivityLog[]>((d, e) => subscribeActivity(ws.me, ids, d, e), [ws.me.id, ids.join(',')], []);
  const [f, setF] = useState({ q: '', project: '', actor: '', type: '', from: '', to: '' });
  const types = Array.from(new Set(live.data.map((l) => l.entityType))).sort();
  const from = f.from ? new Date(f.from).getTime() : null;
  const to = f.to ? new Date(f.to).getTime() + 86_399_999 : null;
  const rows = live.data.filter((l) => {
    const at = toMillis(l.at) ?? Date.now();
    return (!f.q || l.summary.toLowerCase().includes(f.q.toLowerCase())) && (!f.project || l.projectId === f.project) && (!f.actor || l.actorId === f.actor) && (!f.type || l.entityType === f.type) && (from === null || at >= from) && (to === null || at <= to);
  });
  const shown = rows.slice(0, 300);
  return (
    <div className="space-y-4">
      <PageHeader title="Activity Logs" subtitle="Append-only audit trail. Entries cannot be edited or deleted." actions={
        <Button variant="secondary" onClick={() => downloadCsv('activity-log.csv', toCsv(['When', 'Actor', 'Entity', 'Action', 'Project', 'Summary'], rows.map((l) => [l.at?.toDate().toISOString() ?? '', ws.empName(l.actorId), l.entityType, l.action, ws.project(l.projectId)?.code ?? '', l.summary])))}>Export CSV</Button>
      } />
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <Input className="col-span-2" placeholder="Search…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
          <Select aria-label="Project" value={f.project} onChange={(e) => setF({ ...f, project: e.target.value })}><option value="">All projects</option>{ws.projects.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}</Select>
          <Select aria-label="Person" value={f.actor} onChange={(e) => setF({ ...f, actor: e.target.value })}><option value="">Everyone</option>{ws.employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</Select>
          <Select aria-label="Type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="">All types</option>{types.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
          <div className="flex gap-1 col-span-2 md:col-span-1"><Input type="date" className="min-w-0" aria-label="From" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /><Input type="date" className="min-w-0" aria-label="To" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
        </div>
      </Card>
      <Card title={`${rows.length} entries${rows.length > shown.length ? ` (showing latest ${shown.length})` : ''}`}>{live.loading ? <Spinner /> : <ActivityList logs={shown} showEntity />}</Card>
    </div>
  );
}
