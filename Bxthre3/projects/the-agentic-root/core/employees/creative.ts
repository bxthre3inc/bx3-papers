/**
 * Creative — Creative Director Agent (Consolidated) — Agentic
 * 
 * Combines: palette, blueprint, brand, mold, trace (design/data/brand)
 * Vertical coverage: Irrig8, VPC, Trenchbabys, Starting5, Agentic
 * 
 * Owned by: Casey (Marketing Lead)
 * Comms: Bxthre3/INBOX/agents/creative.md
 */

import { memory } from '../memory/store';

export interface BrandStandards {
  product: string;
  colors: { name: string; hex: string; use: string }[];
  formLanguage: string;
  voice: string;
}

class CreativeAgent {
  readonly id = 'creative';
  readonly name = 'Creative Director';
  readonly role = 'Marketing Lead';
  readonly department = 'marketing';
  readonly managerId = 'atlas';

  // Consolidated brand standards
  private brands: Record<string, BrandStandards> = {
    irrig8: {
      product: 'Irrig8 — Precision Agriculture OS',
      colors: [
        { name: 'Field Green', hex: '#4A7C59', use: 'Primary brand, status accents' },
        { name: 'Soil Brown', hex: '#8B6914', use: 'VFA/LRZN/LRZN labels' },
        { name: 'Signal Orange', hex: '#E85D04', use: 'Alert states, CTAs' },
        { name: 'Neutral Slate', hex: '#3D4852', use: 'Enclosure bases, text, borders' },
      ],
      formLanguage: 'Agrarian-industrial hybrid — rugged agricultural utility with precision instrumentation aesthetic',
      voice: 'Data-driven, farmer-first, scientifically rigorous',
    },
    vpc: {
      product: 'Valley Players Club — Sweepstakes Gaming',
      colors: [
        { name: 'Electric Blue', hex: '#0066FF', use: 'Primary actions' },
        { name: 'Gold', hex: '#FFD700', use: 'Jackpot/winner states' },
        { name: 'Deep Black', hex: '#0A0A0A', use: 'Background' },
      ],
      formLanguage: 'Premium gaming — sleek, high-contrast, mobile-first',
      voice: 'Exciting, rewarding, trustworthy',
    },
    trenchbabys: {
      product: 'Trenchbabys — Urban Lifestyle',
      colors: [
        { name: 'Obsidian', hex: '#1A1A1A', use: 'Primary' },
        { name: 'Cream', hex: '#F5F0E8', use: 'Accents' },
      ],
      formLanguage: 'Streetwear-meets-workwear, utilitarian',
      voice: 'Cool, authentic, community-driven',
    },
  };

  private activeRequests: Map<string, string> = new Map();

  constructor() {
    console.log('[CREATIVE] Creative director active — Irrig8, VPC, Trenchbabys, Starting5');
  }

  // === BRAND STANDARDS ===

  getBrandStandards(product: string): BrandStandards | null {
    return this.brands[product.toLowerCase()] || null;
  }

  // === DESIGN TASKS ===

  getActiveTasks(): { id: string; description: string; product: string; status: string }[] {
    const tasks: { id: string; description: string; product: string; status: string }[] = [];
    for (const [id, desc] of this.activeRequests) {
      tasks.push({ id, description: desc, product: 'irrig8', status: 'in-progress' });
    }
    return tasks;
  }

  // === CONTENT PIPELINE ===

  updateMemory(type: 'brand' | 'design' | 'motion', content: string): void {
    memory.add({
      id: `creative-${type}-${Date.now()}`,
      type: `creative-${type}`,
      agent: this.id,
      content,
      timestamp: new Date().toISOString(),
      tags: ['creative', type],
      source: this.id,
    });
  }

  getStatus(): { activeProjects: number; brandsCovered: number } {
    return {
      activeProjects: this.activeRequests.size,
      brandsCovered: Object.keys(this.brands).length,
    };
  }
}

export const creative = new CreativeAgent();
export default creative;
