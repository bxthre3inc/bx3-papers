import React from 'react';
import { motion } from 'framer-motion';
import UniversalSlotMachine from '../components/slots/UniversalSlotMachine';
import manifest from '../../server/src/games/configs/slots/cyberSlots/manifest.json';
import { Shield, Info, HelpCircle } from 'lucide-react';

const CyberSlotsGame: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-layout"
      >
        <div className="game-sidebar">
          <div className="game-info-card neon-border">
            <h3><Info size={18} /> GAME INFO</h3>
            <p>Welcome to <strong>{manifest.name}</strong>, a VPC original. Built for the modern edge.</p>
            <div className="stats-list">
              <div className="stat-item">
                <span>VOLATILITY</span>
                <span className="neon-yellow">HIGH</span>
              </div>
              <div className="stat-item">
                <span>REELS</span>
                <span className="neon-blue">{manifest.reels.length}</span>
              </div>
            </div>
          </div>

          <div className="game-info-card neon-border" style={{ marginTop: '24px' }}>
            <h3><Shield size={18} /> PROVABLY FAIR</h3>
            <p>Deterministic results powered by HMAC-SHA256.</p>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }}>VERIFY SEEDS</button>
          </div>
        </div>

        <div className="game-main">
          <UniversalSlotMachine 
            gameId="cyberSlots"
            category="slots"
            themeId="cyberpunk"
            manifest={manifest as any}
          />
          
          <div className="paytable-hint">
            <div className="hint-item">
              <HelpCircle size={14} /> 5 of a kind pays up to 500x
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .game-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 32px;
        }
        .game-info-card { background: rgba(0,0,0,0.4); padding: 24px; border-radius: 16px; }
        .game-info-card h3 { font-size: 0.9rem; letter-spacing: 2px; color: var(--accent-primary); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .game-info-card p { font-size: 0.85rem; color: var(--text-secondary); }
        .stat-item { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .paytable-hint { display: flex; gap: 24px; justify-content: center; margin-top: 24px; color: var(--text-muted); font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

export default CyberSlotsGame;
