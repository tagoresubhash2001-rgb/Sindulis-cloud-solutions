import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ClientForm } from '../components/forms';
import { Badge, Button, Card, EmptyState, Input, PageHeader, Table } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { canManageClients } from '../lib/permissions';
import { humanize } from '../lib/ui';
import type { Client } from '../types';

export function ClientsPage() {
  const ws = useWorkspace();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [form, setForm] = useState<{ client?: Client } | null>(null);
  const highlight = params.get('client');
  const rows = ws.clients.filter((c) => !c.isArchived && `${c.code} ${c.name} ${c.company} ${c.contactPerson}`.toLowerCase().includes(q.toLowerCase()));
  const can = canManageClients(ws.me);
  return (
    <div className="space-y-4">
      <PageHeader title="Clients" subtitle={`${rows.length} clients`} actions={can && <Button onClick={() => setForm({})} data-testid="new-client"><Plus className="w-4 h-4" /> New client</Button>} />
      <Input placeholder="Search clients…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" aria-label="Search clients" />
      <Card padded={false}>
        {rows.length === 0 ? <EmptyState title="No clients yet" action={can && <Button onClick={() => setForm({})}><Plus className="w-4 h-4" /> New client</Button>} /> : (
          <Table head={['Client', 'Contact', 'Phone / Email', 'Departments', 'Projects', 'Status', '']}>
            {rows.map((c) => (
              <tr key={c.id} className={highlight === c.id ? 'bg-indigo-50' : ''}>
                <td className="px-3 py-2.5"><span className="text-[11px] font-mono text-slate-400 mr-1.5">{c.code}</span><span className="font-medium">{c.name}</span>{c.company && <span className="block text-[11px] text-slate-500">{c.company}</span>}</td>
                <td className="px-3 py-2.5 text-slate-600">{c.contactPerson || '—'}</td>
                <td className="px-3 py-2.5 text-slate-600 text-xs">{c.phone}<br />{c.email}</td>
                <td className="px-3 py-2.5 text-xs text-slate-600">{c.departmentIds.map((d) => ws.dept(d)?.name).filter(Boolean).join(', ') || '—'}</td>
                <td className="px-3 py-2.5"><Link className="text-indigo-700 text-xs font-semibold" to={`/erp/projects?client=${c.id}`}>{ws.projects.filter((p) => p.clientId === c.id && !p.isArchived).length} projects</Link></td>
                <td className="px-3 py-2.5"><Badge tone={c.status === 'ACTIVE' ? 'green' : c.status === 'PROSPECT' ? 'blue' : 'slate'}>{humanize(c.status)}</Badge></td>
                <td className="px-3 py-2.5 text-right">{can && <Button size="sm" variant="ghost" onClick={() => setForm({ client: c })} aria-label={`Edit ${c.name}`}><Pencil className="w-3.5 h-3.5" /></Button>}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      {form && <ClientForm client={form.client} onClose={() => setForm(null)} />}
    </div>
  );
}
