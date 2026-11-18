import {
  Archive, Bell, Briefcase, Building2, CalendarDays, CheckSquare, ChevronsLeft, ChevronsRight, ClipboardCheck, FileText, FolderKanban, History,
  LayoutDashboard, LogOut, Menu, MessagesSquare, Milestone as MilestoneIcon, Plus, Search, Settings, User, Users, BarChart3, X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ClientForm, ProjectForm, TaskForm } from '../components/forms';
import { TaskDrawerBody } from '../components/TaskDrawer';
import { Avatar, Badge, Drawer, ErrorBanner, IconButton, Modal, Spinner, StatusBadge } from '../components/ui';
import { useErpAuth } from '../hooks/useAuth';
import { useWorkspace } from '../hooks/useWorkspace';
import { canArchive, canCreateProject, canManageClients, canManageTasks, isAdmin, ROLE_LABELS } from '../lib/permissions';
import { cx } from '../lib/ui';

interface NavItem { to: string; label: string; icon: ReactNode; end?: boolean; show?: boolean; badge?: number }

export function ErpLayout() {
  const ws = useWorkspace();
  const { signOutNow } = useErpAuth();
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('erp-nav-collapsed') === '1'; } catch { return false; } });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [create, setCreate] = useState<'task' | 'project' | 'client' | null>(null);
  const [menu, setMenu] = useState<'create' | 'profile' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const me = ws.me;
  const unread = ws.notifications.filter((n) => !n.read).length;
  const myReviews = ws.approvals.filter((a) => a.decision === null && a.reviewerId === me.id && !a.isArchived).length;

  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => { try { localStorage.setItem('erp-nav-collapsed', collapsed ? '1' : '0'); } catch { /* ignore */ } }, [collapsed]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const nav: NavItem[] = [
    { to: '/erp', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { to: '/erp/my', label: 'My Workspace', icon: <User className="w-4 h-4" /> },
    { to: '/erp/projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { to: '/erp/tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/erp/milestones', label: 'Milestones', icon: <MilestoneIcon className="w-4 h-4" /> },
    { to: '/erp/calendar', label: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
    { to: '/erp/approvals', label: 'Approvals', icon: <ClipboardCheck className="w-4 h-4" />, badge: myReviews },
    { to: '/erp/team', label: 'Team', icon: <Users className="w-4 h-4" />, show: me.role !== 'EMPLOYEE' && me.role !== 'VIEWER' },
    { to: '/erp/clients', label: 'Clients', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/erp/files', label: 'Files', icon: <FileText className="w-4 h-4" /> },
    { to: '/erp/discussions', label: 'Discussions', icon: <MessagesSquare className="w-4 h-4" /> },
    { to: '/erp/activity', label: 'Activity Logs', icon: <History className="w-4 h-4" /> },
    { to: '/erp/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/erp/archive', label: 'Archive', icon: <Archive className="w-4 h-4" />, show: canArchive(me, me.departmentId) },
    { to: '/erp/admin', label: 'Admin', icon: <Settings className="w-4 h-4" />, show: isAdmin(me) },
  ].filter((n) => n.show !== false);

  const canTask = ws.projects.some((p) => !p.isArchived && canManageTasks(me, p));
  const taskId = params.get('task');
  const openTask = taskId ? ws.task(taskId) : undefined;
  const closeTask = () => { const n = new URLSearchParams(params); n.delete('task'); setParams(n); };

  const Sidebar = ({ mobile }: { mobile?: boolean }) => (
    <nav className="flex flex-col h-full" aria-label="ERP navigation">
      <div className={cx('flex items-center gap-2 h-14 px-3 border-b border-slate-200 shrink-0', collapsed && !mobile && 'justify-center')}>
        <Link to="/erp" className="flex items-center gap-2 min-w-0">
          <img src="/assets/brands/sindulis/logo.png" alt="" className="w-7 h-7 object-contain" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          {(!collapsed || mobile) && <span className="font-extrabold text-sm tracking-tight text-sindulis-navy truncate">SINDULIS <span className="text-slate-400 font-semibold">ERP</span></span>}
        </Link>
        {mobile && <IconButton label="Close menu" className="ml-auto" onClick={() => setMobileOpen(false)}><X className="w-4 h-4" /></IconButton>}
      </div>
      <ul className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        {nav.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              title={collapsed && !mobile ? n.label : undefined}
              className={({ isActive }) => cx('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium', isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900', collapsed && !mobile && 'justify-center')}
            >
              {n.icon}
              {(!collapsed || mobile) && <span className="flex-1 truncate">{n.label}</span>}
              {!!n.badge && (!collapsed || mobile) && <span className="rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5">{n.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      {!mobile && (
        <button onClick={() => setCollapsed((c) => !c)} className="flex items-center justify-center gap-2 h-10 border-t border-slate-200 text-xs text-slate-500 hover:text-slate-800" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <><ChevronsLeft className="w-4 h-4" /> Collapse</>}
        </button>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className={cx('hidden lg:block fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-30 transition-[width]', collapsed ? 'w-16' : 'w-60')}><Sidebar /></aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40" onClick={() => setMobileOpen(false)}>
          <aside className="w-72 max-w-[85vw] h-full bg-white" onClick={(e) => e.stopPropagation()}><Sidebar mobile /></aside>
        </div>
      )}
      <div className={cx('transition-[padding]', collapsed ? 'lg:pl-16' : 'lg:pl-60')}>
        <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center gap-2 px-3 sm:px-5">
          <IconButton label="Open menu" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></IconButton>
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 flex-1 max-w-md rounded-lg bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 text-sm text-slate-500" aria-label="Search">
            <Search className="w-4 h-4" /> <span className="truncate">Search projects, tasks, clients…</span>
            <kbd className="ml-auto hidden sm:inline text-[10px] font-semibold bg-white rounded px-1.5 py-0.5 ring-1 ring-slate-200">Ctrl K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <div className="relative">
              <button onClick={() => setMenu(menu === 'create' ? null : 'create')} className="inline-flex items-center gap-1 rounded-lg bg-sindulis-navy text-white px-2.5 sm:px-3 py-1.5 text-sm font-semibold hover:bg-indigo-800" aria-haspopup="menu" data-testid="quick-create">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New</span>
              </button>
              {menu === 'create' && (
                <Menu_ onClose={() => setMenu(null)}>
                  <MenuItem disabled={!canTask} onClick={() => setCreate('task')}>Task</MenuItem>
                  <MenuItem disabled={!canCreateProject(me)} onClick={() => setCreate('project')}>Project</MenuItem>
                  <MenuItem disabled={!canManageClients(me)} onClick={() => setCreate('client')}>Client</MenuItem>
                </Menu_>
              )}
            </div>
            <Link to="/erp/notifications" className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label={`Notifications (${unread} unread)`} data-testid="bell">
              <Bell className="w-5 h-5" />
              {unread > 0 && <span className="absolute top-1 right-1 min-w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center px-1" data-testid="unread-count">{unread > 99 ? '99+' : unread}</span>}
            </Link>
            <div className="relative">
              <button onClick={() => setMenu(menu === 'profile' ? null : 'profile')} className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100" aria-haspopup="menu" aria-label="Profile menu">
                <Avatar name={me.name} />
                <span className="hidden md:block text-left leading-tight">
                  <span className="block text-xs font-semibold text-slate-800 max-w-32 truncate">{me.name}</span>
                  <span className="block text-[10px] text-slate-500">{ROLE_LABELS[me.role]}</span>
                </span>
              </button>
              {menu === 'profile' && (
                <Menu_ onClose={() => setMenu(null)}>
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold">{me.name}</p>
                    <p className="text-xs text-slate-500">{me.email}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ROLE_LABELS[me.role]}{me.departmentId ? ` · ${ws.dept(me.departmentId)?.name ?? ''}` : ''}</p>
                  </div>
                  <MenuItem onClick={() => navigate('/erp/profile')}>My profile</MenuItem>
                  <MenuItem onClick={() => navigate('/')}>Public website</MenuItem>
                  <MenuItem onClick={async () => { await signOutNow(); navigate('/erp/login'); }}><LogOut className="w-4 h-4" /> Sign out</MenuItem>
                </Menu_>
              )}
            </div>
          </div>
        </header>
        <main className="px-3 sm:px-5 lg:px-6 py-5 max-w-[1600px] mx-auto">
          {ws.errors.length > 0 && <div className="mb-4"><ErrorBanner message={`Some data could not be loaded: ${ws.errors[0]}`} /></div>}
          {ws.loading ? <Spinner label="Loading workspace…" /> : <Outlet />}
        </main>
      </div>

      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
      {create === 'task' && <TaskForm onClose={() => setCreate(null)} onCreated={(id) => setParams((p) => { const n = new URLSearchParams(p); n.set('task', id); return n; })} />}
      {create === 'project' && <ProjectForm onClose={() => setCreate(null)} onCreated={(id) => navigate(`/erp/projects/${id}`)} />}
      {create === 'client' && <ClientForm onClose={() => setCreate(null)} />}
      {taskId && (
        <Drawer
          onClose={closeTask}
          title={openTask ? (
            <div>
              <p className="text-[11px] font-mono text-slate-400">{openTask.code} · {ws.project(openTask.projectId)?.name}</p>
              <h2 className="text-base font-semibold text-slate-900 leading-snug" data-testid="drawer-title">{openTask.title}</h2>
            </div>
          ) : <span className="text-sm text-slate-500">Task</span>}
        >
          {openTask ? <TaskDrawerBody task={openTask} /> : ws.loading ? <Spinner /> : <p className="p-5 text-sm text-slate-500">This task does not exist or you don’t have access to it.</p>}
        </Drawer>
      )}
    </div>
  );
}

function Menu_({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    setTimeout(() => document.addEventListener('mousedown', h), 0);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [onClose]);
  return <div ref={ref} role="menu" onClick={onClose} className="absolute right-0 mt-1 w-56 rounded-lg bg-white shadow-lg ring-1 ring-slate-200 py-1 z-40">{children}</div>;
}
function MenuItem({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button role="menuitem" disabled={disabled} onClick={onClick} className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">{children}</button>;
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const ws = useWorkspace();
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const hit = (t: string) => t.toLowerCase().includes(s);
    type R = { key: string; kind: string; label: string; sub: string; extra?: ReactNode; go: () => void };
    const out: R[] = [];
    ws.projects.filter((p) => hit(`${p.code} ${p.name}`)).slice(0, 6).forEach((p) => out.push({ key: p.id, kind: 'Project', label: `${p.code} · ${p.name}`, sub: ws.client(p.clientId)?.name ?? '', go: () => navigate(`/erp/projects/${p.id}`) }));
    ws.tasks.filter((t) => hit(`${t.code} ${t.title}`)).slice(0, 8).forEach((t) => out.push({ key: t.id, kind: 'Task', label: `${t.code} · ${t.title}`, sub: ws.project(t.projectId)?.code ?? '', extra: <StatusBadge status={t.status} />, go: () => setParams((p) => { const n = new URLSearchParams(p); n.set('task', t.id); return n; }) }));
    ws.clients.filter((c) => hit(`${c.code} ${c.name} ${c.company}`)).slice(0, 4).forEach((c) => out.push({ key: c.id, kind: 'Client', label: `${c.code} · ${c.name}`, sub: c.company, go: () => navigate(`/erp/clients?client=${c.id}`) }));
    ws.employees.filter((e) => hit(`${e.name} ${e.email}`)).slice(0, 4).forEach((e) => out.push({ key: e.id, kind: 'Person', label: e.name, sub: e.email, go: () => navigate(`/erp/team?person=${e.id}`) }));
    return out;
  }, [q, ws, navigate, setParams]);
  const pick = (i: number) => { results[i]?.go(); onClose(); };
  return (
    <Modal title="Search" onClose={onClose}>
      <input
        autoFocus
        value={q}
        onChange={(e) => { setQ(e.target.value); setIdx(0); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(results.length - 1, i + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
          if (e.key === 'Enter') pick(idx);
        }}
        placeholder="Type a project, task code, client or person…"
        className="w-full rounded-lg ring-1 ring-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Search everything"
      />
      <ul className="mt-3 max-h-80 overflow-y-auto">
        {q && results.length === 0 && <li className="text-sm text-slate-500 py-4 text-center">No results</li>}
        {results.map((r, i) => (
          <li key={r.kind + r.key}>
            <button onMouseEnter={() => setIdx(i)} onClick={() => pick(i)} className={cx('w-full flex items-center gap-2 text-left rounded-lg px-2.5 py-2', i === idx ? 'bg-indigo-50' : 'hover:bg-slate-50')}>
              <Badge>{r.kind}</Badge>
              <span className="flex-1 min-w-0"><span className="block text-sm text-slate-800 truncate">{r.label}</span>{r.sub && <span className="block text-[11px] text-slate-400 truncate">{r.sub}</span>}</span>
              {r.extra}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1"><Building2 className="w-3 h-3" /> Results are limited to records you can access.</p>
    </Modal>
  );
}
