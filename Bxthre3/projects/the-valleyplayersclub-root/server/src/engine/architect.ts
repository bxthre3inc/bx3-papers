/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { ManifestValidator } from './validator';
import { AnalyticsService } from '../services/AnalyticsService';

export interface ArchitectIntent {
  prompt: string;
  context?: any;
}

export class GameArchitect {
  private static OLLAMA_URL = 'http://localhost:11434/api/generate';

  /**
   * Automatically synthesizes a new game variant based on portfolio gaps.
   */
  static async synthesizePortfolioUpdate() {
    const health = await AnalyticsService.getPortfolioHealth();
    const extremeVariants = health.filter(h => h.volatilityScore === 'extreme');
    
    if (extremeVariants.length > 0) {
      const target = extremeVariants[0];
      if (!target) return null;
      return this.architect({ 
        prompt: `Create a high-retention stabilization variant of ${target.gameId} with lower volatility and smoother RTP curve.` 
      });
    }
    return null;
  }

  /**
   * Translates NLP prompt into a valid VPC Game Manifest and Theme using local Ollama.
   */
  static async architect(intent: ArchitectIntent) {
    const { prompt } = intent;

    const systemPrompt = `
      You are the VPC Game Architect. Transform the user's description into a valid JSON Game Configuration.
      Output ONLY a JSON object with this exact structure:
      {
        "manifest": {
          "name": "Game Name",
          "theme": "identifier",
          "reels": [[symbols], [symbols], ...], (5 reels recommended)
          "rows": 3,
          "evaluatorType": "slots-lines"
        },
        "themeConfig": {
          "primary": "#hex",
          "secondary": "#hex",
          "background": "#hex",
          "symbols": {
            "WILD": { "svg": "<svg>...</svg>" },
            "7": { "svg": "<svg>...</svg>" },
            "CHERRY": { "svg": "<svg>...</svg>" },
            "BAR": { "svg": "<svg>...</svg>" },
            "LEMON": { "svg": "<svg>...</svg>" }
          }
        },
        "explanation": "Short summary of the design choices"
      }
      Use high-fidelity, minimalist SVGs for the symbols. Use neon colors and premium gradients.
    `;

    try {
      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        body: JSON.stringify({
          model: 'phi3',
          prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
          stream: false,
          format: 'json'
        })
      });

      if (!response.ok) throw new Error('Ollama service unavailable');
      
      const raw = await response.json() as any;
      const result = JSON.parse(raw.response);

      // Validate manifest
      const validation = ManifestValidator.validate(result.manifest);
      if (!validation.valid) throw new Error(`Invalid manifest generated: ${validation.errors.join(', ')}`);

      return {
        ...result,
        manifest: {
          ...result.manifest,
          paylines: this.generateStandardLines(result.manifest.reels.length, result.manifest.rows)
        }
      };
    } catch (err) {
      console.error('Architect Error:', err);
      // Fallback to mock for now if Ollama fails
      return this.mockArchitect(prompt);
    }
  }

  private static async mockArchitect(prompt: string) {
    // ... existing mock logic updated for SVGs ...
    const themeName = prompt.toLowerCase().includes('space') ? 'space' : 'classic';
    const reels = 5;
    const rows = 3;
    
    return {
      manifest: {
        name: `${themeName.toUpperCase()} SLOT`,
        theme: themeName,
        reels: Array(reels).fill(null).map(() => ["CHERRY", "BAR", "7", "LEMON", "WILD"]),
        rows: rows,
        evaluatorType: 'slots-lines',
        paylines: this.generateStandardLines(reels, rows)
      },
      themeConfig: {
        primary: '#00f2ff',
        symbols: {
          WILD: { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>' }
        }
      },
      explanation: "Offline Mock: System using hardcoded SVG templates because Ollama is unreachable."
    };
  }

  private static generateRandomStrip() {
    const symbols = ["CHERRY", "BAR", "7", "LEMON", "WILD"];
    return Array(10).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  }

  private static generateStandardLines(reels: number, rows: number) {
    // Generate horizontal lines for demo
    return Array(rows).fill(null).map((_, r) => 
      Array(reels).fill(null).map((_, c) => ({ row: r, col: c }))
    );
  }

  private static generateAssetPrompts(theme: string) {
    return {
      CHERRY: `A glowing holographic cherry icon, ${theme} aesthetic, high detail, black background`,
      WILD: `A pulsing energy core symbol, ${theme} style, 8k resolution, centered`,
      BACKGROUND: `A sprawling ${theme} landscape, deep perspective, cinematic lighting`
    };
  }

  private static generateThemeConfig(theme: string) {
    const configs: any = {
      space: {
        primary: '#00f2ff',
        secondary: '#7000ff',
        background: '#020205',
        reelBg: '#050510',
        border: '#4a00e0'
      },
      classic: {
        primary: '#ffd700',
        secondary: '#ff0000',
        background: '#1a0505',
        reelBg: '#000000',
        border: '#ffd700'
      }
    };
    return configs[theme] || configs.space;
  }
}
