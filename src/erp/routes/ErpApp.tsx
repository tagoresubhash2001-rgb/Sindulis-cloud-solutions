import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Spinner } from '../components/ui';
import { ErpAuthProvider, useErpAuth } from '../hooks/useAuth';
import { ToastProvider } from '../hooks/useToast';
import { useWorkspace, WorkspaceProvider } from '../hooks/useWorkspace';
import { ErpLayout } from '../layouts/ErpLayout';
import { canArchive, isAdmin } from '../lib/permissions';
import { ActivityPage } from '../pages/Activity';
import { AdminPage, ProfilePage } from '../pages/Admin';
import { ApprovalsPage } from '../pages/Approvals';
import { ArchivePage } from '../pages/Archive';
import { CalendarPage } from '../pages/Calendar';
import { ClientsPage } from '../pages/Clients';
import { DashboardPage } from '../pages/Dashboard';
import { DiscussionsPage, FilesPage } from '../pages/FilesDiscussions';
import { GateScreen, LoginPage } from '../pages/Login';
import { MilestonesPage } from '../pages/Milestones';
import { MyWorkspacePage } from '../pages/MyWorkspace';
import { NotificationsPage } from '../pages/Notifications';
import { ProjectsPage } from '../pages/Projects';
import { ProjectWorkspacePage } from '../pages/ProjectWorkspace';
import { ReportsPage } from '../pages/Reports';
import { TasksPage } from '../pages/Tasks';
import { TeamPage } from '../pages/Team';

function Guarded() {
  const { state } = useErpAuth();
  const location = useLocation();
  if (state.status === 'loading') return <div className="min-h-screen bg-slate-50"><Spinner label="Signing you in…" /></div>;
  if (state.status === 'signedOut') return <Navigate to="/erp/login" replace state={{ from: location.pathname + location.search }} />;
  if (state.status !== 'ready') return <GateScreen />;
  return (
    <WorkspaceProvider me={state.employee}>
      <ErpRoutes />
    </WorkspaceProvider>
  );
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const ws = useWorkspace();
  return isAdmin(ws.me) ? <>{children}</> : <Navigate to="/erp" replace />;
}

function ErpRoutes() {
  const ws = useWorkspace();
  return (
    <Routes>
      <Route element={<ErpLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="my" element={<MyWorkspacePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectWorkspacePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="milestones" element={<MilestonesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="discussions" element={<DiscussionsPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="archive" element={canArchive(ws.me, ws.me.departmentId) ? <ArchivePage /> : <Navigate to="/erp" replace />} />
        <Route path="admin" element={<AdminOnly><AdminPage /></AdminOnly>} />
        <Route path="admin/:section" element={<AdminOnly><AdminPage /></AdminOnly>} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/erp" replace />} />
      </Route>
    </Routes>
  );
}

export default function ErpApp() {
  return (
    <ErpAuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Guarded />} />
        </Routes>
      </ToastProvider>
    </ErpAuthProvider>
  );
}
