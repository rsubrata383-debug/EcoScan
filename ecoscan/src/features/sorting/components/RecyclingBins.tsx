import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, Leaf, Recycle, Trash2, Shield } from 'lucide-react';
import { getBinColor, getBinLabel, getBinDescription } from '@/features/waste/binInfo';
import { PulseRing } from '@/components/common/GlassCard';

interface RecyclingBinsProps {
  onBinSelect: (binType: 'recyclable' | 'organic' | 'non-recyclable' | 'special') => void;
  selectedBin: 'recyclable' | 'organic' | 'non-recyclable' | 'special' | null;
  disabled: boolean;
}

const binsConfig = [
  { type: 'recyclable' as const, icon: Recycle, desc: 'Plastic, paper, metal, glass' },
  { type: 'organic' as const, icon: Leaf, desc: 'Food & biodegradable waste' },
  { type: 'non-recyclable' as const, icon: Trash2, desc: 'Waste that cannot be recycled' },
  { type: 'special' as const, icon: Shield, desc: 'Hazardous / e-waste collection' },
];

export function RecyclingBins({
  onBinSelect,
  selectedBin,
  disabled,
}: RecyclingBinsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 35 }}
      className="fixed bottom-2 left-1/2 z-30 w-full max-w-5xl -translate-x-1/2 px-2 sm:bottom-4 sm:px-4 lg:bottom-6"
    >
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
        {binsConfig.map((bin, index) => {
          const color = getBinColor(bin.type);
          const isSelected = selectedBin === bin.type;
          const isCorrectBin = bin.type === selectedBin && !disabled;

          return (
            <motion.div
              key={bin.type}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.08, type: 'spring', stiffness: 400, damping: 30 }}
              whileHover={!disabled ? { scale: 1.015, y: -3 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
              className={clsx('relative group cursor-pointer', isSelected && !disabled && 'ring-2 ring-offset-2 ring-offset-white')}
              style={isSelected && !disabled ? { boxShadow: `0 0 0 2px ${color}, 0 0 30px ${color}33` } : undefined}
            >
              <motion.button
                disabled={disabled}
                onClick={() => !disabled && onBinSelect(bin.type)}
                className={clsx(
                  'w-full aspect-square relative rounded-[20px] overflow-hidden transition-all duration-300',
                  'flex aspect-[4/3] min-h-24 flex-col items-center justify-center p-1.5 sm:aspect-square sm:p-5 lg:p-6',
                  isSelected && !disabled
                    ? 'border-2'
                    : 'bg-bg-surface border border-line hover-solid',
                  disabled && isCorrectBin
                    ? 'border-2 border-emerald-500/60 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                    : disabled && isSelected && !isCorrectBin
                    ? 'border-2 border-red-500/60 bg-red-500/5'
                    : '',
                )}
                style={{
                  backgroundColor: isSelected && !disabled ? `${color}15` : undefined,
                  borderColor: isSelected && !disabled ? color : undefined,
                  boxShadow: isSelected && !disabled ? `0 0 30px ${color}33` : undefined,
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                    e.preventDefault();
                    onBinSelect(bin.type);
                  }
                }}
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.span
                    animate={isSelected && !disabled ? { scale: [1, 1.05, 1] } : disabled && isCorrectBin ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: disabled && isCorrectBin ? 0.6 : 2, repeat: disabled && isCorrectBin ? 0 : Infinity, ease: 'easeInOut' }}
                    className="mb-1 text-3xl filter drop-shadow-lg sm:mb-3 sm:text-5xl lg:text-6xl"
                    aria-hidden="true"
                  >
                    <bin.icon className="h-7 w-7 sm:h-10 sm:w-10 lg:h-12 lg:w-12" style={{ color }} aria-hidden="true" />
                  </motion.span>

                  <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="break-words font-display text-[0.6rem] font-normal leading-tight text-fg sm:text-lg lg:text-xl"
                    style={isSelected ? { color } : undefined}
                  >
                    {getBinLabel(bin.type)}
                  </motion.h4>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-1 hidden max-w-[20rem] text-center text-xs text-fg-muted sm:block sm:text-sm"
                  >
                    {getBinDescription(bin.type)}
                  </motion.p>
                </div>

                <motion.div
                  animate={isSelected && !disabled ? { scale: [1, 1.02, 1], opacity: [0.15, 0.35, 0.15] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-[20px] pointer-events-none"
                  style={isSelected && !disabled ? { background: `linear-gradient(135deg, transparent, ${color}22, transparent)` } : undefined}
                />

                {isSelected && !disabled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 text-[0.55rem] font-medium text-bg sm:bottom-4 sm:px-3 sm:py-1.5 sm:text-xs"
                    style={{ backgroundColor: color }}
                  >
                    TAP TO SELECT
                  </motion.div>
                )}

                {disabled && isCorrectBin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/10"
                  >
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 filter drop-shadow-lg" aria-hidden="true" />
                  </motion.div>
                )}

                {disabled && isSelected && !isCorrectBin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: 180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/10"
                  >
                    <XCircle className="w-14 h-14 text-red-500 filter drop-shadow-lg" aria-hidden="true" />
                  </motion.div>
                )}

                {disabled && isCorrectBin && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-2 -right-2"
                    >
                      <PulseRing size={36} color="green" count={2} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Correct Bin
                    </motion.div>
                  </>
                )}

                {disabled && isSelected && !isCorrectBin && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium"
                  >
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                    Correct: {getBinLabel(binsConfig.find((b) => b.type === selectedBin)?.type || 'recyclable')}
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}