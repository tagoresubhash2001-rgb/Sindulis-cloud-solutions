import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useOpenTask } from '../components/TaskViews';
import { TransitionDialog } from '../components/TransitionDialog';
import { Badge, Button, Card, EmptyState, PageHeader, PriorityBadge, Tabs } from '../components/ui';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtAgo, fmtDate } from '../lib/dates';
import { canReviewTask } from '../lib/permissions';
import type { Task } from '../types';

export function ApprovalsPage() {
  const ws = useWorkspace();
  const open = useOpenTask();
  const [tab, setTab] = useState<'queue' | 'all' | 'history'>('queue');
  const [dialog, setDialog] = useState<{ task: Task; kind: 'APPROVE' | 'REJECT' } | null>(null);
  const pending = ws.approvals.filter((a) => a.decision === null && !a.isArchived);
  // Queue: requests addressed to me, plus anything a project I manage is waiting on.
  const mine = pending.filter((a) => { const t = ws.task(a.entityId); return !!t && t.status === 'WAITING_APPROVAL' && canReviewTask(ws.me, t, ws.project(t.projectId) ?? null); });
  const history = ws.approvals.filter((a) => a.decision !== null).sort((a, b) => (b.decidedAt?.toMillis() ?? 0) - (a.decidedAt?.toMillis() ?? 0));
  const list = tab === 'queue' ? mine : tab === 'all' ? pending : history;
  return (
    <div className="space-y-4">
      <PageHeader title="Approvals & Reviews" subtitle="Approve, reject or request changes on submitted work" />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'queue', label: 'My review queue', count: mine.length }, { id: 'all', label: 'All pending', count: pending.length }, { id: 'history', label: 'History', count: history.length }]} />
      <Card padded={false}>
        {list.length === 0 ? <EmptyState title={tab === 'queue' ? 'Nothing waiting for your review' : 'No approvals here'} /> : (
          <ul className="divide-y divide-slate-100">
            {list.map((a) => {
              const t = ws.task(a.entityId);
              const can = t && a.decision === null && t.status === 'WAITING_APPROVAL' && canReviewTask(ws.me, t, ws.project(t.projectId) ?? null);
              return (
                <li key={a.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center gap-2" data-testid={`approval-${t?.code ?? a.id}`}>
                  <button onClick={() => t && open(t.id)} className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-slate-800 truncate">{t ? <><span className="font-mono text-[11px] text-slate-400 mr-1.5">{t.code}</span>{t.title}</> : 'Task unavailable'}</p>
                    <p className="text-[11px] text-slate-500">
                      {ws.project(a.projectId)?.code} · submitted by {ws.empName(a.requestedBy)} {fmtAgo(a.createdAt)} · reviewer {ws.empName(a.reviewerId)}
                      {t?.dueDate && ` · due ${fmtDate(t.dueDate, 'dd MMM')}`}{t && t.revisionCount > 0 && ` · revision ${t.revisionCount}`}
                    </p>
                    {a.decision && <p className="text-xs mt-1 text-slate-600"><b>{a.decision.replace('_', ' ').toLowerCase()}</b> by {ws.empName(a.decidedBy)} {fmtAgo(a.decidedAt)}{a.comment && `: “${a.comment}”`}</p>}
                  </button>
                  <div className="flex items-center gap-2">
                    {t && <PriorityBadge priority={t.priority} />}
                    {a.decision ? <Badge tone={a.decision === 'APPROVED' ? 'green' : 'red'}>{a.decision.replace('_', ' ').toLowerCase()}</Badge> : <Badge tone="amber">pending</Badge>}
                    {can && (
                      <>
                        <Button size="sm" variant="success" onClick={() => setDialog({ task: t, kind: 'APPROVE' })} data-testid="approve-btn"><Check className="w-3.5 h-3.5" /> Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => setDialog({ task: t, kind: 'REJECT' })} data-testid="reject-btn"><X className="w-3.5 h-3.5" /> Reject</Button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      {dialog && <TransitionDialog task={dialog.task} kind={dialog.kind} onClose={() => setDialog(null)} />}
    </div>
  );
}
