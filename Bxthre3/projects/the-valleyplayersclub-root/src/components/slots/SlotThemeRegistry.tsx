import { Crown, Square, Circle, Triangle, Zap, Star, Gem } from 'lucide-react';

export interface ThemeConfig {
  id: string;
  name: string;
  color: string;
  reelBg: string;
  border: string;
  symbols: Record<string, { icon: any; color: string; svg?: string; className?: string }>;
}

const DEFAULT_THEMES: Record<string, ThemeConfig> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    color: '#bc13fe',
    reelBg: 'rgba(20, 10, 30, 0.8)',
    border: '#bc13fe',
    symbols: {
      '7': { icon: Crown, color: '#bc13fe', className: 'neon-purple' },
      'BAR': { icon: Square, color: '#39ff14', className: 'neon-green' },
      'CHERRY': { icon: Circle, color: '#ff003c', className: 'neon-pink' },
      'LEMON': { icon: Triangle, color: '#fffb00', className: 'neon-yellow' },
      'WILD': { icon: Zap, color: '#00f2ff', className: 'neon-blue' },
      'BLANK': { icon: Circle, color: 'transparent', className: 'blank' }
    }
  }
};

class ThemeRegistry {
  private themes: Record<string, ThemeConfig> = { ...DEFAULT_THEMES };

  getTheme(id: string): ThemeConfig {
    return this.themes[id] || this.themes.cyberpunk;
  }

  registerTheme(config: any) {
    const id = config.id || `dynamic_${Date.now()}`;
    this.themes[id] = {
      id,
      name: config.name || 'AI Generated Game',
      color: config.primary || '#00f2ff',
      reelBg: config.reelBg || 'rgba(0,0,0,0.8)',
      border: config.border || config.primary || '#00f2ff',
      symbols: Object.entries(config.symbols || {}).reduce((acc, [key, val]: [string, any]) => {
        acc[key] = {
          icon: Zap, // Fallback
          color: config.primary || '#00f2ff',
          svg: val.svg,
          className: val.className || ''
        };
        return acc;
      }, {} as any)
    };
    return id;
  }
}

export const SlotThemeRegistry = new ThemeRegistry();
