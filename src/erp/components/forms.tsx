import { useState, type ReactNode } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { useToast } from '../hooks/useToast';
import { fromInputDate, toInputDate } from '../lib/dates';
import { canCreateProject, canManageTasks, isAdmin } from '../lib/permissions';
import { clientSchema, firstIssue, milestoneSchema, projectSchema, taskSchema, type ClientInput, type MilestoneInput, type ProjectInput, type TaskInput } from '../lib/schemas';
import { humanize } from '../lib/ui';
import { createClient, updateClient } from '../services/clients';
import { createMilestone, updateMilestone } from '../services/milestones';
import { createProject, projectToInput, updateProject } from '../services/projects';
import { createTask, taskToInput, updateTask } from '../services/tasks';
import { CLIENT_STATUSES, MILESTONE_STATUSES, PRIORITIES, PROJECT_STATUSES, type Client, type Milestone, type Project, type Task } from '../types';
import { Button, ErrorBanner, Field, Input, Modal, MultiPicker, Select, Textarea } from './ui';

function FormModal({ title, onClose, onSubmit, children, submitLabel = 'Save', wide }: { title: string; onClose: () => void; onSubmit: () => Promise<boolean>; children: ReactNode; submitLabel?: string; wide?: boolean }) {
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    const ok = await onSubmit();
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal
      title={title}
      onClose={onClose}
      wide={wide}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={busy} onClick={submit} data-testid="form-submit">{submitLabel}</Button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {children}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

/** Validate with zod first so field errors show inline, then run the service call. */
function useValidated() {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const run = async (validate: () => unknown, action: () => Promise<unknown>, success: string) => {
    try {
      validate();
      setError(null);
    } catch (e) {
      setError(firstIssue(e));
      return false;
    }
    return toast.run(action, success);
  };
  return { error, run };
}

export function ClientForm({ client, onClose }: { client?: Client; onClose: () => void }) {
  const ws = useWorkspace();
  const [v, setV] = useState<ClientInput>(
    client
      ? { name: client.name, company: client.company, contactPerson: client.contactPerson, phone: client.phone, email: client.email, address: client.address, departmentIds: client.departmentIds, status: client.status }
      : { name: '', company: '', contactPerson: '', phone: '', email: '', address: '', departmentIds: ws.me.departmentId ? [ws.me.departmentId] : [], status: 'ACTIVE' },
  );
  const set = <K extends keyof ClientInput>(k: K, val: ClientInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const { error, run } = useValidated();
  return (
    <FormModal title={client ? `Edit ${client.code}` : 'New client'} onClose={onClose} onSubmit={() => run(() => clientSchema.parse(v), () => (client ? updateClient(ws.me, client, v) : createClient(ws.me, v)), client ? 'Client updated' : 'Client created')}>
      {error && <div className="sm:col-span-2"><ErrorBanner message={error} /></div>}
      <Field label="Client name *">{(id) => <Input id={id} value={v.name} onChange={(e) => set('name', e.target.value)} autoFocus />}</Field>
      <Field label="Company">{(id) => <Input id={id} value={v.company} onChange={(e) => set('company', e.target.value)} />}</Field>
      <Field label="Contact person">{(id) => <Input id={id} value={v.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} />}</Field>
      <Field label="Phone">{(id) => <Input id={id} value={v.phone} onChange={(e) => set('phone', e.target.value)} />}</Field>
      <Field label="Email">{(id) => <Input id={id} type="email" value={v.email} onChange={(e) => set('email', e.target.value)} />}</Field>
      <Field label="Status">{(id) => <Select id={id} value={v.status} onChange={(e) => set('status', e.target.value as ClientInput['status'])}>{CLIENT_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}</Select>}</Field>
      <Field label="Address" className="sm:col-span-2">{(id) => <Textarea id={id} rows={2} value={v.address} onChange={(e) => set('address', e.target.value)} />}</Field>
      <Field label="Departments" className="sm:col-span-2">{() => <MultiPicker options={ws.departments.map((d) => ({ id: d.id, label: d.name }))} value={v.departmentIds} onChange={(x) => set('departmentIds', x)} />}</Field>
    </FormModal>
  );
}

export function ProjectForm({ project, onClose, onCreated }: { project?: Project; onClose: () => void; onCreated?: (id: string) => void }) {
  const ws = useWorkspace();
  const me = ws.me;
  const [v, setV] = useState<ProjectInput>(
    project
      ? projectToInput(project)
      : { name: '', clientId: ws.clients.find((c) => !c.isArchived)?.id ?? '', departmentId: me.departmentId ?? ws.departments[0]?.id ?? '', projectManagerId: me.id, memberIds: [], startDate: new Date(), endDate: null, priority: 'MEDIUM', budget: 0, description: '', status: 'PLANNING', clientVisible: false },
  );
  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const { error, run } = useValidated();
  const deptLocked = !!project && !isAdmin(me) && me.role !== 'DEPARTMENT_HEAD';
  const pmLocked = !!project && !isAdmin(me) && me.role !== 'DEPARTMENT_HEAD';
  const departments = ws.departments.filter((d) => d.active && (isAdmin(me) || me.role !== 'DEPARTMENT_HEAD' || d.id === me.departmentId));
  const people = ws.employees.filter((e) => e.active);
  const managers = people.filter((e) => ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_HEAD', 'PROJECT_MANAGER', 'TEAM_LEADER'].includes(e.role));
  return (
    <FormModal
      wide
      title={project ? `Edit ${project.code}` : 'New project'}
      submitLabel={project ? 'Save changes' : 'Create project'}
      onClose={onClose}
      onSubmit={() =>
        run(
          () => {
            projectSchema.parse(v);
            if (!project && !canCreateProject(me, v.departmentId)) throw new Error('You cannot create projects in this department');
          },
          async () => {
            if (project) await updateProject(me, project, v);
            else onCreated?.(await createProject(me, v));
          },
          project ? 'Project updated' : 'Project created',
        )
      }
    >
      {error && <div className="sm:col-span-2"><ErrorBanner message={error} /></div>}
      <Field label="Project name *" className="sm:col-span-2">{(id) => <Input id={id} value={v.name} onChange={(e) => set('name', e.target.value)} autoFocus />}</Field>
      <Field label="Client *" hint={ws.clients.length === 0 ? 'Create a client first (Clients page).' : undefined}>
        {(id) => <Select id={id} value={v.clientId} onChange={(e) => set('clientId', e.target.value)}><option value="">Select…</option>{ws.clients.filter((c) => !c.isArchived).map((c) => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}</Select>}
      </Field>
      <Field label="Department *">{(id) => <Select id={id} value={v.departmentId} disabled={deptLocked} onChange={(e) => set('departmentId', e.target.value)}><option value="">Select…</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>}</Field>
      <Field label="Project manager *">{(id) => <Select id={id} value={v.projectManagerId} disabled={pmLocked || me.role === 'PROJECT_MANAGER'} onChange={(e) => set('projectManagerId', e.target.value)}>{managers.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</Select>}</Field>
      <Field label="Status">{(id) => <Select id={id} value={v.status} onChange={(e) => set('status', e.target.value as ProjectInput['status'])}>{PROJECT_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}</Select>}</Field>
      <Field label="Start date">{(id) => <Input id={id} type="date" value={toInputDate(v.startDate)} onChange={(e) => set('startDate', fromInputDate(e.target.value))} />}</Field>
      <Field label="End date">{(id) => <Input id={id} type="date" value={toInputDate(v.endDate)} onChange={(e) => set('endDate', fromInputDate(e.target.value, true))} />}</Field>
      <Field label="Priority">{(id) => <Select id={id} value={v.priority} onChange={(e) => set('priority', e.target.value as ProjectInput['priority'])}>{PRIORITIES.map((p) => <option key={p} value={p}>{humanize(p)}</option>)}</Select>}</Field>
      <Field label="Budget (₹)">{(id) => <Input id={id} type="number" min={0} value={v.budget} onChange={(e) => set('budget', Number(e.target.value) || 0)} />}</Field>
      <Field label="Team members" className="sm:col-span-2" hint="Only members can be assigned tasks. The project manager is always included.">
        {() => <MultiPicker options={people.map((e) => ({ id: e.id, label: e.name, hint: ws.dept(e.departmentId)?.name }))} value={v.memberIds} onChange={(x) => set('memberIds', x)} />}
      </Field>
      <Field label="Description" className="sm:col-span-2">{(id) => <Textarea id={id} value={v.description} onChange={(e) => set('description', e.target.value)} />}</Field>
      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={v.clientVisible} onChange={(e) => set('clientVisible', e.target.checked)} className="rounded border-slate-300" /> Visible to client (reserved for the future client portal)</label>
    </FormModal>
  );
}

export function MilestoneForm({ project, milestone, onClose }: { project: Project; milestone?: Milestone; onClose: () => void }) {
  const ws = useWorkspace();
  const count = ws.milestones.filter((m) => m.projectId === project.id).length;
  const [v, setV] = useState<MilestoneInput>(
    milestone
      ? { projectId: project.id, title: milestone.title, description: milestone.description, dueDate: milestone.dueDate?.toDate() ?? null, order: milestone.order, status: milestone.status, deliverables: milestone.deliverables }
      : { projectId: project.id, title: '', description: '', dueDate: null, order: count, status: 'PENDING', deliverables: [] },
  );
  const [deliv, setDeliv] = useState(v.deliverables.join('\n'));
  const set = <K extends keyof MilestoneInput>(k: K, val: MilestoneInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const { error, run } = useValidated();
  const final = () => ({ ...v, deliverables: deliv.split('\n').map((s) => s.trim()).filter(Boolean) });
  return (
    <FormModal title={milestone ? 'Edit milestone' : `New milestone · ${project.code}`} onClose={onClose} onSubmit={() => run(() => milestoneSchema.parse(final()), () => (milestone ? updateMilestone(ws.me, project, milestone, final()) : createMilestone(ws.me, project, final())), milestone ? 'Milestone updated' : 'Milestone added')}>
      {error && <div className="sm:col-span-2"><ErrorBanner message={error} /></div>}
      <Field label="Title *" className="sm:col-span-2">{(id) => <Input id={id} value={v.title} onChange={(e) => set('title', e.target.value)} autoFocus />}</Field>
      <Field label="Due date">{(id) => <Input id={id} type="date" value={toInputDate(v.dueDate)} onChange={(e) => set('dueDate', fromInputDate(e.target.value, true))} />}</Field>
      <Field label="Status">{(id) => <Select id={id} value={v.status} onChange={(e) => set('status', e.target.value as MilestoneInput['status'])}>{MILESTONE_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}</Select>}</Field>
      <Field label="Description" className="sm:col-span-2">{(id) => <Textarea id={id} rows={2} value={v.description} onChange={(e) => set('description', e.target.value)} />}</Field>
      <Field label="Deliverables (one per line)" className="sm:col-span-2">{(id) => <Textarea id={id} rows={3} value={deliv} onChange={(e) => setDeliv(e.target.value)} />}</Field>
    </FormModal>
  );
}

export function TaskForm({ task, defaultProjectId, defaultMilestoneId, onClose, onCreated }: { task?: Task; defaultProjectId?: string; defaultMilestoneId?: string; onClose: () => void; onCreated?: (id: string) => void }) {
  const ws = useWorkspace();
  const me = ws.me;
  const manageable = ws.projects.filter((p) => !p.isArchived && canManageTasks(me, p));
  const [v, setV] = useState<TaskInput>(
    task
      ? taskToInput(task)
      : { title: '', description: '', projectId: defaultProjectId ?? manageable[0]?.id ?? '', milestoneId: defaultMilestoneId ?? null, ownerId: '', assigneeIds: [], reviewerId: null, priority: 'MEDIUM', startDate: new Date(), dueDate: null, estimatedHours: 0, blockedByTaskIds: [], tags: [] },
  );
  const [tags, setTags] = useState(v.tags.join(', '));
  const set = <K extends keyof TaskInput>(k: K, val: TaskInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const { error, run } = useValidated();
  const project = ws.project(v.projectId);
  const members = project ? ws.employees.filter((e) => project.memberIds.includes(e.id) && e.active) : [];
  const milestones = ws.milestones.filter((m) => m.projectId === v.projectId && !m.isArchived);
  const siblings = ws.tasks.filter((t) => t.projectId === v.projectId && t.id !== task?.id && !t.isArchived);
  const multi = ws.settings.allowMultipleAssignees;
  const final = (): TaskInput => {
    const owner = v.ownerId || v.assigneeIds[0] || '';
    return { ...v, ownerId: owner, assigneeIds: multi ? v.assigneeIds : owner ? [owner] : [], tags: tags.split(',').map((t) => t.trim()).filter(Boolean) };
  };
  if (manageable.length === 0 && !task) {
    return (
      <Modal title="New task" onClose={onClose}>
        <p className="text-sm text-slate-600">You don’t manage any active project yet. Ask a project manager to add you, or create a project first.</p>
      </Modal>
    );
  }
  return (
    <FormModal
      wide
      title={task ? `Edit ${task.code}` : 'New task'}
      submitLabel={task ? 'Save changes' : 'Create task'}
      onClose={onClose}
      onSubmit={() =>
        run(
          () => {
            taskSchema.parse(final());
            if (!project) throw new Error('Choose a project');
          },
          async () => {
            if (task) await updateTask(me, project!, task, final());
            else onCreated?.(await createTask(me, project!, final()));
          },
          task ? 'Task updated' : 'Task created',
        )
      }
    >
      {error && <div className="sm:col-span-2"><ErrorBanner message={error} /></div>}
      <Field label="Title *" className="sm:col-span-2">{(id) => <Input id={id} value={v.title} onChange={(e) => set('title', e.target.value)} autoFocus />}</Field>
      <Field label="Project *">{(id) => <Select id={id} value={v.projectId} disabled={!!task} onChange={(e) => setV((s) => ({ ...s, projectId: e.target.value, milestoneId: null, assigneeIds: [], ownerId: '', reviewerId: null, blockedByTaskIds: [] }))}>{(task ? ws.projects : manageable).map((p) => <option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}</Select>}</Field>
      <Field label="Milestone">{(id) => <Select id={id} value={v.milestoneId ?? ''} onChange={(e) => set('milestoneId', e.target.value || null)}><option value="">None</option>{milestones.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</Select>}</Field>
      <Field label={multi ? 'Assignees *' : 'Assignee *'} className="sm:col-span-2" hint={multi ? 'The primary owner is responsible; others collaborate.' : undefined}>
        {() => <MultiPicker max={multi ? 20 : 1} options={members.map((e) => ({ id: e.id, label: e.name, hint: e.designation || undefined }))} value={v.assigneeIds} onChange={(x) => setV((s) => ({ ...s, assigneeIds: x, ownerId: x.includes(s.ownerId) ? s.ownerId : (x[0] ?? '') }))} />}
      </Field>
      {multi && v.assigneeIds.length > 1 && (
        <Field label="Primary owner">{(id) => <Select id={id} value={v.ownerId} onChange={(e) => set('ownerId', e.target.value)}>{v.assigneeIds.map((a) => <option key={a} value={a}>{ws.empName(a)}</option>)}</Select>}</Field>
      )}
      <Field label="Reviewer" hint="Approves submitted work. Must not be an assignee.">{(id) => <Select id={id} value={v.reviewerId ?? ''} onChange={(e) => set('reviewerId', e.target.value || null)}><option value="">— none —</option>{members.filter((m) => !v.assigneeIds.includes(m.id)).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</Select>}</Field>
      <Field label="Priority">{(id) => <Select id={id} value={v.priority} onChange={(e) => set('priority', e.target.value as TaskInput['priority'])}>{PRIORITIES.map((p) => <option key={p} value={p}>{humanize(p)}</option>)}</Select>}</Field>
      <Field label="Start date">{(id) => <Input id={id} type="date" value={toInputDate(v.startDate)} onChange={(e) => set('startDate', fromInputDate(e.target.value))} />}</Field>
      <Field label="Due date">{(id) => <Input id={id} type="date" value={toInputDate(v.dueDate)} onChange={(e) => set('dueDate', fromInputDate(e.target.value, true))} data-testid="task-due" />}</Field>
      <Field label="Estimated hours">{(id) => <Input id={id} type="number" min={0} step={0.5} value={v.estimatedHours} onChange={(e) => set('estimatedHours', Number(e.target.value) || 0)} />}</Field>
      <Field label="Tags" hint="Comma separated">{(id) => <Input id={id} value={tags} onChange={(e) => setTags(e.target.value)} />}</Field>
      <Field label="Blocked by" className="sm:col-span-2" hint="Dependencies show a warning until they are completed.">
        {() => <MultiPicker options={siblings.map((t) => ({ id: t.id, label: `${t.code} · ${t.title}` }))} value={v.blockedByTaskIds} onChange={(x) => set('blockedByTaskIds', x)} />}
      </Field>
      <Field label="Description" className="sm:col-span-2">{(id) => <Textarea id={id} rows={4} value={v.description} onChange={(e) => set('description', e.target.value)} />}</Field>
    </FormModal>
  );
}
