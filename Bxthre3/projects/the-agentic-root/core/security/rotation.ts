import { existsSync, readFileSync, writeFileSync } from 'fs';

interface SecretConfig {
  name: string;
  value: string;
  createdAt: string;
  expiresAt: string;
  lastRotated: string;
  rotationDays: number;
}

const SECRETS_FILE = '/home/.z/agentic/secrets.json';

export class SecretRotation {
  private secrets: Map<string, SecretConfig> = new Map();

  constructor() {
    this.load();
  }

  private load(): void {
    if (!existsSync(SECRETS_FILE)) return;
    try {
      const data = JSON.parse(readFileSync(SECRETS_FILE, 'utf-8'));
      for (const [name, config] of Object.entries(data)) {
        this.secrets.set(name, config as SecretConfig);
      }
    } catch {}
  }

  private save(): void {
    const obj: Record<string, SecretConfig> = {};
    for (const [name, config] of this.secrets) {
      obj[name] = config;
    }
    writeFileSync(SECRETS_FILE, JSON.stringify(obj, null, 2));
  }

  add(name: string, value: string, rotationDays = 90): void {
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + rotationDays * 24 * 60 * 60 * 1000).toISOString();
    
    this.secrets.set(name, {
      name,
      value,
      createdAt: now,
      expiresAt,
      lastRotated: now,
      rotationDays
    });
    
    this.save();
    console.log(`[SECURITY] Secret '${name}' added. Expires: ${expiresAt.split('T')[0]}`);
  }

  get(name: string): string | undefined {
    const secret = this.secrets.get(name);
    if (!secret) return undefined;
    
    // Check if expired
    if (new Date() > new Date(secret.expiresAt)) {
      console.warn(`[SECURITY] Secret '${name}' EXPIRED - immediate rotation required!`);
      return undefined;
    }
    
    // Warn if expiring soon (7 days)
    const daysUntilExpiry = Math.floor((new Date(secret.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    if (daysUntilExpiry <= 7) {
      console.warn(`[SECURITY] Secret '${name}' expires in ${daysUntilExpiry} days - schedule rotation`);
    }
    
    return secret.value;
  }

  rotate(name: string, newValue: string): boolean {
    const existing = this.secrets.get(name);
    if (!existing) return false;
    
    this.add(name, newValue, existing.rotationDays);
    console.log(`[SECURITY] Secret '${name}' rotated successfully`);
    return true;
  }

  autoRotate(): string[] {
    const rotated: string[] = [];
    const now = Date.now();
    
    for (const [name, config] of this.secrets) {
      const daysSinceRotation = Math.floor((now - new Date(config.lastRotated).getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysSinceRotation >= config.rotationDays) {
        console.log(`[SECURITY] Auto-rotating secret '${name}' (${daysSinceRotation} days old)`);
        rotated.push(name);
        // In production, this would call cloud provider API to generate new key
      }
    }
    
    return rotated;
  }

  getExpiringSoon(days = 7): string[] {
    const soon: string[] = [];
    const cutoff = Date.now() + days * 24 * 60 * 60 * 1000;
    
    for (const [name, config] of this.secrets) {
      if (new Date(config.expiresAt).getTime() <= cutoff) {
        soon.push(name);
      }
    }
    
    return soon;
  }
}

export const secretRotation = new SecretRotation();
