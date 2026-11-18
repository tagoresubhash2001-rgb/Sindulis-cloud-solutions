import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { subscribeApprovals } from '../services/approvals';
import { subscribeClients } from '../services/clients';
import { subscribeDepartments } from '../services/departments';
import { subscribeEmployees } from '../services/employees';
import { subscribeMilestones } from '../services/milestones';
import { ensureDeadlineReminders, subscribeMyNotifications } from '../services/notifications';
import { subscribeVisibleProjects } from '../services/projects';
import { subscribeSettings } from '../services/settings';
import { subscribeVisibleTasks } from '../services/tasks';
import {
  DEFAULT_SETTINGS,
  type AppNotification,
  type Approval,
  type Client,
  type Department,
  type Employee,
  type Milestone,
  type OrgSettings,
  type Project,
  type Task,
} from '../types';
import { useLive } from './useLive';

export interface Workspace {
  me: Employee;
  employees: Employee[];
  departments: Department[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  approvals: Approval[];
  notifications: AppNotification[];
  settings: OrgSettings;
  loading: boolean;
  errors: string[];
  emp: (id: string | null | undefined) => Employee | undefined;
  empName: (id: string | null | undefined) => string;
  dept: (id: string | null | undefined) => Department | undefined;
  client: (id: string | null | undefined) => Client | undefined;
  project: (id: string | null | undefined) => Project | undefined;
  task: (id: string | null | undefined) => Task | undefined;
  milestone: (id: string | null | undefined) => Milestone | undefined;
}

const Ctx = createContext<Workspace | null>(null);

const byId = <T extends { id: string }>(rows: T[]) => {
  const m = new Map<string, T>();
  for (const r of rows) m.set(r.id, r);
  return (id: string | null | undefined) => (id ? m.get(id) : undefined);
};

/** One set of real-time subscriptions for the whole ERP session, scoped by the user's role. */
export function WorkspaceProvider({ me, children }: { me: Employee; children: ReactNode }) {
  const employees = useLive<Employee[]>((d, e) => subscribeEmployees(d, e), [], []);
  const departments = useLive<Department[]>((d, e) => subscribeDepartments(d, e), [], []);
  const clients = useLive<Client[]>((d, e) => subscribeClients(d, e), [], []);
  const settings = useLive<OrgSettings>((d, e) => subscribeSettings(d, e), [], DEFAULT_SETTINGS);
  const projects = useLive<Project[]>((d, e) => subscribeVisibleProjects(me, d, e), [me.id, me.role, me.departmentId], []);
  const projectKey = projects.data.map((p) => p.id).sort().join(',');
  const projectIds = useMemo(() => (projectKey ? projectKey.split(',') : []), [projectKey]);
  const ready = !projects.loading;
  const tasks = useLive<Task[]>(ready ? (d, e) => subscribeVisibleTasks(me, projectIds, d, e) : null, [ready, projectKey, me.id, me.role], []);
  const milestones = useLive<Milestone[]>(ready ? (d, e) => subscribeMilestones(me, projectIds, d, e) : null, [ready, projectKey, me.id, me.role], []);
  const approvals = useLive<Approval[]>(ready ? (d, e) => subscribeApprovals(me, projectIds, d, e) : null, [ready, projectKey, me.id, me.role], []);
  const notifications = useLive<AppNotification[]>((d, e) => subscribeMyNotifications(me, d, e), [me.id], []);

  const loading = [employees, departments, projects, tasks].some((l) => l.loading) || !ready;
  const errors = [employees, departments, clients, settings, projects, tasks, milestones, approvals, notifications]
    .map((l) => l.error)
    .filter((e): e is string => !!e);

  // Deadline / overdue reminders (Spark plan: no scheduled functions), once per session.
  const reminded = useRef(false);
  useEffect(() => {
    if (loading || reminded.current) return;
    reminded.current = true;
    ensureDeadlineReminders(me, tasks.data, projects.data, settings.data.deadlineWarningHours).catch(() => undefined);
  }, [loading, me, tasks.data, projects.data, settings.data.deadlineWarningHours]);

  const value = useMemo<Workspace>(() => {
    const live = <T extends { isArchived: boolean }>(rows: T[]) => rows;
    const emp = byId(employees.data);
    return {
      me: employees.data.find((e) => e.id === me.id) ?? me,
      employees: employees.data.slice().sort((a, b) => a.name.localeCompare(b.name)),
      departments: departments.data.slice().sort((a, b) => a.name.localeCompare(b.name)),
      clients: clients.data.slice().sort((a, b) => a.name.localeCompare(b.name)),
      projects: live(projects.data).slice().sort((a, b) => b.code.localeCompare(a.code)),
      tasks: tasks.data.slice().sort((a, b) => b.code.localeCompare(a.code)),
      milestones: milestones.data.slice().sort((a, b) => a.order - b.order),
      approvals: approvals.data,
      notifications: notifications.data,
      settings: settings.data,
      loading,
      errors,
      emp,
      empName: (id) => (id ? (emp(id)?.name ?? 'Unknown') : '—'),
      dept: byId(departments.data),
      client: byId(clients.data),
      project: byId(projects.data),
      task: byId(tasks.data),
      milestone: byId(milestones.data),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, employees.data, departments.data, clients.data, projects.data, tasks.data, milestones.data, approvals.data, notifications.data, settings.data, loading, errors.join('|')]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace(): Workspace {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWorkspace outside WorkspaceProvider');
  return v;
}
