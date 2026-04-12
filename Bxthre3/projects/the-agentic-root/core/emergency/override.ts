export class EmergencyOverride {
  private overrideActive = false;
  private pausedAgents: string[] = [];

  activate(reason: string): void {
    this.overrideActive = true;
    console.log(`🛑 EMERGENCY OVERRIDE: ${reason}`);
    console.log(`   All agents paused. brodiblanco has full control.`);
  }

  pauseAgent(agentId: string): void {
    this.pausedAgents.push(agentId);
    console.log(`   Agent ${agentId} PAUSED`);
  }

  resume(): void {
    this.overrideActive = false;
    console.log(`✅ Override lifted. ${this.pausedAgents.length} agents resuming.`);
    this.pausedAgents = [];
  }

  isActive(): boolean { return this.overrideActive; }
}

export const emergency = new EmergencyOverride();
