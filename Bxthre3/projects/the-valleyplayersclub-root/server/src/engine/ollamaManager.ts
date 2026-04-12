/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

export class OllamaManager {
  private static instance: any = null;
  private static model = process.env.OLLAMA_MODEL || 'phi3';
  private static host = process.env.OLLAMA_HOST || 'http://localhost:11434';

  static async init() {
    console.log(`🤖 [Ollama] Initializing AI Lifecycle Manager (Model: ${this.model})...`);
    
    // 1. Check if Ollama is installed
    const hasOllama = await this.checkBinary();
    if (!hasOllama) {
      console.error('❌ [Ollama] Binary not found. Please install Ollama on Zo.computer.');
      return false;
    }

    // 2. Ensure Ollama Serve is running
    await this.ensureServe();

    // 3. Ensure Model is pulled
    await this.ensureModel();

    console.log('✅ [Ollama] AI Engine Ready.');
    return true;
  }

  private static async checkBinary(): Promise<boolean> {
    try {
      const proc = Bun.spawn(['ollama', '--version']);
      const text = await new Response(proc.stdout).text();
      return text.includes('ollama');
    } catch {
      return false;
    }
  }

  private static async ensureServe() {
    try {
      // Check if already responding
      const res = await fetch(`${this.host}/api/tags`);
      if (res.ok) {
        console.log('ℹ️ [Ollama] Service already running.');
        return;
      }
    } catch {
      console.log('🚀 [Ollama] Starting background service...');
      // Start as a background process using Bun.spawn
      Bun.spawn(['ollama', 'serve'], {
        stdout: 'inherit',
        stderr: 'inherit',
        onExit: (proc) => {
          console.log(`⚠️ [Ollama] Service exited with code ${proc.exitCode}`);
        }
      });
      
      // Wait for it to wake up
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1000));
        try {
          const res = await fetch(`${this.host}/api/tags`);
          if (res.ok) return;
        } catch {}
      }
      throw new Error('Ollama failed to start after 10 seconds.');
    }
  }

  private static async ensureModel() {
    console.log(`📦 [Ollama] Verifying model: ${this.model}...`);
    const res = await fetch(`${this.host}/api/tags`);
    const data = await res.json() as any;
    
    const hasModel = data.models?.some((m: any) => m.name.startsWith(this.model));
    
    if (!hasModel) {
      console.log(`⬇️ [Ollama] Pulling ${this.model} (this may take a few minutes)...`);
      const pullProc = Bun.spawn(['ollama', 'pull', this.model]);
      await pullProc.exited;
      console.log(`✅ [Ollama] ${this.model} pulled successfully.`);
    } else {
      console.log(`✅ [Ollama] ${this.model} is present.`);
    }
  }
}
