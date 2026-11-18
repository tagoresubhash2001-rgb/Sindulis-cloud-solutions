import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CommentThread, FileList, UploadButton } from '../components/Collab';
import { Card, EmptyState, ErrorBanner, Input, PageHeader, Select, Spinner } from '../components/ui';
import { useLive } from '../hooks/useLive';
import { useWorkspace } from '../hooks/useWorkspace';
import { canWrite } from '../lib/permissions';
import { subscribeProjectFiles } from '../services/files';
import type { ProjectFile } from '../types';

function useProjectPicker() {
  const ws = useWorkspace();
  const projects = ws.projects.filter((p) => !p.isArchived);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const picker = (
    <Select aria-label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-72">
      {projects.length === 0 && <option value="">No projects</option>}
      {projects.map((p) => <option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}
    </Select>
  );
  return { project: ws.project(projectId), picker };
}

export function FilesPage() {
  const ws = useWorkspace();
  const { project, picker } = useProjectPicker();
  const [q, setQ] = useState('');
  const files = useLive<ProjectFile[]>(project ? (d, e) => subscribeProjectFiles(project.id, d, e) : null, [project?.id], []);
  const rows = files.data.filter((f) => !f.isArchived && f.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <PageHeader title="Files & Documents" subtitle="Stored in Firebase Storage. Access follows project membership; re-uploading the same name creates a new version." actions={picker} />
      {!project ? <Card><EmptyState title="No project selected" /></Card> : (
        <Card title={<Link to={`/erp/projects/${project.id}?tab=files`} className="hover:text-indigo-700">{project.code} · {project.name}</Link>} actions={canWrite(ws.me) && project.memberIds.includes(ws.me.id) && <UploadButton project={project} task={null} existing={files.data} />}>
          <Input placeholder="Filter by name…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs mb-3" />
          {files.error && <ErrorBanner message={files.error} />}
          {files.loading ? <Spinner /> : <FileList files={rows} />}
        </Card>
      )}
    </div>
  );
}

export function DiscussionsPage() {
  const { project, picker } = useProjectPicker();
  return (
    <div className="space-y-4">
      <PageHeader title="Discussions" subtitle="Project-level threads. Task threads live in each task’s Comments tab." actions={picker} />
      {project ? <Card title={`${project.code} · ${project.name}`}><CommentThread project={project} task={null} /></Card> : <Card><EmptyState title="No project selected" /></Card>}
    </div>
  );
}
