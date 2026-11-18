import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { makeEnv, seed, type UserKey } from './setup';

let env: RulesTestEnvironment;
type StorageLike = { ref(path: string): { put(data: Uint8Array, meta?: object): Promise<unknown>; getDownloadURL(): Promise<string>; delete(): Promise<unknown> } };
const st = (u: UserKey) => env.authenticatedContext(u).storage() as unknown as StorageLike;
const path = (pid: string) => `projects/${pid}/files/f1/report.pdf`;
const bytes = new Uint8Array([1, 2, 3]);
const meta = (u: string) => ({ contentType: 'application/pdf', customMetadata: { uploadedBy: u } });

beforeAll(async () => { env = await makeEnv(); });
afterAll(async () => { await env.cleanup(); });
beforeEach(async () => { await seed(env); await env.clearStorage(); });

describe('storage rules', () => {
  it('project members upload and read', async () => {
    await assertSucceeds(st('emp').ref(path('p1')).put(bytes, meta('emp')));
    await assertSucceeds(st('emp2').ref(path('p1')).getDownloadURL());
  });
  it('outsiders, viewers and spoofed uploaders are denied', async () => {
    await assertFails(st('outsider').ref(path('p1')).put(bytes, meta('outsider')));
    await assertFails(st('viewer').ref(path('p1')).put(bytes, meta('viewer')));
    await assertFails(st('emp').ref(path('p1')).put(bytes, meta('pm')));
    await assertFails(st('emp').ref(path('p2')).put(bytes, meta('emp')));
  });
  it('rejects files over 25 MB', async () => {
    await assertFails(st('emp').ref(path('p1')).put(new Uint8Array(25 * 1024 * 1024 + 1), meta('emp')));
  });
  it('non-members cannot read; only Super Admin deletes', async () => {
    await env.withSecurityRulesDisabled(async (c) => { await (c.storage() as unknown as StorageLike).ref(path('p1')).put(bytes, meta('emp')); });
    await assertFails(st('outsider').ref(path('p1')).getDownloadURL());
    await assertFails(st('admin').ref(path('p1')).delete());
    await assertSucceeds(st('super').ref(path('p1')).delete());
  });
  it('anything outside project paths is denied', async () => {
    await assertFails(st('super').ref('public/x.txt').put(bytes, meta('super')));
  });
});
