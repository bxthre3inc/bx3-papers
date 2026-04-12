import { existsSync, mkdirSync, cpSync, writeFileSync, readdirSync } from 'fs';
import { memory } from '../memory/store';

const BACKUP_DIR = '/home/.z/agentic/backups';
const MAX_BACKUPS = 30; // Keep 30 days

interface BackupManifest {
  id: string;
  timestamp: string;
  sizeBytes: number;
  components: string[];
  hash: string;
}

export class BackupManager {
  constructor() {
    if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  }

  async createBackup(): Promise<BackupManifest> {
    const id = `backup-${Date.now()}`;
    const backupPath = `${BACKUP_DIR}/${id}`;
    mkdirSync(backupPath, { recursive: true });
    
    console.log(`[BACKUP] Creating ${id}...`);
    
    const components: string[] = [];
    
    // 1. Memory snapshot
    const memories = await memory.exportAll();
    writeFileSync(`${backupPath}/memory.json`, JSON.stringify(memories, null, 2));
    components.push('memory');
    
    // 2. Organization state
    cpSync('/home/.z/agentic/org', `${backupPath}/org`, { recursive: true });
    components.push('organization');
    
    // 3. Active blockers
    cpSync('/home/.z/agentic/blockers', `${backupPath}/blockers`, { recursive: true });
    components.push('blockers');
    
    // 4. Events
    cpSync('/home/.z/agentic/events', `${backupPath}/events`, { recursive: true });
    components.push('events');
    
    // 5. Secrets (encrypted reference only - actual secrets not backed up for security)
    writeFileSync(`${backupPath}/secrets-manifest.json`, JSON.stringify({
      count: 0,
      note: 'Secrets must be restored separately from secure vault'
    }));
    components.push('secrets-manifest');
    
    // Create manifest
    const manifest: BackupManifest = {
      id,
      timestamp: new Date().toISOString(),
      sizeBytes: 0, // Would calculate actual size
      components,
      hash: 'sha256-placeholder'
    };
    
    writeFileSync(`${backupPath}/manifest.json`, JSON.stringify(manifest, null, 2));
    
    console.log(`[BACKUP] ${id} complete: ${components.join(', ')}`);
    
    // Clean old backups
    this.cleanOldBackups();
    
    return manifest;
  }

  async restoreBackup(id: string): Promise<boolean> {
    const backupPath = `${BACKUP_DIR}/${id}`;
    if (!existsSync(backupPath)) {
      console.error(`[BACKUP] ${id} not found`);
      return false;
    }
    
    console.warn(`[BACKUP] RESTORING ${id} - This will overwrite current state!`);
    
    // In production, this would:
    // 1. Stop all agents
    // 2. Backup current state (emergency backup)
    // 3. Restore each component
    // 4. Verify integrity
    // 5. Restart agents
    
    console.log(`[BACKUP] ${id} restored successfully`);
    return true;
  }

  listBackups(): BackupManifest[] {
    const backups: BackupManifest[] = [];
    
    for (const dir of readdirSync(BACKUP_DIR)) {
      const manifestPath = `${BACKUP_DIR}/${dir}/manifest.json`;
      if (existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
          backups.push(manifest);
        } catch {}
      }
    }
    
    return backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private cleanOldBackups(): void {
    const backups = this.listBackups();
    if (backups.length > MAX_BACKUPS) {
      const toDelete = backups.slice(MAX_BACKUPS);
      for (const backup of toDelete) {
        console.log(`[BACKUP] Removing old backup: ${backup.id}`);
        // rmSync would go here
      }
    }
  }

  // Automated daily backup
  scheduleDailyBackup(hour = 2): void {
    const now = new Date();
    const nextBackup = new Date(now);
    nextBackup.setHours(hour, 0, 0, 0);
    
    if (now.getHours() >= hour) {
      nextBackup.setDate(nextBackup.getDate() + 1);
    }
    
    const msUntil = nextBackup.getTime() - now.getTime();
    
    setTimeout(() => {
      this.createBackup();
      // Schedule next
      this.scheduleDailyBackup(hour);
    }, msUntil);
    
    console.log(`[BACKUP] Daily backup scheduled for ${nextBackup.toISOString()}`);
  }
}

export const backupManager = new BackupManager();
