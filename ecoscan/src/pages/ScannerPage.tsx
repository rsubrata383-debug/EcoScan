import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CameraView } from "@/features/scanner/components/CameraView";
import { ScanStatus } from "@/features/scanner/components/ScanStatus";
import { WasteInfoPanel } from "@/features/waste/components/WasteInfoPanel";
import { RecyclingBins } from "@/features/sorting/components/RecyclingBins";
import { SuccessAnimation } from "@/features/sorting/components/SuccessAnimation";
import {
  getStatus,
  scanImage,
  getDemoItems,
  getDemoResult,
  ApiError,
} from "@/lib/api";
import { resizeImage } from "@/lib/image";
import type { WasteResult, DemoItem } from "@/features/waste/types";
import { useNavbarConfig } from "@/context/NavbarContext";

type ScannerState = "idle" | "scanning" | "result" | "answered" | "error";

const POINTS_PER_CORRECT = 10;
const POINTS_KEY = "ecoscan_points";

export function ScannerPage() {
  const navigate = useNavigate();
  const { setConfig } = useNavbarConfig();
  const [state, setState] = useState<ScannerState>("idle");
  const [currentResult, setCurrentResult] = useState<WasteResult | null>(null);
  const [ecoPoints, setEcoPoints] = useState(() => {
    try {
      const saved = localStorage.getItem(POINTS_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [aiEnabled, setAiEnabled] = useState(true);
  const [selectedBin, setSelectedBin] = useState<
    "recyclable" | "organic" | "non-recyclable" | "special" | null
  >(null);
  const [resultCorrect, setResultCorrect] = useState<boolean | null>(null);
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const [demoItems, setDemoItems] = useState<DemoItem[]>([]);
  const [errorToastId, setErrorToastId] = useState<string | number | null>(
    null,
  );

  useEffect(() => {
    setConfig({
      onScanClick: () => setState("idle"),
      onHomeClick: () => navigate("/"),
      ecoPoints,
      showPoints: true,
      isScannerPage: true,
    });
  }, [navigate, setConfig, ecoPoints]);

  useEffect(() => {
    getStatus()
      .then((res) => setAiEnabled(res.aiEnabled))
      .catch(() => setAiEnabled(false));
    getDemoItems()
      .then(setDemoItems)
      .catch(() => setDemoItems([]));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(POINTS_KEY, ecoPoints.toString());
    } catch {
      // ignore
    }
  }, [ecoPoints]);

  const handleCloseError = useCallback(() => {
    if (errorToastId !== null) {
      toast.dismiss(errorToastId);
      setErrorToastId(null);
    }
  }, [errorToastId]);

  const handleScanError = useCallback(
    (message: string) => {
      handleCloseError();
      setState("error");
      const id = toast.custom(
        (id) => (
          <GlassCard
            variant="elevated"
            className="w-[calc(100vw-2rem)] max-w-[28rem] p-4 border-red-primary/30 bg-red-primary/10"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-primary/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-primary">Error</p>
                <p className="text-fg-muted text-sm mt-1">{message}</p>
              </div>
              <motion.button
                onClick={() => {
                  toast.dismiss(id);
                  handleCloseError();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-fg-muted hover:text-fg"
                aria-label="Dismiss error"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </GlassCard>
        ),
        { duration: Infinity, position: "bottom-center" },
      );
      setErrorToastId(id);
    },
    [handleCloseError],
  );

  const handleCapture = useCallback(
    async (blob: Blob) => {
      if (state !== "idle") return;
      setState("scanning");
      try {
        const resized = await resizeImage(blob);
        const result = await scanImage(resized);
        if (result.itemName === "Unknown") {
          setCurrentResult(result);
          setState("result");
        } else {
          setCurrentResult(result);
          setState("result");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          handleScanError(err.message);
        } else {
          handleScanError("An unexpected error occurred");
        }
      }
    },
    [state, handleScanError],
  );

  const handleDemoSelect = useCallback(
    async (id: string) => {
      if (state !== "idle") return;
      setShowDemoSelector(false);
      setState("scanning");
      try {
        const result = await getDemoResult(id);
        setCurrentResult(result);
        setState("result");
      } catch (err) {
        if (err instanceof ApiError) {
          handleScanError(err.message);
        } else {
          handleScanError("Failed to load demo item");
        }
      }
    },
    [state, handleScanError],
  );

  const handleBinSelect = useCallback(
    (binType: "recyclable" | "organic" | "non-recyclable" | "special") => {
      if (!currentResult || state !== "result") return;
      setSelectedBin(binType);
      const isCorrect = binType === currentResult.bin;
      setResultCorrect(isCorrect);

      if (isCorrect) {
        const newPoints = ecoPoints + POINTS_PER_CORRECT;
        setEcoPoints(newPoints);
      }
      setState("answered");
    },
    [currentResult, state, ecoPoints],
  );

  const handleRetry = useCallback(() => {
    setSelectedBin(null);
    setResultCorrect(null);
    setCurrentResult(null);
    setState("idle");
  }, []);

  const handleContinue = useCallback(() => {
    setSelectedBin(null);
    setResultCorrect(null);
    setCurrentResult(null);
    setState("idle");
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <motion.section
        id="scanner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pb-4 px-4"
      >
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CameraView
                onCapture={handleCapture}
                onError={handleScanError}
                isScanning={state === "scanning"}
                demoMode={!aiEnabled}
                onDemoOpen={() => setShowDemoSelector(true)}
              />
            </div>

            <div className="lg:col-span-1 flex flex-col gap-4">
              <GlassCard variant="elevated" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Scan Status</h2>
                  <Badge
                    variant={aiEnabled ? "success" : "warning"}
                    size="sm"
                    dot
                  >
                    {aiEnabled ? "AI ACTIVE" : "DEMO MODE"}
                  </Badge>
                </div>
                <ScanStatus
                  status={state === "scanning" ? "detecting" : "idle"}
                />

                <div className="mt-6 pt-4 border-t border-line space-y-3">
                  <p className="text-fg-muted text-sm">
                    Take a photo or upload an image to scan
                  </p>
                  {!aiEnabled && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setShowDemoSelector(true)}
                      leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Try Demo Object
                    </Button>
                  )}
                </div>
              </GlassCard>

              <GlassCard variant="subtle" className="p-5">
                <h3 className="font-semibold mb-3">How It Works</h3>
                <ol className="space-y-2 text-fg-muted text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">
                      1
                    </span>
                    Take or upload a photo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">
                      2
                    </span>
                    AI identifies the item
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">
                      3
                    </span>
                    Tap the correct bin
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">
                      4
                    </span>
                    Earn Eco Points!
                  </li>
                </ol>
              </GlassCard>

              <GlassCard
                variant="subtle"
                className="p-4 text-center text-fg-dim text-xs"
              >
                <p>Photos are sent to Google Gemini for analysis.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {currentResult && (state === "result" || state === "answered") && (
          <WasteInfoPanel
            result={currentResult}
            onClose={handleRetry}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === "result" &&
          currentResult &&
          currentResult.itemName !== "Unknown" && (
            <RecyclingBins
              onBinSelect={handleBinSelect}
              selectedBin={selectedBin}
              disabled={false}
            />
          )}
      </AnimatePresence>

      <AnimatePresence>
        {state === "answered" && currentResult && (
          <SuccessAnimation
            result={currentResult}
            isCorrect={resultCorrect === true}
            selectedBin={selectedBin}
            pointsEarned={resultCorrect ? POINTS_PER_CORRECT : 0}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>

      <Dialog open={showDemoSelector} onOpenChange={setShowDemoSelector}>
        <DialogContent
          aria-labelledby="demo-title"
          showCloseButton={false}
          className="max-h-[85svh] w-[calc(100%-1.5rem)] max-w-[42rem] gap-0 overflow-y-auto rounded-[22px] border border-line bg-bg-surface p-4 text-fg ring-0 sm:w-full sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <DialogTitle
              id="demo-title"
              className="font-display text-2xl font-normal text-fg"
            >
              Select Demo Object
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDemoSelector(false)}
              aria-label="Close demo selector"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {demoItems.map((obj) => (
              <motion.button
                key={obj.id}
                onClick={() => handleDemoSelect(obj.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group p-4 rounded-xl bg-bg-elevated/50 border border-line hover:border-brand/30 hover-solid text-left"
              >
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {obj.icon}
                </div>
                <div className="font-medium text-fg mb-2">{obj.name}</div>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
