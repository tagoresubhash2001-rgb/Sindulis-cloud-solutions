import { AlertTriangle, Inbox, Loader2, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { cx, humanize, PRIORITY_STYLE, PROJECT_STATUS_STYLE, TASK_STATUS_LABEL, TASK_STATUS_STYLE } from '../lib/ui';
import type { Priority, ProjectStatus, TaskStatus } from '../types';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
const VARIANT: Record<Variant, string> = {
  primary: 'bg-sindulis-navy text-white hover:bg-indigo-800 focus-visible:ring-indigo-500',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-indigo-500',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-indigo-500',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
};

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md'; loading?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
        VARIANT[variant],
        className,
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" aria-label={label} title={label} {...rest} className={cx('p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer disabled:opacity-40', className)}>
      {children}
    </button>
  );
}

const pill = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap';
export const StatusBadge = ({ status }: { status: TaskStatus }) => <span className={cx(pill, TASK_STATUS_STYLE[status])}>{TASK_STATUS_LABEL[status]}</span>;
export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => <span className={cx(pill, PROJECT_STATUS_STYLE[status])}>{humanize(status)}</span>;
export const PriorityBadge = ({ priority }: { priority: Priority }) => <span className={cx(pill, PRIORITY_STYLE[priority])}>{humanize(priority)}</span>;
export const Badge = ({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'red' | 'amber' | 'green' | 'blue' | 'indigo' }) => {
  const tones = { slate: 'bg-slate-100 text-slate-700 ring-slate-200', red: 'bg-rose-50 text-rose-700 ring-rose-200', amber: 'bg-amber-50 text-amber-800 ring-amber-200', green: 'bg-emerald-50 text-emerald-700 ring-emerald-200', blue: 'bg-blue-50 text-blue-700 ring-blue-200', indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200' };
  return <span className={cx(pill, tones[tone])}>{children}</span>;
};

export function Card({ title, actions, children, className, padded = true }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={cx('bg-white rounded-xl ring-1 ring-slate-200 shadow-sm', className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
      )}
      <div className={padded ? 'p-4' : ''}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export const Spinner = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500" role="status">
    <Loader2 className="w-5 h-5 animate-spin" /> {label}
  </div>
);

export function EmptyState({ title, hint, action, icon }: { title: string; hint?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">{icon ?? <Inbox className="w-5 h-5" />}</div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {hint && <p className="text-sm text-slate-500 mt-1 max-w-sm">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg bg-rose-50 ring-1 ring-rose-200 px-3 py-2 text-sm text-rose-800">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{message}</span>
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cx('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className={cx('h-full rounded-full', v === 100 ? 'bg-emerald-500' : 'bg-indigo-500')} style={{ width: `${v}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-slate-500 w-8 text-right">{v}%</span>
    </div>
  );
}

const COLORS = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700'];
export function Avatar({ name, size = 'sm' }: { name: string; size?: 'xs' | 'sm' | 'md' }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('') || '?';
  const color = COLORS[Array.from(name).reduce((s, c) => s + c.charCodeAt(0), 0) % COLORS.length];
  const sz = size === 'xs' ? 'w-5 h-5 text-[9px]' : size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-xs';
  return <span title={name} className={cx('inline-flex items-center justify-center rounded-full font-bold shrink-0 ring-2 ring-white', sz, color)}>{initials}</span>;
}
export function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  return (
    <span className="inline-flex -space-x-1.5">
      {names.slice(0, max).map((n, i) => <Avatar key={i} name={n} size="xs" />)}
      {names.length > max && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-[9px] font-bold text-slate-600 ring-2 ring-white">+{names.length - max}</span>}
    </span>
  );
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
}

export function Modal({ title, onClose, children, footer, wide }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEscape(onClose);
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} className={cx('bg-white w-full rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col max-h-[92vh]', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}>
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <IconButton label="Close" onClick={onClose}><X className="w-4 h-4" /></IconButton>
        </header>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && <footer className="flex justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export function Drawer({ title, onClose, children, actions }: { title: ReactNode; onClose: () => void; children: ReactNode; actions?: ReactNode }) {
  useEscape(onClose);
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" className="bg-white w-full sm:max-w-2xl h-full shadow-2xl flex flex-col animate-[slideIn_.18s_ease-out]">
        <header className="flex items-start justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-100">
          <div className="min-w-0 flex-1">{title}</div>
          <div className="flex items-center gap-1">
            {actions}
            <IconButton label="Close" onClick={onClose}><X className="w-4 h-4" /></IconButton>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}

/** Confirm a destructive action. With `typeToConfirm`, the user must type that exact text. */
export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, typeToConfirm, onConfirm, onClose }: { title: string; message: ReactNode; confirmLabel?: string; danger?: boolean; typeToConfirm?: string; onConfirm: () => Promise<unknown> | void; onClose: () => void }) {
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const blocked = !!typeToConfirm && typed !== typeToConfirm;
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            disabled={blocked}
            loading={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
                onClose();
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-slate-600 space-y-3">
        <div>{message}</div>
        {typeToConfirm && (
          <Field label={<>Type <code className="font-mono font-bold text-rose-700">{typeToConfirm}</code> to confirm</>}>
            {(id) => <Input id={id} value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus />}
          </Field>
        )}
      </div>
    </Modal>
  );
}

