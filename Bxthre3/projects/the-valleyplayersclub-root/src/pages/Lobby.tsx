import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Swords, MessageSquare, Flame } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const Lobby = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { send, lastMessage, isConnected } = useSocket();
  
  // State from react-router navigation (populated by the challenge:accept event)
  const lobbyState = location.state;
  
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [messages, setMessages] = useState<{from: string, message: string}[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Determine who the opponent is based on mock logic
  const isPlayer1 = true; // Simplified - in production this comes from server
  const me = lobbyState?.p1 || { username: 'You', elo: 1000, avatar: 'U' };
  const opponent = lobbyState?.p2 || lobbyState?.opponent || { username: 'Opponent', elo: 1000, avatar: '?' };

  // Handle incoming socket messages
  useEffect(() => {
    if (!lastMessage) return;
    
    const { type, data } = lastMessage;
    
    switch (type) {
      case 'lobby:update':
        // Handle lobby update
        if (data) {
          setIsReady(data.p1Ready || false);
          setOpponentReady(data.p2Ready || false);
        }
        break;
      case 'lobby:startCountdown':
        if (typeof data === 'number') {
          setCountdown(data);
        }
        break;
      case 'lobby:message':
        if (data && data.from && data.message) {
          setMessages(prev => [...prev, data]);
        }
        break;
    }
  }, [lastMessage]);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Transition to game (mock alert for now)
      alert(`Transferring to Game Server: ${lobbyState?.game || 'Cyber Slots'}...`);
    }
  }, [countdown, lobbyState]);

  const handleToggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    
    if (lobbyState?.id) {
      send('lobby:ready', {
        lobbyId: lobbyState.id,
        isReady: newReadyState
      });
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() && lobbyState?.id) {
       send('lobby:message', {
         lobbyId: lobbyState.id,
         message: chatInput.trim()
       });
       // Add own message immediately for UI feedback
       setMessages(prev => [...prev, { from: me.username, message: chatInput.trim() }]);
       setChatInput('');
    }
  };

  if (!lobbyState) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1>No active lobby</h1>
        <button className="btn btn-primary" onClick={() => navigate('/skills')}>
          Go to Skills
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: 'var(--radius-full)', marginBottom: '16px', border: '1px solid var(--border-glass)' }}>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{lobbyState.game}</span> Match ID: #{lobbyState.id?.split('-')[1] || '0000'}
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
          Prepare For <span className="text-gradient">Battle</span>
        </h1>
      </motion.div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        
        {/* Head-to-Head Arena */}
        <div className="glass-panel" style={{
          position: 'relative',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '24px',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          {/* Background VS Graphic */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--grad-vs)',
            opacity: 0.5,
            pointerEvents: 'none'
          }} />

          {/* You (Player 1) */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`glass-panel ${isReady ? 'player-ready' : ''}`}
            style={{ 
              padding: '24px', 
              textAlign: 'center', 
              background: 'rgba(0,0,0,0.4)',
              border: isReady ? '2px solid #00e676' : '1px solid var(--border-glass)',
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '2rem', fontWeight: 800, position: 'relative'
            }}>
              {me?.avatar || 'U'}
              {isReady && (
                <div style={{ position: 'absolute', top: -5, right: -5, background: '#00e676', color: '#000', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  READY
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>{me?.username || 'You'}</h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Elo: {me?.elo || 1000}</div>
          </motion.div>

          {/* Versus Center */}
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255,0,255,0.1)',
              borderRadius: '50%',
              display: 'inline-flex',
              marginBottom: '16px',
              boxShadow: '0 0 30px rgba(255,0,255,0.2)'
            }}>
              <Swords size={40} color="var(--accent-secondary)" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', color: 'var(--text-muted)' }}>
              VS
            </div>
          </div>

          {/* Opponent (Player 2) */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`glass-panel ${opponentReady ? 'player-ready' : ''}`}
            style={{ 
              padding: '24px', 
              textAlign: 'center', 
              background: 'rgba(0,0,0,0.4)',
              border: opponentReady ? '2px solid #00e676' : '1px solid var(--border-glass)',
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: '#333',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '2rem', fontWeight: 800, position: 'relative', border: '2px solid #555'
            }}>
              {opponent?.avatar || '?'}
              {opponentReady && (
                <div style={{ position: 'absolute', top: -5, right: -5, background: '#00e676', color: '#000', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  READY
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>{opponent?.username || 'Opponent'}</h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Elo: {opponent?.elo || 1000}</div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '24px' }}>
          
          {/* Wager Details */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Pot</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-tertiary)' }}>
              <DollarSign size={32} />
              {(lobbyState.wager * 2).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Winner takes all ($VLY)
            </div>
          </div>

          {/* Controls & Chat */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {/* Live Chat Area */}
             <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 'auto' }}>Match lobby created. Waiting for players...</div>
                {messages.map((msg, i) => (
                   <div key={i} style={{ 
                      fontSize: '0.9rem', 
                      background: msg.from === me?.username ? 'rgba(138, 43, 226, 0.2)' : 'rgba(255,255,255,0.05)', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      marginBottom: '8px', 
                      width: 'fit-content',
                      alignSelf: msg.from === me?.username ? 'flex-end' : 'flex-start'
                    }}>
                      <span style={{ color: msg.from === me?.username ? 'var(--accent-secondary)' : '#fff', fontWeight: 'bold' }}>{msg.from}</span>: {msg.message}
                   </div>
                ))}
             </div>

            {/* Input & Ready Toggle */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <form 
                style={{ flex: 1, display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)', padding: '4px 8px' }}
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              >
                <input 
                  type="text" 
                  placeholder="Send a message..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px', flex: 1, outline: 'none' }} 
                />
                <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><MessageSquare size={18} /></button>
              </form>

              {countdown !== null ? (
                <div style={{ 
                  background: 'var(--text-primary)', 
                  color: 'var(--bg-dark)', 
                  padding: '12px 32px', 
                  borderRadius: 'var(--radius-full)', 
                  fontWeight: 800, 
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Flame size={20} /> STARTING IN {countdown}
                </div>
              ) : (
                <button 
                  className={`btn ${isReady ? 'btn-secondary' : 'btn-primary'}`} 
                  style={{ padding: '12px 32px', fontSize: '1.1rem' }}
                  onClick={handleToggleReady}
                  disabled={!isConnected}
                >
                  {isReady ? 'Cancel Ready' : 'Ready Up'}
                </button>
              )}
            </div>
          </div>
          
        </div>

        {/* Cancel Button */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              className="btn btn-danger" 
              onClick={() => navigate('/skills')}
              disabled={countdown !== null}
              style={{ padding: '8px 24px', fontSize: '0.9rem', opacity: countdown !== null ? 0.5 : 1 }}
            >
              Forfeit / Leave Lobby
            </button>
        </div>

      </div>
    </div>
  );
};

export default Lobby;
