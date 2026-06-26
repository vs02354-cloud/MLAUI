import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mlaportal.app',
  appName: 'MLA Survey',
  webDir: 'dist/mla-portal/browser',
  server: {
    cleartext: true
  }
};

export default config;
