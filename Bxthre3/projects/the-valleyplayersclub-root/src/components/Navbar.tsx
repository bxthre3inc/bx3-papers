import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Cherry, LayoutDashboard, Users, Trophy, User, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenFriends: () => void;
  user?: { id: string; username: string; role?: string } | null;
}

const Navbar = ({ onOpenFriends, user }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: '1200px',
      height: '64px',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          background: 'var(--grad-primary)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px',
          display: 'flex'
        }}>
          <Gamepad2 size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          <span className="text-gradient">VPC</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '32px' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: isActive('/') ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            transition: 'color 0.2s',
            fontWeight: 500
          }}
        >
          <LayoutDashboard size={18} />
          <span>Home</span>
        </Link>
        <Link 
          to="/slots" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: isActive('/slots') ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            transition: 'color 0.2s',
            fontWeight: 500
          }}
        >
          <Cherry size={18} />
          <span>Slots</span>
        </Link>
        <Link 
          to="/skills" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: isActive('/skills') ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            transition: 'color 0.2s',
            fontWeight: 500
          }}
        >
          <Gamepad2 size={18} />
          <span>Skills</span>
        </Link>
        <Link 
          to="/leaderboards" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: isActive('/leaderboards') ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            transition: 'color 0.2s',
            fontWeight: 500
          }}
        >
          <Trophy size={18} />
          <span>Ranks</span>
        </Link>
        {/* Admin removed - accessible only by direct URL */}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onOpenFriends}
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Friends List"
        >
          <Users size={18} />
        </button>

        {user ? (
          <Link to="/profile" style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }} className="hover:bg-white/20">
            <User size={16} color="var(--accent-secondary)" /> {user.username}
          </Link>
        ) : (
          <Link to="/login" style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }} className="hover:bg-white/20">
            <User size={16} color="var(--accent-secondary)" /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
