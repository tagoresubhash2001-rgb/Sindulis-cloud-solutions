import { defineConfig } from 'vitest/config';

// Run inside the emulator: npm run test:rules
export default defineConfig({
  test: {
    include: ['tests/rules/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 60000,
    fileParallelism: false,
  },
});
