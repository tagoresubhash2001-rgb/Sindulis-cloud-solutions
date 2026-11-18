import { Pencil, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Card, EmptyState, ErrorBanner, Field, Input, Modal, PageHeader, Select, Spinner, Table, Tabs, Textarea } from '../components/ui';
import { useLive } from '../hooks/useLive';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtDateTime } from '../lib/dates';
import { assignableRoles, isSuperAdmin, ROLE_LABELS } from '../lib/permissions';
import { departmentSchema, employeeUpdateSchema, firstIssue, inviteSchema, settingsSchema, type DepartmentInput, type EmployeeUpdateInput, type InviteInput } from '../lib/schemas';
import { humanize } from '../lib/ui';
import { createDepartment, updateDepartment } from '../services/departments';
import { inviteEmployee, subscribeInvites, updateEmployee } from '../services/employees';
import { setLeadStatus, subscribeLeads } from '../services/leads';
import { saveSettings } from '../services/settings';
import { LEAD_STATUSES, type Department, type Employee, type Invite, type Lead, type OrgSettings } from '../types';

type Tab = 'employees' | 'departments' | 'leads' | 'settings';

export function AdminPage() {
  const { section } = useParams();
  const [tab, setTab] = useState<Tab>((section as Tab) || 'employees');
  return (
    <div className="space-y-4">
      <PageHeader title="Administration" subtitle="People, departments, website leads and organisation settings" actions={<Link to="/erp/clients" className="text-sm font-semibold text-indigo-700">Manage clients →</Link>} />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[{ id: 'employees', label: 'Employees' }, { id: 'departments', label: 'Departments' }, { id: 'leads', label: 'Website leads' }, { id: 'settings', label: 'Settings' }]} />
      {tab === 'employees' && <Employees />}
      {tab === 'departments' && <Departments />}
      {tab === 'leads' && <Leads />}
      {tab === 'settings' && <SettingsForm />}
    </div>
  );
}

