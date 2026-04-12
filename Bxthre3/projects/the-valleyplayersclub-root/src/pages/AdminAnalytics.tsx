import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { Activity, Thermometer, Map, TrendingUp } from 'lucide-react';

interface ClusterData {
  user_id: string;
  payday_score: number;
  rage_click_count: number;
  avg_tap_speed: number;
  updated_at: string;
}

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
}

export default function AdminAnalytics() {
  const { send, lastMessage } = useSocket();
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initial fetch
    send('analytics:fetch_dashboard', {});

    // Poll for updates (Real-time Simulation)
    const interval = setInterval(() => {
      send('analytics:fetch_dashboard', {});
    }, 5000);

    return () => clearInterval(interval);
  }, [send]);

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === 'analytics:dashboard_data') {
      setClusters(lastMessage.data.clusters);
      setHeatmap(lastMessage.data.heatmap);
    }
  }, [lastMessage]);

  // Draw Heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || heatmap.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    heatmap.forEach(point => {
      const radius = 20;
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      
      const alpha = Math.min(point.intensity / 50, 0.8);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [heatmap]);

  return (
    <div className="admin-container" style={{ padding: '24px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'white' }}>
      <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Activity size={32} color="var(--accent-secondary)" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Psychological Analytics <span style={{ color: 'var(--accent-secondary)' }}>DEEP DIVE</span></h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Heatmap Section */}
        <section className="card" style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Map size={24} color="#00e676" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Interaction Heatmap</h2>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '400px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden' }}>
            <canvas 
               ref={canvasRef} 
               width={800} 
               height={400} 
               style={{ width: '100%', height: '100%' }}
            />
            <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.8rem', color: '#666' }}>
              Overlaying Tap Density
            </div>
          </div>
        </section>

        {/* Sentiment & Clusters Section */}
        <section className="card" style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Thermometer size={24} color="#ff1744" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Player Psychology Clusters</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {clusters.map((cluster, idx) => (
              <motion.div 
                key={cluster.user_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '16px', 
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: `4px solid ${cluster.payday_score > 0.7 ? '#ffd600' : '#4dabf5'}`
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{cluster.user_id}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Last Updated: {new Date(cluster.updated_at).toLocaleTimeString()}</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Archetype</div>
                    <div style={{ fontWeight: 800, color: '#4dabf5' }}>{(cluster as any).behavioral_archetype || 'Unknown'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Payday Confidence</div>
                    <div style={{ fontWeight: 800, color: '#ffd600' }}>{(cluster.payday_score * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Rage Level</div>
                    <div style={{ fontWeight: 800, color: '#ff1744' }}>{cluster.rage_click_count > 5 ? 'CRITICAL' : cluster.rage_click_count > 2 ? 'ELEVATED' : 'STABLE'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Avg Velocity</div>
                    <div style={{ fontWeight: 800, color: '#00e676' }}>{((cluster as any).avg_tap_speed || 0).toFixed(2)}px/ms</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Real-time Ingestion Feed */}
        <section className="card" style={{ gridColumn: 'span 2', padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <TrendingUp size={24} color="var(--accent-secondary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Live Telemetry Pulse</h2>
           </div>
           <div style={{ height: '60px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e676', fontFamily: 'monospace' }}>
              {"[SIGNAL] High Intensity Tap @ 412x298 | User: demo-user-123 | Latency: 42ms"}
           </div>
        </section>

      </div>
    </div>
  );
}
