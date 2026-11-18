/**
 * Demo data for local development — EMULATOR ONLY. Refuses to run against production.
 *
 *   npm run emulators            # terminal 1
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed:demo
 *   npm run dev:emulators        # terminal 2 → http://localhost:3000/erp  (password for all: Demo@12345)
 */
import { seedDemo } from './lib/demo';

if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  console.error('Refusing to seed: FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST must point at the local emulators.');
  process.exit(1);
}
seedDemo(process.env.GCLOUD_PROJECT ?? 'demo-sindulis')
  .then((users) => {
    console.log('Demo data seeded. Logins (password Demo@12345):');
    for (const u of users) console.log(`  ${u.role.padEnd(16)} ${u.email}`);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
