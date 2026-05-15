"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, FileText, MessageSquare, Tags } from "lucide-react";
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
import { PanelOverlayCard } from "./PanelOverlayCard";
import { DataFlowBanner } from "./DataFlowBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PANEL_DESCRIPTIONS = {
  transcript:
    "A live rolling transcript of the call between the handler and caller. Each line is added as the conversation progresses — the three AI panels on the right are driven by this transcript in real time.",
  guidance:
    "Suggested questions, communication approaches, and safety prompts drawn from Refuge's knowledge base. Cards update with each stage of the call to keep the handler supported throughout.",
  classification:
    "Real-time AI-generated tags identifying risk factors, abuse types, and caller indicators. Updates automatically as new information emerges. Severity assessment always remains with the handler.",
  resources:
    "Local services, referral pathways, and practical tools surfaced based on the call classification. Includes emergency accommodation, specialist referrals, and support organisations where relevant.",
  aiPanels:
    "Two AI panels in one view: Call Classification (risk factor tags) and Recommended Resources (local services and referrals). Both update automatically as the call develops.",
};

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
  const [revealedPanels, setRevealedPanels] = useState<Set<string>>(new Set());

  const allRevealed =
    revealedPanels.has("transcript") &&
    revealedPanels.has("guidance") &&
    revealedPanels.has("classification") &&
    revealedPanels.has("resources");

  const handleReveal = (...ids: string[]) => {
    setRevealedPanels((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const isProcessing =
    panelProcessing.guidance ||
    panelProcessing.classification ||
    panelProcessing.resources;

  const advanceStage = () => {
    if (currentStage >= TOTAL_STAGES - 1 || isProcessing || !allRevealed) return;

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
      if (e.key === "ArrowRight" && !e.metaKey && !e.ctrlKey && !e.altKey) {
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
          onToggleAnnotations={() => setShowAnnotations((v) => !v)}
        />
      </div>

      <DataFlowBanner isVisible={!allRevealed} />

      {/* Desktop layout — hidden on mobile */}
      <div className="relative hidden flex-1 overflow-hidden md:flex">
        {/* Left: Transcript ~20% */}
        <aside className="relative flex w-[20%] min-w-[200px] flex-col overflow-hidden border-r border-border">
          <TranscriptPanel
            lines={transcript}
            currentStage={currentStage}
            isProcessing={panelProcessing.guidance}
            isLastStage={currentStage >= TOTAL_STAGES - 1}
            canAdvance={allRevealed}
            onNextStage={advanceStage}
          />
          <PanelOverlayCard
            icon={<MessageSquare className="h-5 w-5" />}
            title="Call Transcript"
            description={PANEL_DESCRIPTIONS.transcript}
            isRevealed={revealedPanels.has("transcript")}
            onReveal={() => handleReveal("transcript")}
          />
        </aside>

        {/* Centre: Expert Guidance ~45% */}
        <main className="relative flex flex-1 flex-col overflow-hidden border-r border-border">
          <ExpertGuidancePanel
            cards={guidanceCards}
            currentStage={currentStage}
            isProcessing={panelProcessing.guidance}
          />
          <PanelOverlayCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Expert Guidance"
            description={PANEL_DESCRIPTIONS.guidance}
            isRevealed={revealedPanels.has("guidance")}
            onReveal={() => handleReveal("guidance")}
          />
        </main>

        {/* Right: Classification + Recommendations ~35% */}
        <aside className="flex w-[35%] min-w-[280px] flex-col overflow-hidden">
          <div className="relative max-h-[45%] overflow-y-auto border-b border-border shrink-0">
            <ClassificationPanel
              tags={tags}
              isProcessing={panelProcessing.classification}
              updatedTagIds={updatedTagIds}
            />
            <PanelOverlayCard
              icon={<Tags className="h-5 w-5" />}
              title="Call Classification"
              description={PANEL_DESCRIPTIONS.classification}
              isRevealed={revealedPanels.has("classification")}
              onReveal={() => handleReveal("classification")}
            />
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <RecommendedResourcesPanel
              resources={resources}
              isProcessing={panelProcessing.resources}
            />
            <PanelOverlayCard
              icon={<FileText className="h-5 w-5" />}
              title="Recommended Resources"
              description={PANEL_DESCRIPTIONS.resources}
              isRevealed={revealedPanels.has("resources")}
              onReveal={() => handleReveal("resources")}
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
          <TabsContent value="transcript" className="relative flex-1 overflow-hidden mt-0">
            <TranscriptPanel
              lines={transcript}
              currentStage={currentStage}
              isProcessing={panelProcessing.guidance}
              isLastStage={currentStage >= TOTAL_STAGES - 1}
              canAdvance={allRevealed}
              onNextStage={advanceStage}
            />
            <PanelOverlayCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Call Transcript"
              description={PANEL_DESCRIPTIONS.transcript}
              isRevealed={revealedPanels.has("transcript")}
              onReveal={() => handleReveal("transcript")}
            />
          </TabsContent>
          <TabsContent value="guidance" className="relative flex-1 overflow-hidden mt-0">
            <ExpertGuidancePanel
              cards={guidanceCards}
              currentStage={currentStage}
              isProcessing={panelProcessing.guidance}
            />
            <PanelOverlayCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Expert Guidance"
              description={PANEL_DESCRIPTIONS.guidance}
              isRevealed={revealedPanels.has("guidance")}
              onReveal={() => handleReveal("guidance")}
            />
          </TabsContent>
          <TabsContent value="classification" className="relative flex-1 overflow-y-auto mt-0">
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
            <PanelOverlayCard
              icon={<Tags className="h-5 w-5" />}
              title="AI Support Panels"
              description={PANEL_DESCRIPTIONS.aiPanels}
              isRevealed={
                revealedPanels.has("classification") &&
                revealedPanels.has("resources")
              }
              onReveal={() => handleReveal("classification", "resources")}
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
