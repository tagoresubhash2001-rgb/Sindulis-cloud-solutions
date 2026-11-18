import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { firstIssue } from '../lib/schemas';

type Kind = 'success' | 'error';
interface ToastItem { id: number; msg: string; kind: Kind }
interface ToastApi {
  ok: (msg: string) => void;
  fail: (err: unknown) => void;
  /** Run an async action, toasting success or the error message. Returns true on success. */
  run: (action: () => Promise<unknown>, success?: string) => Promise<boolean>;
}

const Ctx = createContext<ToastApi | null>(null);

const friendly = (err: unknown) => {
  const msg = firstIssue(err);
  if (/permission|insufficient/i.test(msg)) return 'You do not have permission to do that.';
  return msg;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((msg: string, kind: Kind) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, msg, kind }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), kind === 'error' ? 7000 : 3500);
  }, []);
  const ok = useCallback((m: string) => push(m, 'success'), [push]);
  const fail = useCallback((e: unknown) => push(friendly(e), 'error'), [push]);
  const run = useCallback(
    async (action: () => Promise<unknown>, success?: string) => {
      try {
        await action();
        if (success) ok(success);
        return true;
      } catch (e) {
        console.error(e);
        fail(e);
        return false;
      }
    },
    [ok, fail],
  );
  return (
    <Ctx.Provider value={{ ok, fail, run }}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[70] flex flex-col gap-2 items-end pointer-events-none" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto max-w-sm w-full sm:w-auto flex items-start gap-2 rounded-lg px-4 py-3 text-sm shadow-lg ring-1 ${
              t.kind === 'error' ? 'bg-rose-50 text-rose-800 ring-rose-200' : 'bg-white text-slate-800 ring-slate-200'
            }`}
          >
            {t.kind === 'error' ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />}
            <span className="flex-1">{t.msg}</span>
            <button aria-label="Dismiss" onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast outside ToastProvider');
  return v;
}
