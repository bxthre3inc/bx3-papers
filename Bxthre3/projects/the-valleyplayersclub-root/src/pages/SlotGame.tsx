import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import UniversalSlotMachine from '../components/slots/UniversalSlotMachine';
import { Shield, Info, ArrowLeft } from 'lucide-react';

interface GameManifest {
  id?: string;
  name: string;
  theme: string;
  reels: string[][];
  rows: number;
  evaluatorType: string;
  paylines: any[];
}

interface ThemeConfig {
  primary: string;
  secondary?: string;
  background?: string;
  symbols?: Record<string, { svg: string }>;
}

const SlotGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [manifest, setManifest] = useState<GameManifest | null>(null);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) {
        setError('No game ID provided');
        setLoading(false);
        return;
      }

      try {
        // Try to load generated game first
        const manifestResponse = await fetch(`/games/generated/${gameId}-manifest.json`);
        const themeResponse = await fetch(`/games/generated/${gameId}-theme.json`);

        if (manifestResponse.ok && themeResponse.ok) {
          const manifestData = await manifestResponse.json();
          const themeData = await themeResponse.json();
          // Add the game ID to the manifest
          manifestData.id = gameId;
          setManifest(manifestData);
          setThemeConfig(themeData);
        } else {
          // Fallback: check for built-in games
          if (gameId === 'cyber') {
            const cyberManifest = await import('../../server/src/games/configs/slots/cyberSlots/manifest.json');
            const baseManifest = cyberManifest.default || cyberManifest;
            setManifest({ ...baseManifest, id: 'cyber' });
            setThemeConfig({
              primary: '#00ffff',
              secondary: '#ff00ff',
              background: '#0a0a1a'
            });
          } else {
            setError(`Game "${gameId}" not found`);
          }
        }
      } catch (err) {
        setError(`Failed to load game: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 50, height: 50, border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}
        />
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading game...</p>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h2 style={{ color: '#ff4444' }}>⚠️ {error || 'Game not found'}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/slots')} style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Slots
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-layout"
      >
        <div className="game-sidebar">
          <div className="game-info-card neon-border">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/slots')}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
            <h3><Info size={18} /> GAME INFO</h3>
            <p>Welcome to <strong>{manifest.name}</strong>. Spin the reels and win big!</p>
            <div className="stats-list">
              <div className="stat-item">
                <span>THEME</span>
                <span className="neon-yellow" style={{ textTransform: 'uppercase' }}>{manifest.theme}</span>
              </div>
              <div className="stat-item">
                <span>REELS</span>
                <span className="neon-blue">{manifest.reels.length}</span>
              </div>
              <div className="stat-item">
                <span>ROWS</span>
                <span className="neon-blue">{manifest.rows}</span>
              </div>
              <div className="stat-item">
                <span>PAYLINES</span>
                <span className="neon-blue">{manifest.paylines?.length || 20}</span>
              </div>
            </div>
          </div>

          <div className="game-info-card neon-border" style={{ marginTop: '24px' }}>
            <h3><Shield size={18} /> PROVABLY FAIR</h3>
            <p>Deterministic results powered by HMAC-SHA256. Every spin is verifiable.</p>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }}>
              VERIFY SEEDS
            </button>
          </div>
        </div>

        <div className="game-main">
          <UniversalSlotMachine 
            gameId={gameId || 'unknown'}
            category="slots"
            themeId={manifest.theme}
            manifest={manifest as any}
          />
        </div>
      </motion.div>

      <style>{`
        .game-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
        }
        .game-info-card { background: rgba(0,0,0,0.4); padding: 24px; border-radius: 16px; }
        .game-info-card h3 { font-size: 0.9rem; letter-spacing: 2px; color: var(--accent-primary); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .game-info-card p { font-size: 0.85rem; color: var(--text-secondary); }
        .stat-item { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .neon-yellow { color: #ffd700; }
        .neon-blue { color: #00f2ff; }
      `}</style>
    </div>
  );
};

export default SlotGame;
