
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorators */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'var(--grad-glow)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.15), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(138, 43, 226, 0.15)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} color="var(--accent-secondary)" />
            The Next Generation Of Gaming
          </span>

          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 800,
            marginBottom: '24px',
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}>
            Where Luck Meets <br />
            <span className="text-gradient" style={{ paddingBottom: '10px' }}>Pure Skill</span>
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6
          }}>
            Experience the thrill of dynamic slot machines and competitive skill-based games. 
            Win big with strategy, reflexes, or pure chance in the ultimate gaming arena.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/slots" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              <Play size={20} />
              Play Slots
            </Link>
            <Link to="/skills" className="btn btn-secondary" style={{ padding: '16px 32px' }}>
              <Gamepad2 size={20} />
              Skill Arena
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Simple stub for missing import Gamepad2
import { Gamepad2 } from 'lucide-react';

export default Hero;
