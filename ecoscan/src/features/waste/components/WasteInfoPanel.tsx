import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GlassCard } from '@/components/common/GlassCard';
import type { WasteResult } from '@/features/waste/types';
import { getBinColor, getBinLabel, getBinIcon, getBinDescription } from '@/features/waste/binInfo';

interface WasteInfoPanelProps {
  result: WasteResult;
  onClose: () => void;
  isMobile?: boolean;
}

export function WasteInfoPanel({ result, onClose, isMobile }: WasteInfoPanelProps) {
  const binColor = getBinColor(result.bin);
  const binLabel = getBinLabel(result.bin);
  const binIcon = getBinIcon(result.bin);
  const isSpecial = result.bin === 'special';

  const categoryLabels: Record<string, string> = {
    Plastic: 'Plastic',
    Organic: 'Organic',
    'E-Waste': 'E-Waste',
    Paper: 'Paper',
    Metal: 'Metal',
    Glass: 'Glass',
    Other: 'Other',
  };

  if (isMobile) {
    return (
      <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
        <SheetContent
          side="bottom"
          aria-labelledby="waste-title"
          showCloseButton={false}
          className="max-h-[85vh] gap-0 overflow-hidden rounded-t-[22px] border-0 bg-bg p-0 shadow-none"
        >
          <div className="flex flex-col h-full bg-bg">
            <div className="flex items-center justify-center px-4 py-4 border-b border-line">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-10 h-1.5 rounded-full bg-fg/20"
              />
            </div>

            <GlassCard variant="elevated" className="flex-1 flex flex-col overflow-hidden relative rounded-none border-b-0">
              <div className="flex items-start justify-between p-4 lg:p-6 border-b border-line relative z-10">
                <div className="flex-1 min-w-0 pr-4">
                  <motion.h2
                    id="waste-title"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-2xl lg:text-3xl font-normal text-fg truncate"
                  >
                    {result.itemName}
                  </motion.h2>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                      <Badge variant="success" size="sm" dot>{categoryLabels[result.category]}</Badge>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: 'spring' }}>
                      <Badge variant={isSpecial ? 'warning' : 'success'} size="sm" dot>
                        <AlertTriangle className="w-3 h-3" /> {binLabel}
                      </Badge>
                    </motion.div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-fg/5 text-fg-muted hover-solid flex-shrink-0"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: `${binColor}15`, border: `1px solid ${binColor}30` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${binColor}25` }}>
                    <span className="text-3xl">{binIcon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-fg-dim uppercase tracking-wider">Recommended Bin</p>
                    <p className="font-medium text-fg text-lg" style={{ color: binColor }}>{binLabel}</p>
                    <p className="text-fg-muted text-xs mt-0.5">{getBinDescription(result.bin)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-fg-dim uppercase tracking-wider">AI Tip</p>
                  <p className="text-fg-muted text-sm leading-relaxed">{result.tip}</p>
                </motion.div>

                {isSpecial && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl border border-amber-primary/20 bg-amber-primary/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-amber-primary text-sm">Special Disposal Required</p>
                        <p className="text-fg-muted text-xs mt-1">{result.tip}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }} modal={false}>
      <SheetContent
        side="right"
        aria-labelledby="waste-title"
        showCloseButton={false}
        overlayClassName="pointer-events-none bg-transparent backdrop-blur-0"
        className="data-[side=right]:inset-y-16 data-[side=right]:right-2 data-[side=right]:h-auto data-[side=right]:w-[min(22rem,calc(100vw-1rem))] data-[side=right]:sm:right-4 data-[side=right]:sm:w-80 data-[side=right]:lg:right-6 data-[side=right]:lg:w-96 data-[side=right]:sm:max-w-none gap-0 overflow-hidden border-0 bg-transparent p-0 text-fg shadow-none"
      >
        <GlassCard variant="elevated" className="flex flex-col h-full relative">
          <div className="flex items-start justify-between p-4 lg:p-6 border-b border-line relative z-10">
            <div className="flex-1 min-w-0">
              <motion.h2
                id="waste-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl lg:text-3xl font-normal text-fg truncate"
              >
                {result.itemName}
              </motion.h2>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                  <Badge variant="success" size="sm" dot>{categoryLabels[result.category]}</Badge>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: 'spring' }}>
                  <Badge variant={isSpecial ? 'warning' : 'success'} size="sm" dot>
                    <AlertTriangle className="w-3 h-3" /> {binLabel}
                  </Badge>
                </motion.div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-fg/5 text-fg-muted hover-solid flex-shrink-0"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: `${binColor}15`, border: `1px solid ${binColor}30` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${binColor}25` }}>
                <span className="text-3xl">{binIcon}</span>
              </div>
              <div>
                <p className="text-xs text-fg-dim uppercase tracking-wider">Recommended Bin</p>
                <p className="font-medium text-fg text-lg" style={{ color: binColor }}>{binLabel}</p>
                <p className="text-fg-muted text-xs mt-0.5">{getBinDescription(result.bin)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <p className="text-xs text-fg-dim uppercase tracking-wider">AI Tip</p>
              <p className="text-fg-muted text-sm leading-relaxed">{result.tip}</p>
            </motion.div>

            {isSpecial && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl border border-amber-primary/20 bg-amber-primary/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-primary text-sm">Special Disposal Required</p>
                    <p className="text-fg-muted text-xs mt-1">{result.tip}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </SheetContent>
    </Sheet>
  );
}