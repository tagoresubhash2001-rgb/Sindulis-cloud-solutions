/**
 * Create / promote the first SUPER_ADMIN and seed default departments + settings.
 *
 *   SUPER_ADMIN_EMAIL=you@company.com npm run bootstrap:super-admin
 *   npm run bootstrap:super-admin -- you@company.com "Your Name"
 *
 * Production: needs Application Default Credentials for project `sindulis`
 * (GOOGLE_APPLICATION_CREDENTIALS=./service-account.json — never commit it).
 * Emulator: set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 and FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099.
 */
import { bootstrapSuperAdmin, usingEmulator } from './lib/bootstrap';

const email = process.argv[2] ?? process.env.SUPER_ADMIN_EMAIL;
const name = process.argv[3] ?? process.env.SUPER_ADMIN_NAME;
const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT ?? 'sindulis';

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: SUPER_ADMIN_EMAIL=you@company.com npm run bootstrap:super-admin   (or pass the email as the first argument)');
  process.exit(1);
}

console.log(`Bootstrapping Super Admin ${email} in project "${projectId}"${usingEmulator() ? ' (EMULATOR)' : ''}…`);
bootstrapSuperAdmin(projectId, email, name)
  .then((r) => {
    console.log(`✔ employees/${r.uid} is SUPER_ADMIN${r.created ? ' (new Auth user created)' : ''}`);
    console.log(`✔ ${r.departmentsCreated} department(s) created`);
    if (r.resetLink) console.log(`\nSet the password with this one-time link:\n${r.resetLink}\n`);
    else if (!r.created) console.log('Existing login kept — sign in with your current password or Google.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('✖ Bootstrap failed:', e instanceof Error ? e.message : e);
    process.exit(1);
  });
