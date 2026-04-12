import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vpc.valleyplayers',
  appName: 'Valley Players Club',
  webDir: 'dist',
  server: {
    url: "https://vpc-brodiblanco.zocomputer.io",
    hostname: "vpc-brodiblanco.zocomputer.io"
  }
};

export default config;
