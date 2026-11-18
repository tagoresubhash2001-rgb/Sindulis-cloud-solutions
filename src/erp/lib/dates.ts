import { format, formatDistanceToNow } from 'date-fns';
import type { DateLike } from '../types';

export function toMillis(d: DateLike): number | null {
  if (!d) return null;
  if (d instanceof Date) return d.getTime();
  return d.toMillis();
}

export function toDate(d: DateLike): Date | null {
  const ms = toMillis(d);
  return ms === null ? null : new Date(ms);
}

export function fmtDate(d: DateLike, pattern = 'dd MMM yyyy'): string {
  const date = toDate(d);
  return date ? format(date, pattern) : '—';
}

export function fmtDateTime(d: DateLike): string {
  return fmtDate(d, 'dd MMM yyyy, HH:mm');
}

export function fmtAgo(d: DateLike): string {
  const date = toDate(d);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : 'just now';
}

/** yyyy-MM-dd string for <input type="date">. */
export function toInputDate(d: DateLike): string {
  const date = toDate(d);
  return date ? format(date, 'yyyy-MM-dd') : '';
}

/** Parse <input type="date"> value as local end-of-day for due dates. */
export function fromInputDate(value: string, endOfDay = false): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return endOfDay ? new Date(y, m - 1, d, 23, 59, 59) : new Date(y, m - 1, d, 0, 0, 0);
}
