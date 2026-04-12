import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const ChallengeModal = ({ 
  isOpen, 
  onClose, 
  opponentName,
  onChallenge 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  opponentName: string | null;
  onChallenge: (wager: number, game: string) => void;
}) => {
  const [wager, setWager] = useState(10);
  const [game, setGame] = useState('Sniper Duel');
  const { send, isConnected } = useSocket();

  const handleSendChallenge = () => {
    if (!opponentName) return;
    if (isConnected) {
      send('challenge:send', {
        targetUsername: opponentName,
        game,
        wager
      });
    }
    onChallenge(wager, game);
  };

  if (!isOpen) return null;
  
  if (!opponentName) {
    return (
      <AnimatePresence>
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '350px', padding: '32px', textAlign: 'center' }}
          >
            <p style={{ color: 'var(--text-secondary)' }}>Select a player from the friends list to challenge</p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '16px' }}>
              Close
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: '450px', padding: '32px', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>
            ✕
          </button>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(255,0,255,0.1)', borderRadius: '50%', marginBottom: '16px' }}>
              <Swords size={32} color="var(--accent-secondary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Initiate Challenge</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Challenge {opponentName} to a high-stakes duel.</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Select Game</label>
            <select 
              value={game} 
              onChange={(e) => setGame(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            >
              <option value="Sniper Duel">Sniper Duel (FPS)</option>
              <option value="Neon Racer">Neon Racer (Racing)</option>
              <option value="Chess Clash">Chess Clash (Strategy)</option>
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Wager Amount ($VLY)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '8px 16px' }}>
              <DollarSign size={20} color="var(--accent-tertiary)" />
              <input 
                type="number" 
                value={wager}
                onChange={(e) => setWager(Number(e.target.value))}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  width: '100%',
                  outline: 'none',
                  padding: '8px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {[10, 50, 100, 500].map(val => (
                <button 
                  key={val}
                  onClick={() => setWager(val)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: wager === val ? 'var(--grad-primary)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >${val}</button>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', opacity: isConnected ? 1 : 0.5 }}
            onClick={handleSendChallenge}
            disabled={!isConnected}
          >
            <Trophy size={20} /> {isConnected ? 'Send Challenge' : 'Connecting...'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
