import { RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Card, ConfirmDialog, EmptyState, ErrorBanner, Input, PageHeader, Select, Spinner, Table } from '../components/ui';
import { useLive } from '../hooks/useLive';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtDateTime, toMillis } from '../lib/dates';
import { canPermanentlyDelete, canRestore } from '../lib/permissions';
import { ARCHIVABLE, permanentlyDelete, restoreEntity, subscribeArchive } from '../services/archive';
import type { ArchiveRecord } from '../types';

export function ArchivePage() {
  const ws = useWorkspace();
  const toast = useToast();
  const live = useLive<ArchiveRecord[]>((d, e) => subscribeArchive(ws.me, d, e), [ws.me.id], []);
  const [f, setF] = useState({ q: '', col: '', project: '', person: '', dept: '', from: '', to: '', state: 'archived' });
  const [confirm, setConfirm] = useState<{ r: ArchiveRecord; kind: 'restore' | 'delete' } | null>(null);
  const from = f.from ? new Date(f.from).getTime() : null;
  const to = f.to ? new Date(f.to).getTime() + 86_399_999 : null;
  const rows = live.data.filter((r) => {
    const at = toMillis(r.archivedAt) ?? Date.now();
    return (f.state === 'all' || (f.state === 'archived' ? !r.restoredAt : !!r.restoredAt))
      && (!f.q || r.title.toLowerCase().includes(f.q.toLowerCase()))
      && (!f.col || r.originalCollection === f.col)
      && (!f.project || r.originalProjectId === f.project)
      && (!f.person || r.historicalOwnerId === f.person || r.archivedBy === f.person)
      && (!f.dept || r.departmentId === f.dept)
      && (from === null || at >= from) && (to === null || at <= to);
  });
  return (
    <div className="space-y-4">
      <PageHeader title="Archive Center" subtitle="Archived records are read-only. Admins can restore; only the Super Admin can permanently delete." />
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
          <Input className="col-span-2" placeholder="Search archived records…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
          <Select aria-label="Category" value={f.col} onChange={(e) => setF({ ...f, col: e.target.value })}><option value="">All categories</option>{ARCHIVABLE.map((a) => <option key={a.col} value={a.col}>{a.label}</option>)}</Select>
          <Select aria-label="Project" value={f.project} onChange={(e) => setF({ ...f, project: e.target.value })}><option value="">All projects</option>{ws.projects.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}</Select>
          <Select aria-label="Employee" value={f.person} onChange={(e) => setF({ ...f, person: e.target.value })}><option value="">Any employee</option>{ws.employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</Select>
          <Select aria-label="Department" value={f.dept} onChange={(e) => setF({ ...f, dept: e.target.value })}><option value="">All departments</option>{ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
          <Select aria-label="State" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })}><option value="archived">Archived</option><option value="restored">Restored</option><option value="all">All</option></Select>
          <div className="flex gap-1"><Input type="date" aria-label="From" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /><Input type="date" aria-label="To" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
        </div>
      </Card>
      {live.error && <ErrorBanner message={live.error} />}
      <Card padded={false}>
        {live.loading ? <Spinner /> : rows.length === 0 ? <EmptyState title="Nothing archived" hint="Completed or cancelled projects and tasks can be archived from their pages." /> : (
          <Table head={['Record', 'Category', 'Final status', 'Project', 'Owner', 'Archived', '']}>
            {rows.map((r) => (
              <tr key={r.id} data-testid={`archive-row-${r.originalId}`}>
                <td className="px-3 py-2.5 font-medium">{r.title}</td>
                <td className="px-3 py-2.5"><Badge>{ARCHIVABLE.find((a) => a.col === r.originalCollection)?.label ?? r.originalCollection}</Badge></td>
                <td className="px-3 py-2.5 text-xs">{r.finalStatus}</td>
                <td className="px-3 py-2.5 text-xs">{ws.project(r.originalProjectId)?.code ?? '—'}</td>
                <td className="px-3 py-2.5 text-xs">{ws.empName(r.historicalOwnerId)}</td>
                <td className="px-3 py-2.5 text-xs text-slate-500">{fmtDateTime(r.archivedAt)} by {ws.empName(r.archivedBy)}{r.restoredAt && <><br /><span className="text-indigo-700">Restored {fmtDateTime(r.restoredAt)} by {ws.empName(r.restoredBy)}</span></>}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">
                  {!r.restoredAt && canRestore(ws.me) && <Button size="sm" variant="secondary" onClick={() => setConfirm({ r, kind: 'restore' })} data-testid="restore-btn"><RotateCcw className="w-3.5 h-3.5" /> Restore</Button>}
                  {!r.restoredAt && canPermanentlyDelete(ws.me) && <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setConfirm({ r, kind: 'delete' })}><Trash2 className="w-3.5 h-3.5" /></Button>}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      {confirm?.kind === 'restore' && (
        <ConfirmDialog title="Restore record?" message={<>Restore <b>{confirm.r.title}</b>? It becomes editable again.</>} confirmLabel="Restore" onConfirm={() => toast.run(() => restoreEntity(ws.me, confirm.r), 'Restored')} onClose={() => setConfirm(null)} />
      )}
      {confirm?.kind === 'delete' && (
        <ConfirmDialog danger title="Permanently delete?" typeToConfirm="DELETE" confirmLabel="Delete forever"
          message={<>This permanently removes <b>{confirm.r.title}</b>. Related logs remain. This cannot be undone.</>}
          onConfirm={() => toast.run(() => permanentlyDelete(ws.me, confirm.r), 'Permanently deleted')} onClose={() => setConfirm(null)} />
      )}
    </div>
  );
}
