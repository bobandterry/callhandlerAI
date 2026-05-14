"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  STAGES,
  TOTAL_STAGES,
  getTagsAtStage,
  getResourcesAtStage,
  getTranscriptAtStage,
} from "@/lib/call-handler-data";
import { HeaderBar } from "./HeaderBar";
import { TranscriptPanel } from "./TranscriptPanel";
import { ExpertGuidancePanel } from "./ExpertGuidancePanel";
import { ClassificationPanel } from "./ClassificationPanel";
import { RecommendedResourcesPanel } from "./RecommendedResourcesPanel";
import { AnnotationOverlay } from "./AnnotationOverlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CallHandlerDashboard() {
  const [currentStage, setCurrentStage] = useState(0);
  const [panelProcessing, setPanelProcessing] = useState({
    guidance: false,
    classification: false,
    resources: false,
  });
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [updatedTagIds, setUpdatedTagIds] = useState<Set<string>>(new Set());

  const isProcessing =
    panelProcessing.guidance ||
    panelProcessing.classification ||
    panelProcessing.resources;

  const advanceStage = () => {
    if (currentStage >= TOTAL_STAGES - 1 || isProcessing) return;

    const nextStage = currentStage + 1;
    const incomingUpdates = new Set(
      STAGES[nextStage].classificationUpdates.map((u) => u.id)
    );

    setPanelProcessing({ guidance: true, classification: false, resources: false });
    const t1 = setTimeout(
      () => setPanelProcessing((p) => ({ ...p, classification: true })),
      150
    );
    const t2 = setTimeout(
      () => setPanelProcessing((p) => ({ ...p, resources: true })),
      300
    );

    const t3 = setTimeout(() => {
      setCurrentStage(nextStage);
      setUpdatedTagIds(incomingUpdates);
      setPanelProcessing({ guidance: false, classification: false, resources: false });
      setToastMessage(STAGES[nextStage].toastSummary);
      setShowToast(true);
    }, 400);

    const t4 = setTimeout(() => setShowToast(false), 3900);
    const t5 = setTimeout(() => setUpdatedTagIds(new Set()), 1600);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowRight" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        advanceStage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const transcript = getTranscriptAtStage(currentStage);
  const guidanceCards = STAGES[currentStage].guidanceCards;
  const tags = getTagsAtStage(currentStage);
  const resources = getResourcesAtStage(currentStage);

  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <div ref={headerRef}>
        <HeaderBar
          currentStage={currentStage}
          totalStages={TOTAL_STAGES}
          elapsedSeconds={elapsedSeconds}
          isProcessing={isProcessing}
          showAnnotations={showAnnotations}
          onNextStage={advanceStage}
          onToggleAnnotations={() => setShowAnnotations((v) => !v)}
        />
      </div>

      {/* Desktop layout — hidden on mobile */}
      <div className="relative hidden flex-1 overflow-hidden md:flex">
        {/* Left: Transcript ~20% */}
        <aside className="flex w-[20%] min-w-[200px] flex-col overflow-hidden border-r border-border">
          <TranscriptPanel
            lines={transcript}
            currentStage={currentStage}
            isProcessing={panelProcessing.guidance}
          />
        </aside>

        {/* Centre: Expert Guidance ~45% */}
        <main className="flex flex-1 flex-col overflow-hidden border-r border-border">
          <ExpertGuidancePanel
            cards={guidanceCards}
            currentStage={currentStage}
            isProcessing={panelProcessing.guidance}
          />
        </main>

        {/* Right: Classification + Recommendations ~35% */}
        <aside className="flex w-[35%] min-w-[280px] flex-col overflow-hidden">
          <div className="max-h-[45%] overflow-y-auto border-b border-border shrink-0">
            <ClassificationPanel
              tags={tags}
              isProcessing={panelProcessing.classification}
              updatedTagIds={updatedTagIds}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <RecommendedResourcesPanel
              resources={resources}
              isProcessing={panelProcessing.resources}
            />
          </div>
        </aside>

        <AnnotationOverlay isVisible={showAnnotations} />
      </div>

      {/* Mobile layout — shown below md */}
      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        <Tabs defaultValue="guidance" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="mx-3 mt-2 grid grid-cols-3 shrink-0">
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="guidance">Guidance</TabsTrigger>
            <TabsTrigger value="classification">AI Panels</TabsTrigger>
          </TabsList>
          <TabsContent value="transcript" className="flex-1 overflow-hidden mt-0">
            <TranscriptPanel
              lines={transcript}
              currentStage={currentStage}
              isProcessing={panelProcessing.guidance}
            />
          </TabsContent>
          <TabsContent value="guidance" className="flex-1 overflow-hidden mt-0">
            <ExpertGuidancePanel
              cards={guidanceCards}
              currentStage={currentStage}
              isProcessing={panelProcessing.guidance}
            />
          </TabsContent>
          <TabsContent value="classification" className="flex-1 overflow-y-auto mt-0">
            <div className="border-b border-border">
              <ClassificationPanel
                tags={tags}
                isProcessing={panelProcessing.classification}
                updatedTagIds={updatedTagIds}
              />
            </div>
            <RecommendedResourcesPanel
              resources={resources}
              isProcessing={panelProcessing.resources}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-5 right-5 z-50 max-w-xs rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              What changed
            </p>
            <p className="mt-0.5 text-sm text-foreground">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
