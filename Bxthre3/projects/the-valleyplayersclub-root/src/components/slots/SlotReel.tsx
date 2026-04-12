import { AnimatePresence, motion } from 'framer-motion';
import { SlotSymbol } from './SlotSymbol';
import { SlotThemeRegistry } from './SlotThemeRegistry';

interface SlotReelProps {
  reelIndex: number;
  visibleSymbols: string[];
  isSpinning: boolean;
  themeId: string;
  rows: number;
  delay?: number;
  highlightedRows: number[];
}

const SlotReel: React.FC<SlotReelProps> = ({ 
  visibleSymbols, 
  isSpinning, 
  themeId, 
  rows,
  delay = 0,
  highlightedRows 
}) => {
  const currentTheme = SlotThemeRegistry.getTheme(themeId);
  return (
    <div className="slot-reel-container">
      <AnimatePresence mode="popLayout">
        {visibleSymbols.map((symbolId, rowIndex) => (
          <motion.div
            key={`${rowIndex}-${symbolId}`}
            initial={isSpinning ? { y: -100, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: delay
            }}
            className="slot-cell-wrapper"
            style={{ height: `${100 / rows}%` }}
          >
            <SlotSymbol 
              id={symbolId} 
              themeId={themeId} 
              isWinning={highlightedRows.includes(rowIndex)} 
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <style>{`
        .slot-reel-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 12px;
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .slot-cell-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default SlotReel;
