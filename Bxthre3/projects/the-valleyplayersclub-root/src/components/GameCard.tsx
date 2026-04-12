import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface GameCardProps {
  title: string;
  category: string;
  imageColor: string;
  delay?: number;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, category, imageColor, delay = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="glass-panel game-card"
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid var(--border-glass)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div className="game-card-image" style={{
        width: '100%',
        borderRadius: 'var(--radius-sm)',
        background: `linear-gradient(135deg, ${imageColor}, #111)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          opacity: 0,
          transition: 'opacity 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-sm)'
        }} className="hover-overlay">
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <Play size={14} /> Play
          </button>
        </div>
      </div>
      <div>
        <span style={{ 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--accent-secondary)',
          display: 'block',
          marginBottom: '4px'
        }}>
          {category}
        </span>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          {title}
        </h3>
      </div>
      
      <style>{`
        .game-card-image {
          height: 110px;
        }
        @media (min-width: 480px) {
          .game-card-image {
            height: 140px;
          }
          .game-card h3 {
            font-size: 1.05rem !important;
          }
          .game-card span {
            font-size: 0.75rem !important;
          }
        }
        @media (min-width: 768px) {
          .game-card-image {
            height: 160px;
          }
        }
        @media (min-width: 1024px) {
          .game-card-image {
            height: 180px;
          }
        }
        .glass-panel:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default GameCard;
