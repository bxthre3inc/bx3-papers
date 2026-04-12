import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, Users, Target } from 'lucide-react';

const Leaderboards = () => {
  const [view, setView] = useState<'global' | 'friends'>('global');

  const globalPlayers = [
    { rank: 1, name: 'FaZe_Sniper', avatar: 'F', elo: 2850, game: 'Sniper Duel', earnings: 145000 },
    { rank: 2, name: 'SlotGod99', avatar: 'S', elo: 2720, game: 'Neon Nights', earnings: 112000 },
    { rank: 3, name: 'CryptoKing', avatar: 'C', elo: 2680, game: 'Cyber Jackpot', earnings: 95500 },
    { rank: 4, name: 'NeonNinja', avatar: 'N', elo: 1850, game: 'Sniper Duel', earnings: 14250, isUser: true },
    { rank: 5, name: 'AimBotEngaged', avatar: 'A', elo: 1740, game: 'Reflex Arena', earnings: 8400 },
    { rank: 6, name: 'WhaleHunter', avatar: 'W', elo: 1690, game: 'Mystic Fortune', earnings: 7200 },
    { rank: 7, name: 'ByteMaster', avatar: 'B', elo: 1610, game: 'Chess Clash', earnings: 5100 },
    { rank: 8, name: 'LuckyRoller', avatar: 'L', elo: 1550, game: 'Gonzo Quest', earnings: 4200 },
  ];

  const friendsPlayers = [
    { rank: 1, name: 'NeonNinja', avatar: 'N', elo: 1850, game: 'Sniper Duel', earnings: 14250, isUser: true },
    { rank: 2, name: 'ByteMaster', avatar: 'B', elo: 1610, game: 'Chess Clash', earnings: 5100 },
    { rank: 3, name: 'LuckyRoller', avatar: 'L', elo: 1550, game: 'Gonzo Quest', earnings: 4200 },
    { rank: 4, name: 'CyberShark', avatar: 'C', elo: 1450, game: 'Sniper Duel', earnings: 2800 },
  ];

  const players = view === 'global' ? globalPlayers : friendsPlayers;

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 215, 0, 0.1)',
          padding: '16px',
          borderRadius: '50%',
          marginBottom: '16px',
        }}>
          <Trophy size={48} color="#ffd700" />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px 0' }}>
          Hall of <span style={{ color: '#ffd700' }}>Champions</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Track the top players on the platform. Grind your Elo rating in skill-based matches
          to climb the ranks and earn seasonal rewards.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
        <button 
          className={`btn ${view === 'global' ? 'btn-primary' : 'btn-secondary'}`} 
          style={{ padding: '12px 32px', minWidth: '160px' }}
          onClick={() => setView('global')}
        >
          <Globe size={18} /> Global Rank
        </button>
        <button 
          className={`btn ${view === 'friends' ? 'btn-primary' : 'btn-secondary'}`} 
          style={{ padding: '12px 32px', minWidth: '160px' }}
          onClick={() => setView('friends')}
        >
          <Users size={18} /> Friends League
        </button>
      </div>

      {/* Leaderboard Table Container */}
      <motion.div 
        key={view}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel" 
        style={{ padding: '16px', overflowX: 'auto' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px', width: '80px', textAlign: 'center' }}>Rank</th>
              <th style={{ padding: '16px' }}>Player ID</th>
              <th style={{ padding: '16px' }}>Skill Rating</th>
              <th style={{ padding: '16px', display: 'none' }} className="table-col-game">Top Game</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Total Winnings</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.name} style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: p.isUser ? 'rgba(138, 43, 226, 0.15)' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => { if (!p.isUser) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={(e) => { if (!p.isUser) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Rank */}
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ 
                    fontSize: p.rank <= 3 ? '1.5rem' : '1.1rem', 
                    fontWeight: 800, 
                    color: getRankColor(p.rank),
                    textShadow: p.rank <= 3 ? `0 0 10px ${getRankColor(p.rank)}40` : 'none'
                  }}>
                    #{p.rank}
                  </span>
                </td>
                
                {/* Player Profile */}
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', background: p.isUser ? 'var(--grad-primary)' : '#333',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                    }}>
                      {p.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: p.isUser ? 'var(--accent-secondary)' : 'white' }}>
                        {p.name} {p.isUser && '(You)'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Elo */}
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Target size={18} color="var(--accent-tertiary)" />
                    {p.elo}
                  </div>
                </td>

                {/* Game */}
                <td style={{ padding: '16px', color: 'var(--text-secondary)', display: 'none' }} className="table-col-game">
                  {p.game}
                </td>

                {/* Earnings */}
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 800, color: '#00e676', fontSize: '1.1rem' }}>
                  ${p.earnings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      
      <style>{`
        @media (min-width: 640px) {
          .table-col-game {
            display: table-cell !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Leaderboards;
