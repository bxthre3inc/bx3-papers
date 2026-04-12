import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cherry, Gem, Flame } from 'lucide-react';
import GameCard from '../components/GameCard';

const Slots = () => {
  const navigate = useNavigate();
  const games = [
    { title: 'Neon Nights', category: 'Classic Slot', color: '#ff00ff', id: 'neon-nights' },
    { title: 'Cyber Jackpot', category: 'Progressive', color: '#00ffff', id: 'cyber-jackpot' },
    { title: 'Mystic Fortune', category: 'Video Slot', color: '#8a2be2', id: 'mystic-fortune' },
    { title: 'Galaxy Spin', category: 'Megaways', color: '#ffb347', id: 'galaxy-spin' },
    { title: 'Dragon Treasury', category: 'Video Slot', color: '#ff4040', id: 'dragon-treasury' },
    { title: 'Quantum Reels', category: 'Classic Slot', color: '#bb86fc', id: 'quantum-reels' },
  ];

  const handleGameClick = (id: string, title: string) => {
    navigate(`/slots/${id}`);
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
          background: 'rgba(255, 0, 255, 0.1)',
          padding: '12px',
          borderRadius: '50%',
          marginBottom: '16px',
          color: 'var(--accent-secondary)'
        }}>
          <Cherry size={36} className="slots-icon" />
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 800, marginBottom: '16px' }}>
          Dynamic <span className="text-gradient">Slots</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
          Spin the reels on our provably fair, high-RTP slot machines. Featuring dynamic 
          multipliers, free spins, and massive progressive jackpots.
        </p>
      </motion.div>

      {/* Tabs / Filters */}
      <div className="slots-filters">
        <button className="btn btn-primary" style={{ padding: '8px 24px', minWidth: '80px' }}>All</button>
        <button className="btn btn-secondary" style={{ padding: '8px 24px', minWidth: '80px' }}><Flame size={14} /> Hot</button>
        <button className="btn btn-secondary" style={{ padding: '8px 24px', minWidth: '80px' }}><Gem size={14} /> Jackpots</button>
      </div>

      <div className="slots-grid">
        {/* Flagship Game [NEW] */}
        <GameCard 
          title="Cyber Slots" 
          category="VPC Originals" 
          imageColor="#00ffff" 
          delay={0}
          onClick={() => navigate('/slots/cyber')}
        />

        {games.map((g, i) => (
          <GameCard 
            key={i} 
            title={g.title} 
            category={g.category} 
            imageColor={g.color} 
            delay={(i + 1) * 0.1}
            onClick={() => handleGameClick(g.id, g.title)}
          />
        ))}
      </div>

      <style>{`
        .slots-filters {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          padding: 0 8px;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }
        @media (min-width: 480px) {
          .slots-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
        }
        @media (min-width: 768px) {
          .slots-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 24px;
          }
          .slots-filters {
            flex-wrap: nowrap;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            justify-content: center;
          }
          .slots-icon {
            width: 48px !important;
            height: 48px !important;
          }
        }
        @media (max-width: 480px) {
          .slots-filters {
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            flex-wrap: nowrap;
            padding-bottom: 8px;
          }
          .slots-filters::-webkit-scrollbar {
            display: none;
          }
          .btn {
            padding: 8px 16px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Slots;