export function Field({ label, error, hint, children, className }: { label: ReactNode; error?: string | null; hint?: ReactNode; children: (id: string) => ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {children(id)}
      {hint && !error && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

const control = 'w-full rounded-lg border-0 ring-1 ring-inset ring-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500';
export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(control, p.className)} />;
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea rows={3} {...p} className={cx(control, p.className)} />;
export const Select = ({ children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} className={cx(control, 'pr-8', p.className)}>{children}</select>
);

/** Searchable checkbox list for picking people / departments. */
export function MultiPicker({ options, value, onChange, placeholder = 'Search…', max }: { options: { id: string; label: string; hint?: string }[]; value: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number }) {
  const [q, setQ] = useState('');
  const shown = options.filter((o) => (o.label + ' ' + (o.hint ?? '')).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="rounded-lg ring-1 ring-inset ring-slate-300">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="w-full px-3 py-1.5 text-sm border-b border-slate-200 rounded-t-lg focus:outline-none" />
      <ul className="max-h-40 overflow-y-auto py-1">
        {shown.length === 0 && <li className="px-3 py-2 text-xs text-slate-400">No matches</li>}
        {shown.map((o) => {
          const on = value.includes(o.id);
          return (
            <li key={o.id}>
              <label className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" checked={on} disabled={!on && !!max && value.length >= max} onChange={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])} className="rounded border-slate-300 text-indigo-600" />
                <span className="flex-1 truncate">{o.label}</span>
                {o.hint && <span className="text-[11px] text-slate-400 truncate">{o.hint}</span>}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: NoInfer<T>; label: string; count?: number }[]; value: T; onChange: (v: NoInfer<T>) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} role="tablist" className="flex gap-1 overflow-x-auto border-b border-slate-200 -mx-1 px-1 scrollbar-none">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cx('px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px cursor-pointer', value === t.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800')}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 text-[10px] font-bold text-slate-600">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { id: NoInfer<T>; label: string; icon?: ReactNode }[]; value: T; onChange: (v: NoInfer<T>) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} aria-pressed={value === o.id} className={cx('inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer', value === o.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800')}>
          {o.icon}
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, tone = 'slate', icon, onClick }: { label: string; value: ReactNode; tone?: 'slate' | 'blue' | 'amber' | 'green' | 'red' | 'indigo'; icon?: ReactNode; onClick?: () => void }) {
  const tones = { slate: 'text-slate-600 bg-slate-100', blue: 'text-blue-700 bg-blue-50', amber: 'text-amber-700 bg-amber-50', green: 'text-emerald-700 bg-emerald-50', red: 'text-rose-700 bg-rose-50', indigo: 'text-indigo-700 bg-indigo-50' };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={cx('text-left bg-white rounded-xl ring-1 ring-slate-200 shadow-sm p-3.5 flex items-center gap-3 w-full', onClick && 'hover:ring-indigo-300 cursor-pointer')}>
      {icon && <span className={cx('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', tones[tone])}>{icon}</span>}
      <span className="min-w-0">
        <span className="block text-xl font-bold text-slate-900 leading-tight" data-testid={`stat-${label}`}>{value}</span>
        <span className="block text-[11px] font-medium text-slate-500 truncate">{label}</span>
      </span>
    </Tag>
  );
}

/** Responsive table: horizontal scroll on small screens. */
export function Table({ head, children, empty }: { head: ReactNode[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-200 bg-slate-50/60">
            {head.map((h, i) => <th key={i} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}
