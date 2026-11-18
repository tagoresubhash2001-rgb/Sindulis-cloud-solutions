import { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { TRANSITIONS, type TransitionKind } from '../lib/workflow';
import { performTransition } from '../services/workflow';
import type { Decision, ProjectFile, Task } from '../types';
import { Button, Field, Modal, Select, Textarea } from './ui';

/** Collects whatever a transition needs (note, feedback, reason) and runs it. */
export function TransitionDialog({ task, kind, files = [], onClose }: { task: Task; kind: TransitionKind; files?: ProjectFile[]; onClose: () => void }) {
  const ws = useWorkspace();
  const toast = useToast();
  const [text, setText] = useState('');
  const [decision, setDecision] = useState<Decision>('CHANGES_REQUESTED');
  const [fileRefs, setFileRefs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const def = TRANSITIONS.find((t) => t.kind === kind)!;
  const project = ws.project(task.projectId) ?? null;
  const taskFiles = files.filter((f) => f.taskId === task.id && !f.isArchived);
  const needsText = kind === 'REJECT' || kind === 'CANCEL';
  const label = kind === 'SUBMIT' ? 'Submission note' : kind === 'CANCEL' ? 'Reason for cancelling *' : kind === 'REJECT' ? 'Feedback for the assignee *' : 'Comment (optional)';

  const go = async () => {
    setBusy(true);
    const milestone = task.milestoneId ? ws.milestone(task.milestoneId) : undefined;
    const ok = await toast.run(
      () =>
        performTransition(
          { actor: ws.me, task, project, milestoneTasks: milestone ? ws.tasks.filter((t) => t.milestoneId === milestone.id) : undefined, milestoneTitle: milestone?.title },
          kind,
          { note: text, comment: text, reason: text, decision: kind === 'REJECT' ? decision : 'APPROVED', fileRefs },
        ),
      `${task.code}: ${def.label.toLowerCase()} done`,
    );
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Modal
      title={`${def.label} · ${task.code}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Back</Button>
          <Button variant={kind === 'CANCEL' || kind === 'REJECT' ? 'danger' : kind === 'APPROVE' ? 'success' : 'primary'} loading={busy} disabled={needsText && !text.trim()} onClick={go} data-testid="transition-confirm">
            {def.label}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-slate-600">{task.title}</p>
        {kind === 'REJECT' && (
          <Field label="Decision">{(id) => <Select id={id} value={decision} onChange={(e) => setDecision(e.target.value as Decision)}><option value="CHANGES_REQUESTED">Request changes</option><option value="REJECTED">Reject</option></Select>}</Field>
        )}
        <Field label={label}>{(id) => <Textarea id={id} rows={4} value={text} onChange={(e) => setText(e.target.value)} autoFocus data-testid="transition-text" />}</Field>
        {kind === 'SUBMIT' && taskFiles.length > 0 && (
          <Field label="Attach deliverables">
            {() => (
              <div className="space-y-1">
                {taskFiles.map((f) => (
                  <label key={f.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={fileRefs.includes(f.id)} onChange={() => setFileRefs((s) => (s.includes(f.id) ? s.filter((x) => x !== f.id) : [...s, f.id]))} className="rounded border-slate-300" />
                    {f.name} <span className="text-xs text-slate-400">v{f.version}</span>
                  </label>
                ))}
              </div>
            )}
          </Field>
        )}
        {kind === 'SUBMIT' && <p className="text-xs text-slate-500">Reviewer: <b>{ws.empName(task.reviewerId)}</b> will be notified.</p>}
      </div>
    </Modal>
  );
}
