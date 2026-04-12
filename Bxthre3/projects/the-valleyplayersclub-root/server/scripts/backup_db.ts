import { $ } from "bun";
import path from "path";

const DB_PATH = process.env.DB_PATH || "server/data/vpc.db";
const BACKUP_DIR = "backups";

async function backup() {
    console.log(`[Backup] Starting backup of ${DB_PATH}...`);
    
    // Create backup directory if it doesn't exist
    await $`mkdir -p ${BACKUP_DIR}`;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `vpc-backup-${timestamp}.sqlite`;
    const destination = path.join(BACKUP_DIR, filename);
    
    try {
        await $`cp ${DB_PATH} ${destination}`;
        console.log(`[Backup] Success! Backed up to ${destination}`);
        
        // Retention: Keep only the last 7 backups
        const backups = await $`ls -t ${BACKUP_DIR}`.text();
        const files = backups.trim().split("\n");
        if (files.length > 7) {
            const toDelete = files.slice(7);
            for (const file of toDelete) {
                if (file) {
                    await $`rm ${path.join(BACKUP_DIR, file)}`;
                    console.log(`[Backup] Cleaned up old backup: ${file}`);
                }
            }
        }
    } catch (error) {
        console.error(`[Backup] Failed:`, error);
        process.exit(1);
    }
}

backup();