function Employees() {
  const ws = useWorkspace();
  const invites = useLive<Invite[]>((d, e) => subscribeInvites(d, e), [], []);
  const [edit, setEdit] = useState<Employee | null>(null);
  const [inviting, setInviting] = useState(false);
  const [q, setQ] = useState('');
  const pending = invites.data.filter((i) => !i.claimedBy);
  const rows = ws.employees.filter((e) => `${e.name} ${e.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <Input placeholder="Search employees…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Button onClick={() => setInviting(true)} data-testid="invite-btn"><UserPlus className="w-4 h-4" /> Invite employee</Button>
      </div>
      <Card padded={false} title={`${ws.employees.length} employees`}>
        <Table head={['Employee', 'Role', 'Department', 'Designation', 'Capacity', 'Status', '']}>
          {rows.map((e) => (
            <tr key={e.id}>
              <td className="px-3 py-2.5"><span className="flex items-center gap-2"><Avatar name={e.name} /><span><span className="block font-medium">{e.name}{e.id === ws.me.id && <span className="text-[10px] text-indigo-600 font-bold ml-1">YOU</span>}</span><span className="block text-[11px] text-slate-500">{e.email}</span></span></span></td>
              <td className="px-3 py-2.5 whitespace-nowrap">{ROLE_LABELS[e.role]}</td>
              <td className="px-3 py-2.5 text-slate-600">{ws.dept(e.departmentId)?.name ?? '—'}</td>
              <td className="px-3 py-2.5 text-slate-600">{e.designation || '—'}</td>
              <td className="px-3 py-2.5 text-slate-600">{e.weeklyCapacityHours}h/wk</td>
              <td className="px-3 py-2.5">{e.active ? <Badge tone="green">Active</Badge> : <Badge tone="red">Deactivated</Badge>}</td>
              <td className="px-3 py-2.5 text-right">
                {(isSuperAdmin(ws.me) || !['SUPER_ADMIN', 'ADMIN'].includes(e.role)) && <Button size="sm" variant="ghost" onClick={() => setEdit(e)} aria-label={`Edit ${e.name}`}><Pencil className="w-3.5 h-3.5" /></Button>}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <Card padded={false} title={`Pending invitations (${pending.length})`}>
        {invites.loading ? <Spinner /> : pending.length === 0 ? <EmptyState title="No pending invitations" /> : (
          <Table head={['Email', 'Name', 'Role', 'Department', 'Invited']}>
            {pending.map((i) => (
              <tr key={i.id}><td className="px-3 py-2">{i.email}</td><td className="px-3 py-2">{i.name}</td><td className="px-3 py-2">{ROLE_LABELS[i.role]}</td><td className="px-3 py-2">{ws.dept(i.departmentId)?.name ?? '—'}</td><td className="px-3 py-2 text-xs text-slate-500">{fmtDateTime(i.createdAt)} by {ws.empName(i.createdBy)}</td></tr>
            ))}
          </Table>
        )}
      </Card>
      {edit && <EmployeeModal emp={edit} onClose={() => setEdit(null)} />}
      {inviting && <InviteModal onClose={() => setInviting(false)} />}
    </div>
  );
}

function EmployeeModal({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const ws = useWorkspace();
  const toast = useToast();
  const [v, setV] = useState<EmployeeUpdateInput>({ name: emp.name, phone: emp.phone, departmentId: emp.departmentId, role: emp.role, designation: emp.designation, managerId: emp.managerId, active: emp.active, weeklyCapacityHours: emp.weeklyCapacityHours });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const self = emp.id === ws.me.id;
  const roles = Array.from(new Set([...assignableRoles(ws.me), emp.role]));
  const save = async () => {
    try { employeeUpdateSchema.parse(v); } catch (e) { return setErr(firstIssue(e)); }
    setBusy(true);
    if (await toast.run(() => updateEmployee(ws.me, emp, v), 'Employee updated')) onClose();
    setBusy(false);
  };
  return (
    <Modal title={`Edit ${emp.name}`} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={busy} onClick={save}>Save</Button></>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {err && <div className="sm:col-span-2"><ErrorBanner message={err} /></div>}
        <Field label="Name">{(id) => <Input id={id} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />}</Field>
        <Field label="Phone">{(id) => <Input id={id} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />}</Field>
        <Field label="Role" hint={self ? 'You cannot change your own role.' : undefined}>{(id) => <Select id={id} value={v.role} disabled={self} onChange={(e) => setV({ ...v, role: e.target.value as EmployeeUpdateInput['role'] })}>{roles.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</Select>}</Field>
        <Field label="Department">{(id) => <Select id={id} value={v.departmentId ?? ''} onChange={(e) => setV({ ...v, departmentId: e.target.value || null })}><option value="">None</option>{ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>}</Field>
        <Field label="Designation">{(id) => <Input id={id} value={v.designation} onChange={(e) => setV({ ...v, designation: e.target.value })} />}</Field>
        <Field label="Reports to">{(id) => <Select id={id} value={v.managerId ?? ''} onChange={(e) => setV({ ...v, managerId: e.target.value || null })}><option value="">—</option>{ws.employees.filter((x) => x.id !== emp.id).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>}</Field>
        <Field label="Weekly capacity (hours)">{(id) => <Input id={id} type="number" min={0} max={80} value={v.weeklyCapacityHours} onChange={(e) => setV({ ...v, weeklyCapacityHours: Number(e.target.value) || 0 })} />}</Field>
        <label className="flex items-center gap-2 text-sm self-end pb-2"><input type="checkbox" checked={v.active} disabled={self} onChange={(e) => setV({ ...v, active: e.target.checked })} className="rounded border-slate-300" /> Active (unchecked = deactivated, access revoked)</label>
      </div>
    </Modal>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const ws = useWorkspace();
  const toast = useToast();
  const roles = assignableRoles(ws.me);
  const [v, setV] = useState<InviteInput>({ email: '', name: '', role: 'EMPLOYEE', departmentId: ws.departments[0]?.id ?? null, designation: '' });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const send = async () => {
    try { inviteSchema.parse(v); } catch (e) { return setErr(firstIssue(e)); }
    setErr(null);
    setBusy(true);
    try { const r = await inviteEmployee(ws.me, v); setResult(r.message); } catch (e) { toast.fail(e); }
    setBusy(false);
  };
  return (
    <Modal title="Invite employee" onClose={onClose} footer={result ? <Button onClick={onClose}>Done</Button> : <><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={busy} onClick={send} data-testid="invite-send">Send invitation</Button></>}>
      {result ? <p className="text-sm text-slate-700" data-testid="invite-result">{result}</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {err && <div className="sm:col-span-2"><ErrorBanner message={err} /></div>}
          <Field label="Work email *" className="sm:col-span-2">{(id) => <Input id={id} type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} autoFocus data-testid="invite-email" />}</Field>
          <Field label="Full name *">{(id) => <Input id={id} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} data-testid="invite-name" />}</Field>
          <Field label="Designation">{(id) => <Input id={id} value={v.designation} onChange={(e) => setV({ ...v, designation: e.target.value })} />}</Field>
          <Field label="Role">{(id) => <Select id={id} value={v.role} onChange={(e) => setV({ ...v, role: e.target.value as InviteInput['role'] })} data-testid="invite-role">{roles.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</Select>}</Field>
          <Field label="Department">{(id) => <Select id={id} value={v.departmentId ?? ''} onChange={(e) => setV({ ...v, departmentId: e.target.value || null })}><option value="">None</option>{ws.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>}</Field>
          <p className="sm:col-span-2 text-xs text-slate-500">They receive a verification email and a link to set a password. They can also sign in with Google using this address. Access starts at their first verified sign-in.</p>
        </div>
      )}
    </Modal>
  );
}

function Departments() {
  const ws = useWorkspace();
  const toast = useToast();
  const [form, setForm] = useState<{ dept?: Department } | null>(null);
  const [v, setV] = useState<DepartmentInput>({ name: '', code: '', headId: null, active: true });
  const [err, setErr] = useState<string | null>(null);
  const openForm = (dept?: Department) => { setForm({ dept }); setErr(null); setV(dept ? { name: dept.name, code: dept.code, headId: dept.headId, active: dept.active } : { name: '', code: '', headId: null, active: true }); };
  const save = async () => {
    try { departmentSchema.parse(v); } catch (e) { return setErr(firstIssue(e)); }
    if (await toast.run(() => (form?.dept ? updateDepartment(ws.me, form.dept, v) : createDepartment(ws.me, v)), 'Department saved')) setForm(null);
  };
  return (
    <>
      <div className="flex justify-end"><Button onClick={() => openForm()}><Plus className="w-4 h-4" /> New department</Button></div>
      <Card padded={false}>
        {ws.departments.length === 0 ? <EmptyState title="No departments" hint="Run the bootstrap script or add them here." /> : (
          <Table head={['Department', 'Code', 'Head', 'People', 'Active projects', 'Status', '']}>
            {ws.departments.map((d) => (
              <tr key={d.id}>
                <td className="px-3 py-2.5 font-medium">{d.name}</td><td className="px-3 py-2.5 font-mono text-xs">{d.code}</td>
                <td className="px-3 py-2.5">{ws.empName(d.headId)}</td>
                <td className="px-3 py-2.5">{ws.employees.filter((e) => e.departmentId === d.id && e.active).length}</td>
                <td className="px-3 py-2.5">{ws.projects.filter((p) => p.departmentId === d.id && p.status === 'ACTIVE' && !p.isArchived).length}</td>
                <td className="px-3 py-2.5">{d.active ? <Badge tone="green">Active</Badge> : <Badge>Inactive</Badge>}</td>
                <td className="px-3 py-2.5 text-right"><Button size="sm" variant="ghost" onClick={() => openForm(d)} aria-label={`Edit ${d.name}`}><Pencil className="w-3.5 h-3.5" /></Button></td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      {form && (
        <Modal title={form.dept ? `Edit ${form.dept.name}` : 'New department'} onClose={() => setForm(null)} footer={<><Button variant="secondary" onClick={() => setForm(null)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {err && <div className="sm:col-span-2"><ErrorBanner message={err} /></div>}
            <Field label="Name *">{(id) => <Input id={id} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />}</Field>
            <Field label="Code *" hint="e.g. SW, MKT">{(id) => <Input id={id} value={v.code} onChange={(e) => setV({ ...v, code: e.target.value.toUpperCase() })} />}</Field>
            <Field label="Department head">{(id) => <Select id={id} value={v.headId ?? ''} onChange={(e) => setV({ ...v, headId: e.target.value || null })}><option value="">—</option>{ws.employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</Select>}</Field>
            <label className="flex items-center gap-2 text-sm self-end pb-2"><input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} className="rounded border-slate-300" /> Active</label>
          </div>
        </Modal>
      )}
    </>
  );
}

function Leads() {
  const ws = useWorkspace();
  const toast = useToast();
  const live = useLive<Lead[]>((d, e) => subscribeLeads(d, e), [], []);
  const [source, setSource] = useState('');
  const [open, setOpen] = useState<Lead | null>(null);
  const rows = live.data.filter((l) => !source || l.source === source);
  const sources = Array.from(new Set(live.data.map((l) => l.source)));
  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <p className="text-sm text-slate-500">Submissions from the public website forms (Contact, Quote, Waitlist, Enroll).</p>
        <Select aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)} className="w-56"><option value="">All sources</option>{sources.map((s) => <option key={s} value={s}>{s}</option>)}</Select>
      </div>
      {live.error && <ErrorBanner message={live.error} />}
      <Card padded={false}>
        {live.loading ? <Spinner /> : rows.length === 0 ? <EmptyState title="No leads yet" /> : (
          <Table head={['Received', 'Source', 'Name', 'Contact', 'Service', 'Status']}>
            {rows.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setOpen(l)}>
                <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">{fmtDateTime(l.createdAt)}</td>
                <td className="px-3 py-2"><Badge tone="indigo">{l.source}</Badge></td>
                <td className="px-3 py-2 font-medium">{l.name || '—'}{l.company && <span className="block text-[11px] text-slate-500">{l.company}</span>}</td>
                <td className="px-3 py-2 text-xs">{l.email}<br />{l.phone}</td>
                <td className="px-3 py-2 text-xs">{l.service || '—'}</td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <Select aria-label="Lead status" value={l.status} onChange={(e) => toast.run(() => setLeadStatus(ws.me, l, e.target.value as Lead['status']))} className="py-1 text-xs w-32">{LEAD_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}</Select>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      {open && (
        <Modal title={`Lead · ${open.name || open.email}`} onClose={() => setOpen(null)}>
          <dl className="text-sm space-y-1.5">
            {[['Source', open.source], ['Email', open.email], ['Phone', open.phone], ['Company', open.company], ['Service', open.service], ...Object.entries(open.extra)].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-2"><dt className="text-slate-500">{k}</dt><dd className="col-span-2 break-words">{v}</dd></div>
            ))}
          </dl>
          {open.message && <p className="text-sm mt-3 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{open.message}</p>}
        </Modal>
      )}
    </>
  );
}

function SettingsForm() {
  const ws = useWorkspace();
  const toast = useToast();
  const [v, setV] = useState<OrgSettings>(ws.settings);
  const [err, setErr] = useState<string | null>(null);
  return (
    <Card title="Organisation settings">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {err && <div className="sm:col-span-2"><ErrorBanner message={err} /></div>}
        <Field label="Organisation name">{(id) => <Input id={id} value={v.orgName} onChange={(e) => setV({ ...v, orgName: e.target.value })} />}</Field>
        <Field label="Default weekly capacity (hours)">{(id) => <Input id={id} type="number" value={v.defaultWeeklyCapacityHours} onChange={(e) => setV({ ...v, defaultWeeklyCapacityHours: Number(e.target.value) || 0 })} />}</Field>
        <Field label="Deadline warning (hours before due)">{(id) => <Input id={id} type="number" value={v.deadlineWarningHours} onChange={(e) => setV({ ...v, deadlineWarningHours: Number(e.target.value) || 0 })} />}</Field>
        <div className="space-y-2 self-end">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.allowMultipleAssignees} onChange={(e) => setV({ ...v, allowMultipleAssignees: e.target.checked })} className="rounded border-slate-300" /> Allow multiple assignees per task</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.timeTrackingEnabled} onChange={(e) => setV({ ...v, timeTrackingEnabled: e.target.checked })} className="rounded border-slate-300" /> Enable time tracking</label>
        </div>
        <div className="sm:col-span-2 text-xs text-slate-500 space-y-1">
          <p>v1 defaults: single-level approval (data model supports more levels), no client portal, no recurring tasks, simple task dependencies.</p>
          <p>On the Spark plan, deadline and overdue reminders are created when each person opens the ERP. Scheduled reminders need the Blaze plan (Cloud Functions).</p>
        </div>
        <div className="sm:col-span-2"><Button onClick={async () => { try { settingsSchema.parse(v); setErr(null); } catch (e) { return setErr(firstIssue(e)); } await toast.run(() => saveSettings(ws.me, v), 'Settings saved'); }}>Save settings</Button></div>
      </div>
    </Card>
  );
}

export function ProfilePage() {
  const ws = useWorkspace();
  const toast = useToast();
  const [name, setName] = useState(ws.me.name);
  const [phone, setPhone] = useState(ws.me.phone);
  return (
    <div className="space-y-4 max-w-xl">
      <PageHeader title="My profile" />
      <Card>
        <div className="flex items-center gap-3 mb-4"><Avatar name={ws.me.name} size="md" /><div><p className="font-semibold">{ws.me.email}</p><p className="text-xs text-slate-500">{ROLE_LABELS[ws.me.role]} · {ws.dept(ws.me.departmentId)?.name ?? 'No department'}</p></div></div>
        <div className="space-y-3">
          <Field label="Name">{(id) => <Input id={id} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
          <Field label="Phone">{(id) => <Input id={id} value={phone} onChange={(e) => setPhone(e.target.value)} />}</Field>
          <Button onClick={async () => { const { updateOwnProfile } = await import('../services/employees'); await toast.run(() => updateOwnProfile(ws.me, { name, phone }), 'Profile saved'); }}>Save</Button>
        </div>
      </Card>
      <Card title="About roles"><Textarea readOnly rows={4} value="Role and department changes are made by an administrator. Contact your admin if your access looks wrong." /></Card>
    </div>
  );
}
