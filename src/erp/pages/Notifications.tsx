import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, EmptyState, PageHeader, Segmented } from '../components/ui';
import { useToast } from '../hooks/useToast';
import { useWorkspace } from '../hooks/useWorkspace';
import { fmtAgo } from '../lib/dates';
import { cx } from '../lib/ui';
import { markRead } from '../services/notifications';

const TYPE_LABEL: Record<string, string> = {
  TASK_ASSIGNED: 'Assigned', TASK_REASSIGNED: 'Updated', DEADLINE_APPROACHING: 'Due soon', TASK_OVERDUE: 'Overdue', TASK_SUBMITTED: 'Submitted', APPROVAL_PENDING: 'Approval pending',
  TASK_APPROVED: 'Approved', TASK_REJECTED: 'Changes requested', MILESTONE_COMPLETED: 'Milestone', PROJECT_DEADLINE: 'Project deadline', COMMENT: 'Comment', MENTION: 'Mention',
};
const TYPE_TONE: Record<string, string> = { TASK_OVERDUE: 'bg-rose-100 text-rose-700', TASK_REJECTED: 'bg-rose-100 text-rose-700', TASK_APPROVED: 'bg-emerald-100 text-emerald-700', MILESTONE_COMPLETED: 'bg-emerald-100 text-emerald-700', APPROVAL_PENDING: 'bg-amber-100 text-amber-800', DEADLINE_APPROACHING: 'bg-amber-100 text-amber-800', MENTION: 'bg-indigo-100 text-indigo-700' };

export function NotificationsPage() {
  const ws = useWorkspace();
  const toast = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const unread = ws.notifications.filter((n) => !n.read);
  const list = filter === 'unread' ? unread : ws.notifications;
  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" subtitle="Updates in real time" actions={
        <>
          <Segmented value={filter} onChange={setFilter} options={[{ id: 'unread', label: `Unread (${unread.length})` }, { id: 'all', label: 'All' }]} />
          <Button variant="secondary" disabled={!unread.length} onClick={() => toast.run(() => markRead(unread.map((n) => n.id)), 'All caught up')}>Mark all read</Button>
        </>
      } />
      <Card padded={false}>
        {list.length === 0 ? <EmptyState title={filter === 'unread' ? 'You’re all caught up' : 'No notifications yet'} icon={<Bell className="w-5 h-5" />} /> : (
          <ul className="divide-y divide-slate-100">
            {list.slice(0, 200).map((n) => (
              <li key={n.id}>
                <button onClick={async () => { if (!n.read) await markRead([n.id]).catch(() => undefined); navigate(n.link); }} className={cx('w-full text-left px-4 py-3 flex gap-3 hover:bg-slate-50', !n.read && 'bg-indigo-50/40')} data-testid="notification-item">
                  <span className={cx('mt-1.5 w-2 h-2 rounded-full shrink-0', n.read ? 'bg-transparent' : 'bg-indigo-600')} />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2"><span className={cx('rounded px-1.5 py-0.5 text-[10px] font-bold', TYPE_TONE[n.type] ?? 'bg-slate-100 text-slate-600')}>{TYPE_LABEL[n.type] ?? n.type}</span><span className="text-sm font-medium text-slate-800 truncate">{n.title}</span></span>
                    {n.body && <span className="block text-sm text-slate-600 mt-0.5 line-clamp-2">{n.body}</span>}
                    <span className="block text-[11px] text-slate-400 mt-0.5">{fmtAgo(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
