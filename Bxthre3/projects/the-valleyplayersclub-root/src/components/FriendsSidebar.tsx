import { motion } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Swords } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'in-game';
  game?: string;
  avatar: string;
}

export const FriendsSidebar = ({ isOpen, onClose, onChallenge }: { isOpen: boolean; onClose: () => void; onChallenge?: (id: string) => void }) => {
  const { friends, isConnected } = useSocket();

  // If no socket friends, fall back to mock data or empty state for demo purposes
  const displayFriends = friends.length > 0 ? friends.map(f => ({
    ...f,
    name: f.username || f.name
  })) : [
    { id: 'offline-1', name: 'No Live Connections', status: 'offline', avatar: '?' }
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100vh',
        zIndex: 1000,
        borderRadius: '0',
        borderLeft: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        background: 'rgba(15, 10, 28, 0.8)'
      }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} className="text-gradient" />
          Friends
        </h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Online</h3>
          <span style={{ fontSize: '0.75rem', color: isConnected ? '#00e676' : '#ff4040' }}>
            {isConnected ? '✓ Connected' : 'Disconnected'}
          </span>
        </div>
        
        {displayFriends.map(friend => (
          <div key={friend.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.03)',
            marginBottom: '8px',
            gap: '12px',
            transition: 'background 0.2s',
            cursor: 'pointer',
          }}
          className="friend-card"
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'relative' }}>
              {friend.avatar}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: friend.status === 'online' ? '#00e676' : friend.status === 'in-game' ? '#ff9100' : '#757575',
                border: '2px solid var(--bg-dark)'
              }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{friend.name}</div>
              <div style={{ fontSize: '0.75rem', color: friend.status === 'in-game' ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>
                {friend.status === 'in-game' ? `Playing ${friend.game}` : friend.status}
              </div>
            </div>

            <div className="friend-actions" style={{ display: 'none', gap: '8px' }}>
                <MessageSquare size={16} color="var(--text-secondary)" />
                {friend.status !== 'offline' && (
                  <Swords 
                    size={16} 
                    color="var(--accent-secondary)" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (onChallenge) onChallenge(friend.name);
                      onClose();
                    }}
                  />
                )}
            </div>
          </div>
        ))}

        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px', padding: '8px' }}>
          <UserPlus size={16} /> Add Friend
        </button>
      </div>

      <style>{`
        .friend-card:hover {
          background: rgba(255,255,255,0.08) !important;
        }
        .friend-card:hover .friend-actions {
          display: flex !important;
        }
      `}</style>
    </motion.div>
  );
};
