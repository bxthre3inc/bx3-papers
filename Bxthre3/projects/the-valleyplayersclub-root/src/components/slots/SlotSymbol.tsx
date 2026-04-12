import { motion } from 'framer-motion';
import { SlotThemeRegistry } from './SlotThemeRegistry';

interface SlotSymbolProps {
  id: string;
  themeId: string;
  isWinning?: boolean;
}

export const SlotSymbol: React.FC<SlotSymbolProps> = ({ id, themeId, isWinning }) => {
  const currentTheme = SlotThemeRegistry.getTheme(themeId);
  const symbol = currentTheme.symbols[id] || currentTheme.symbols['BLANK'];
  
  // Use custom SVG if provided, otherwise use Icon component
  const SymbolIcon = symbol.icon;

  return (
    <motion.div
      className={`slot-symbol ${symbol.className} ${isWinning ? 'winning-highlight' : ''}`}
      animate={isWinning ? {
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
        filter: [
          `brightness(1) drop-shadow(0 0 5px ${symbol.color})`,
          `brightness(1.5) drop-shadow(0 0 20px ${symbol.color})`,
          `brightness(1) drop-shadow(0 0 5px ${symbol.color})`
        ]
      } : {}}
      transition={{ duration: 0.5, repeat: isWinning ? Infinity : 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
        color: symbol.color
      }}
    >
      {symbol.svg ? (
        <div 
          dangerouslySetInnerHTML={{ __html: symbol.svg }} 
          style={{ width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      ) : (
        <SymbolIcon size={40} strokeWidth={1.5} />
      )}
      
      <style>{`
        .slot-symbol {
          transition: all 0.3s ease;
        }
        .neon-pink { color: #ff00ff; filter: drop-shadow(0 0 8px #ff00ff); }
        .neon-yellow { color: #ffff00; filter: drop-shadow(0 0 8px #ffff00); }
        .neon-blue { color: #00ffff; filter: drop-shadow(0 0 8px #00ffff); }
        .neon-green { color: #00ff00; filter: drop-shadow(0 0 8px #00ff00); }
        .neon-purple { color: #8a2be2; filter: drop-shadow(0 0 8px #8a2be2); }
        
        .classic-red { color: #ff1a1a; }
        .classic-gold { color: #ffd700; }
        .classic-white { color: #ffffff; }

        .winning-highlight {
          z-index: 10;
        }
      `}</style>
    </motion.div>
  );
};
