// Generator Core: Build custom apps from config
// Build-A-Biz / Bxthre3 Inc

import { AppConfig } from "../_shared/schema";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface BuildOptions {
  configPath: string;
  outputDir: string;
  template: string;
}

export async function generateApp(config: AppConfig, options: BuildOptions): Promise<void> {
  const { slug, template } = config.meta;
  const outputPath = resolve(options.outputDir, slug);
  
  console.log(`Building ${config.meta.businessName}...`);
  console.log(`Template: ${template}`);
  console.log(`Output: ${outputPath}`);
  
  // 1. Create output directory
  await mkdir(outputPath, { recursive: true });
  
  // 2. Copy template source
  const templatePath = resolve(import.meta.dirname, `../${template}/src`);
  await cp(templatePath, resolve(outputPath, "src"), { recursive: true });
  
  // 3. Inject brand assets
  await injectAssets(config, outputPath);
  
  // 4. Generate runtime config
  await writeFile(
    resolve(outputPath, "src/config.json"),
    JSON.stringify(config, null, 2)
  );
  
  // 5. Generate TypeScript interfaces
  await writeFile(
    resolve(outputPath, "src/types.ts"),
    generateTypesScript(config)
  );
  
  // 6. Generate entry component
  await writeFile(
    resolve(outputPath, "src/App.tsx"),
    generateAppComponent(config)
  );
  
  // 7. Generate package.json
  await writeFile(
    resolve(outputPath, "package.json"),
    generatePackageJson(config)
  );
  
  // 8. Generate capacitor config for mobile
  await writeFile(
    resolve(outputPath, "capacitor.config.ts"),
    generateCapacitorConfig(config)
  );
  
  console.log(`Generated at: ${outputPath}`);
}

function generatePackageJson(config: AppConfig): string {
  return JSON.stringify({
    name: config.meta.slug,
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview",
      sync: "cap sync",
      ios: "cap open ios",
      android: "cap open android",
    },
    dependencies: {
      "react": "^18",
      "react-dom": "^18",
      "@capacitor/core": "^6",
      "@capacitor/ios": "^6",
      "@capacitor/android": "^6",
      "@stripe/stripe-js": "^3",
      "@stripe/react-stripe-js": "^2",
    },
    devDependencies: {
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "@vitejs/plugin-react": "^4",
      "typescript": "^5",
      "vite": "^5",
      "tailwindcss": "^3",
    },
  }, null, 2);
}

function generateCapacitorConfig(config: AppConfig): string {
  return `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bxthre3.${config.meta.slug}',
  appName: '${config.meta.businessName}',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
    },
  },
};

export default config;
`;
}

async function injectAssets(config: AppConfig, outputPath: string): Promise<void> {
  // Assets copied from user config
  await mkdir(resolve(outputPath, "public"), { recursive: true });
}

function generateTypesScript(config: AppConfig): string {
  return `// Generated types for ${config.meta.businessName}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface LoyaltyUser {
  points: number;
  tier: string;
  lifetimePoints: number;
}

export interface GiftCard {
  code: string;
  balance: number;
  expiry: string | null;
}
`;
}

function generateAppComponent(config: AppConfig): string {
  return `import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MenuScreen } from './screens/MenuScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { LoyaltyScreen } from './screens/LoyaltyScreen';
import { GiftCardsScreen } from './screens/GiftCardsScreen';
import { TabBar } from './components/TabBar';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'loyalty' | 'gifts'>('menu');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white">
        {activeTab === 'menu' && <MenuScreen />}
        {activeTab === 'cart' && <CartScreen />}
        {activeTab === 'loyalty' && <LoyaltyScreen />}
        {activeTab === 'gifts' && <GiftCardsScreen />}
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
`;
}
