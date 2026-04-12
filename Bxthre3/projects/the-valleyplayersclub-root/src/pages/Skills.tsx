import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Swords } from 'lucide-react';
import GameCard from '../components/GameCard';

const Skills = () => {
  const games = [
    { title: 'Sniper Duel', category: 'FPS 1v1', color: '#ff4500' },
    { title: 'Neon Racer', category: 'Racing', color: '#00fa9a' },
    { title: 'Aero Blitz', category: 'Arcade', color: '#1e90ff' },
    { title: 'Chess Clash', category: 'Strategy', color: '#d2b48c' },
    { title: 'Cyber Tetris', category: 'Puzzle', color: '#9370db' },
    { title: 'Reflex Arena', category: 'Action', color: '#ffd700' },
  ];

  const handleGameClick = (title: string) => {
    alert(`🎮 ${title} - Coming soon!`);
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <div style={{
          display: 'inline-flex',
          background: 'rgba(0, 255, 255, 0.1)',
          padding: '12px',
          borderRadius: '50%',
          marginBottom: '16px',
          color: 'var(--accent-tertiary)'
        }}>
          <Gamepad2 size={48} />
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px' }}>
          The <span className="text-gradient">Skill Arena</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Stop relying strictly on luck. Put your skills to the test in head-to-head 
          battles and tournaments for real stakes. Winner takes all.
        </p>
      </motion.div>

      {/* Stats/Leaderboard teaser */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '24px', 
        marginBottom: '40px',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>$2.4M</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Monthly Prize Pool</div>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }}></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>1v1</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Matchmaking</div>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }}></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-tertiary)' }}>Zero</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>House Edge</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
        <button className="btn btn-primary" style={{ padding: '8px 24px' }}>Active Games</button>
        <button className="btn btn-secondary" style={{ padding: '8px 24px' }}><Swords size={16} /> Duels</button>
        <button className="btn btn-secondary" style={{ padding: '8px 24px' }}><Trophy size={16} /> Tournaments</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {games.map((g, i) => (
          <GameCard 
            key={i} 
            title={g.title} 
            category={g.category} 
            imageColor={g.color} 
            delay={i * 0.1}
            onClick={() => handleGameClick(g.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
