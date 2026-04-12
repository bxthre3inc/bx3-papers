import { motion } from 'framer-motion';
import { Target, Trophy, Flame, History, Award } from 'lucide-react';

const Profile = () => {
  const user = {
    username: 'NeonNinja',
    avatar: 'N',
    elo: 1850,
    rank: 'Diamond Elite',
    totalWinnings: 14250,
    winRate: 68,
    matchesPlayed: 342,
  };

  const matchHistory = [
    { opponent: 'CyberShark', game: 'Sniper Duel', result: 'Win', amount: '+200 VLY', time: '2 hours ago', isWin: true },
    { opponent: 'LuckyRoller', game: 'Neon Racer', result: 'Loss', amount: '-50 VLY', time: '5 hours ago', isWin: false },
    { opponent: 'ByteMaster', game: 'Chess Clash', result: 'Win', amount: '+100 VLY', time: '1 day ago', isWin: true },
    { opponent: 'SlotKing99', game: 'Sniper Duel', result: 'Win', amount: '+500 VLY', time: '2 days ago', isWin: true },
    { opponent: 'Anon_8842', game: 'Aero Blitz', result: 'Loss', amount: '-150 VLY', time: '2 days ago', isWin: false },
  ];

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      
      {/* Header Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ padding: '40px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}
      >
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%', background: 'var(--grad-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800,
          boxShadow: '0 0 40px rgba(138, 43, 226, 0.4)', border: '4px solid var(--border-glass)'
        }}>
          {user.avatar}
        </div>
        
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>{user.username}</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ 
              background: 'rgba(0, 255, 255, 0.1)', color: 'var(--accent-tertiary)', 
              padding: '6px 16px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Award size={16} /> {user.rank}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>Member since 2024</span>
          </div>
        </div>

        {/* Highlight Stats */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Skill Rating</div>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
               <Target size={24} color="var(--accent-secondary)" /> {user.elo}
             </div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-glass)' }} />
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Earnings</div>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
               <Trophy size={24} color="#ffd700" /> ${user.totalWinnings.toLocaleString()}
             </div>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* Deep Stats */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="var(--accent-secondary)" /> Play Statistics
          </h3>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                <span style={{ fontWeight: 700 }}>{user.winRate}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${user.winRate}%`, height: '100%', background: 'var(--grad-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Matches Played</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.matchesPlayed}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Best Streak</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00e676' }}>12 W</div>
              </div>
            </div>

            {/* Favorite Game */}
            <div style={{ background: 'rgba(255,69,0,0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,69,0,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#ff4500', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🎯
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Most Played Game</div>
                <div style={{ fontWeight: 700 }}>Sniper Duel</div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Match History */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color="var(--accent-tertiary)" /> Recent Matches
          </h3>
          <div className="glass-panel" style={{ padding: '8px' }}>
            {matchHistory.map((match, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                borderBottom: i !== matchHistory.length - 1 ? '1px solid var(--border-glass)' : 'none',
                background: 'rgba(255,255,255,0.01)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>vs {match.opponent}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{match.game} • {match.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: 800, 
                    color: match.isWin ? '#00e676' : '#ff4040',
                    fontSize: '1.1rem'
                  }}>
                    {match.amount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {match.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
