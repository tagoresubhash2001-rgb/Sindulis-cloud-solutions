import { Download, FileText, Pencil, Send, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useLive } from '../hooks/useLive';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtAgo, fmtDateTime } from '../lib/dates';
import { canWrite, isAssignee } from '../lib/permissions';
import { addComment, editComment, subscribeComments } from '../services/comments';
import { fileUrl, formatBytes, uploadProjectFile } from '../services/files';
import type { ActivityLog, Comment, Project, ProjectFile, Task } from '../types';
import { Avatar, Button, EmptyState, ErrorBanner, Spinner, Textarea } from './ui';

export function CommentThread({ project, task }: { project: Project; task: Task | null }) {
  const ws = useWorkspace();
  const toast = useToast();
  const live = useLive<Comment[]>((d, e) => subscribeComments(project.id, task?.id ?? null, d, e), [project.id, task?.id], []);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ id: string; body: string } | null>(null);
  const canPost = canWrite(ws.me) && !project.isArchived && (project.memberIds.includes(ws.me.id) || (task ? isAssignee(ws.me, task) : false) || ws.me.role === 'ADMIN' || ws.me.role === 'SUPER_ADMIN' || (ws.me.role === 'DEPARTMENT_HEAD' && ws.me.departmentId === project.departmentId));
  const mentionables = ws.employees.filter((e) => project.memberIds.includes(e.id));
  const post = async () => {
    setBusy(true);
    if (await toast.run(() => addComment(ws.me, project, task, body, ws.employees))) setBody('');
    setBusy(false);
  };
  return (
    <div className="space-y-3">
      {live.error && <ErrorBanner message={live.error} />}
      {live.loading ? (
        <Spinner />
      ) : live.data.length === 0 ? (
        <EmptyState title="No comments yet" hint="Start the discussion. Use @name to mention someone." />
      ) : (
        <ul className="space-y-3">
          {live.data.map((c) => (
            <li key={c.id} className="flex gap-2.5">
              <Avatar name={ws.empName(c.authorId)} />
              <div className="flex-1 min-w-0 rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs">
                  <b className="text-slate-800">{ws.empName(c.authorId)}</b>
                  <span className="text-slate-400" title={fmtDateTime(c.createdAt)}>{fmtAgo(c.createdAt)}</span>
                  {c.editedAt && <span className="text-slate-400">(edited)</span>}
                  {c.authorId === ws.me.id && !editing && (
                    <button onClick={() => setEditing({ id: c.id, body: c.body })} className="ml-auto text-slate-400 hover:text-slate-700" aria-label="Edit comment"><Pencil className="w-3.5 h-3.5" /></button>
                  )}
                </div>
                {editing?.id === c.id ? (
                  <div className="mt-1 space-y-1.5">
                    <Textarea value={editing.body} onChange={(e) => setEditing({ id: c.id, body: e.target.value })} />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                      <Button size="sm" onClick={async () => (await toast.run(() => editComment(ws.me, c, editing.body))) && setEditing(null)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words mt-0.5">{highlight(c.body)}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {canPost && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a comment… @mention teammates" data-testid="comment-input"
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && body.trim()) void post(); }} />
            {mentionables.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {mentionables.slice(0, 8).map((m) => (
                  <button key={m.id} type="button" onClick={() => setBody((b) => `${b}${b && !b.endsWith(' ') ? ' ' : ''}@${m.email.split('@')[0]} `)} className="text-[11px] text-indigo-600 hover:underline">@{m.email.split('@')[0]}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={post} loading={busy} disabled={!body.trim()} aria-label="Post comment"><Send className="w-4 h-4" /></Button>
        </div>
      )}
    </div>
  );
}

function highlight(body: string) {
  return body.split(/(@[\w.-]+)/g).map((part, i) => (part.startsWith('@') ? <b key={i} className="text-indigo-700 font-semibold">{part}</b> : part));
}

export function FileList({ files, empty }: { files: ProjectFile[]; empty?: string }) {
  const ws = useWorkspace();
  const toast = useToast();
  if (files.length === 0) return <EmptyState title={empty ?? 'No files yet'} icon={<FileText className="w-5 h-5" />} />;
  return (
    <ul className="divide-y divide-slate-100">
      {files.map((f) => (
        <li key={f.id} className="flex items-center gap-3 py-2">
          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{f.name} <span className="text-xs font-normal text-slate-400">v{f.version}</span></p>
            <p className="text-[11px] text-slate-500">{formatBytes(f.size)} · {ws.empName(f.uploadedBy)} · {fmtAgo(f.createdAt)}{f.taskId ? ` · ${ws.task(f.taskId)?.code ?? 'task'}` : ''}</p>
          </div>
          <Button size="sm" variant="ghost" aria-label={`Download ${f.name}`} onClick={() => toast.run(async () => window.open(await fileUrl(f), '_blank', 'noopener'))}>
            <Download className="w-4 h-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function UploadButton({ project, task, existing }: { project: Project; task: Task | null; existing: ProjectFile[] }) {
  const ws = useWorkspace();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  return (
    <>
      <input ref={input} type="file" className="hidden" data-testid="file-input" onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setPct(0);
        await toast.run(() => uploadProjectFile(ws.me, project, task, file, existing, setPct), `Uploaded ${file.name}`);
        setPct(null);
      }} />
      <Button size="sm" variant="secondary" onClick={() => input.current?.click()} loading={pct !== null}>
        <Upload className="w-4 h-4" /> {pct !== null ? `${pct}%` : 'Upload'}
      </Button>
    </>
  );
}

const ACTION_TONE: Record<string, string> = { approved: 'text-emerald-700', rejected: 'text-rose-700', changes_requested: 'text-amber-700', cancelled: 'text-rose-700', archived: 'text-slate-500', restored: 'text-indigo-700' };

export function ActivityList({ logs, showEntity }: { logs: ActivityLog[]; showEntity?: boolean }) {
  const ws = useWorkspace();
  if (logs.length === 0) return <EmptyState title="No activity yet" />;
  return (
    <ol className="relative border-l border-slate-200 ml-2 space-y-3">
      {logs.map((l) => (
        <li key={l.id} className="ml-4">
          <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-white ring-2 ring-slate-300" />
          <p className="text-sm text-slate-700">
            <span className={`font-semibold ${ACTION_TONE[l.action] ?? 'text-slate-800'}`}>{l.summary}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            {ws.empName(l.actorId)} · <span title={fmtDateTime(l.at)}>{fmtAgo(l.at)}</span>
            {showEntity && l.projectId && ws.project(l.projectId) ? ` · ${ws.project(l.projectId)!.code}` : ''}
          </p>
          {l.after && Object.keys(l.after).length > 0 && l.action !== 'created' && (
            <p className="text-[11px] text-slate-500 mt-0.5 break-words">
              {Object.entries(l.after).slice(0, 4).map(([k, v]) => `${k}: ${fmtVal(l.before?.[k])} → ${fmtVal(v)}`).join(' · ')}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
const fmtVal = (v: unknown) => (v === null || v === undefined ? '∅' : Array.isArray(v) ? `[${v.length}]` : String(v).slice(0, 40));
