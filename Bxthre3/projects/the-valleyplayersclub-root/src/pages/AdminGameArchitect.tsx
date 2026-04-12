import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { Send, Cpu, Rocket, Image as ImageIcon, CheckCircle, AlertCircle, Play } from 'lucide-react';
import UniversalSlotMachine from '../components/slots/UniversalSlotMachine';
import { SlotThemeRegistry } from '../components/slots/SlotThemeRegistry';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  preview?: any;
}

const AdminGameArchitect: React.FC = () => {
  const { send, lastMessage } = useSocket();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Systems check complete. I am the VPC Architect. Describe the slot machine you want to materialize." }
  ]);
  const [input, setInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [pendingDesign, setPendingDesign] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (lastMessage?.type === 'architect:preview') {
      const design = lastMessage.data;
      setPendingDesign(design);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: design.explanation,
        preview: design
      }]);
    }
    if (lastMessage?.type === 'game:published') {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Game successfully synchronized and published to production. Game ID: ${lastMessage.data.id}` 
      }]);
      setPendingDesign(null);
    }
  }, [lastMessage]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    
    send('architect:design', { prompt: userMsg });
  };

  const publishGame = () => {
    if (!pendingDesign) return;
    send('game:publish', {
      id: `custom_${Date.now()}`,
      category: 'slots',
      manifest: pendingDesign.manifest
    });
  };

  const openSandbox = () => {
    if (pendingDesign) {
      const dynamicId = SlotThemeRegistry.registerTheme(pendingDesign.themeConfig);
      // Update manifest to use the new dynamic theme ID
      setPendingDesign({
        ...pendingDesign,
        manifest: { ...pendingDesign.manifest, theme: dynamicId }
      });
      setIsPreviewMode(true);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="architect-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="status-pulse-container">
            <div className="status-pulse"></div>
          </div>
          <h1 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>NLP GAME ARCHITECT</h1>
        </div>
        <div className="badge neon-purple">ADMIN ACCESS: CLASSIFIED</div>
      </div>

      <div className="architect-grid">
        <div className="chat-interface glass-panel">
          <div className="messages-area" ref={scrollRef}>
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`message-bubble ${m.role}`}
                >
                  <div className="role-icon">
                    {m.role === 'assistant' ? <Cpu size={14} /> : 'YOU'}
                  </div>
                  <div className="message-content">
                    {m.content}
                    {m.preview && (
                      <div className="asset-generation-preview">
                        <div className="asset-header">
                          <ImageIcon size={14} /> GENERATED ASSET PROMPTS
                        </div>
                        <div className="prompts-list">
                          {Object.entries(m.preview.assetPrompts).map(([key, val]: [string, any]) => (
                            <div key={key} className="prompt-item">
                              <strong>{key}:</strong> {val}
                            </div>
                          ))}
                        </div>
                        <button className="btn btn-secondary" onClick={openSandbox}>
                          <Play size={14} /> OPEN SANDBOX PREVIEW
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="input-area">
            <input 
              type="text" 
              placeholder="Describe the game mechanics and theme..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <Send size={20} />
            </button>
          </div>
        </div>

        <div className="action-center">
           <div className="glass-panel stat-card">
              <div className="label"><Rocket size={14} /> DEPLOYMENT QUEUE</div>
              {pendingDesign ? (
                <div style={{ padding: '16px' }}>
                  <div className="design-summary">
                    <strong>{pendingDesign.manifest.name}</strong>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Theme: {pendingDesign.manifest.theme}</div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={publishGame}>
                    <CheckCircle size={16} /> PUBLISH TO LIVE
                  </button>
                </div>
              ) : (
                <div className="empty-state">No pending designs.</div>
              )}
           </div>

           <div className="glass-panel stat-card" style={{ marginTop: '24px' }}>
              <div className="label"><AlertCircle size={14} /> SYSTEM STATUS</div>
              <div className="system-log">
                <div className="log-entry">Socket: CONNECTED</div>
                <div className="log-entry">DB: vpc.db (ONLINE)</div>
                <div className="log-entry">NLP: BOUNDARYv2 (STRICT)</div>
              </div>
           </div>
        </div>
      </div>

      {isPreviewMode && pendingDesign && (
        <div className="fullscreen-preview">
          <button className="close-preview" onClick={() => setIsPreviewMode(false)}>✕ CLOSE PREVIEW</button>
          <div className="preview-container">
            <UniversalSlotMachine 
              gameId="architect_preview"
              category="slots"
              themeId={pendingDesign.manifest.theme}
              manifest={pendingDesign.manifest}
            />
          </div>
        </div>
      )}

      <style>{`
        .architect-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          flex: 1;
          margin-top: 24px;
          overflow: hidden;
          padding-bottom: 32px;
        }
        .chat-interface {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .message-bubble {
          max-width: 80%;
          padding: 16px;
          border-radius: 12px;
          position: relative;
        }
        .message-bubble.assistant {
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.2);
          align-self: flex-start;
          border-bottom-left-radius: 2px;
        }
        .message-bubble.user {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          align-self: flex-end;
          border-bottom-right-radius: 2px;
        }
        .role-icon { font-size: 0.6rem; color: var(--accent-secondary); margin-bottom: 6px; font-weight: 800; letter-spacing: 1px; }
        .input-area {
          padding: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 12px;
        }
        .input-area input {
          flex: 1;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          padding: 14px 20px;
          color: white;
          outline: none;
        }
        .send-btn { 
          background: var(--grad-primary);
          border: none;
          border-radius: 12px;
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }
        .asset-generation-preview {
          margin-top: 16px;
          background: rgba(0,0,0,0.4);
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid var(--accent-primary);
        }
        .asset-header { font-size: 0.75rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .prompts-list { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; }
        
        .stat-card .label { 
          font-size: 0.7rem; font-weight: 900; letter-spacing: 2px; color: var(--text-muted); padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 8px;
        }
        .empty-state { padding: 32px; text-align: center; color: var(--text-muted); font-size: 0.8rem; }
        .system-log { padding: 16px; font-family: monospace; font-size: 0.75rem; color: #00e676; }
        .log-entry { margin-bottom: 4px; }

        .fullscreen-preview {
          position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 5000;
          display: flex; align-items: center; justify-content: center; flex-direction: column;
        }
        .close-preview { 
          position: absolute; top: 40px; right: 40px; background: none; border: 1px solid white; color: white; padding: 12px 24px; cursor: pointer; border-radius: 80px; font-weight: 700;
        }
        .preview-container { width: 100%; maxWidth: 1000px; padding: 24px; }
      `}</style>
    </div>
  );
};

export default AdminGameArchitect;
