"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BookOpen, Info } from "lucide-react";
import { type GuidanceCard, KNOWLEDGE_BASE_DOMAINS } from "@/lib/call-handler-data";
import { cn } from "@/lib/utils";

interface ExpertGuidancePanelProps {
  cards: GuidanceCard[];
  currentStage: number;
  isProcessing: boolean;
}

export function ExpertGuidancePanel({
  cards,
  currentStage,
  isProcessing,
}: ExpertGuidancePanelProps) {
  return (
    <motion.div
      animate={{ opacity: isProcessing ? [1, 0.5, 1] : 1 }}
      transition={{
        duration: 0.4,
        repeat: isProcessing ? Infinity : 0,
        ease: "easeInOut",
      }}
      className="flex h-full flex-col"
    >
      {/* Panel header */}
      <div className="shrink-0 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Expert Guidance
          </h2>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Drawn from Refuge knowledge base — reviewed by trauma specialists
        </p>
      </div>

      {/* Knowledge base domains legend */}
      <div className="shrink-0 border-b border-border bg-muted/40 px-5 py-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {KNOWLEDGE_BASE_DOMAINS.map((domain) => (
            <span
              key={domain}
              className="text-[10px] font-medium text-muted-foreground"
            >
              {domain}
            </span>
          ))}
        </div>
      </div>

      {/* Guidance cards */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {cards.map((card, index) => (
              <GuidanceCardItem
                key={card.id}
                card={card}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function GuidanceCardItem({
  card,
  index,
}: {
  card: GuidanceCard;
  index: number;
}) {
  const isOutsideKB = card.isOutsideKnowledgeBase === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.22 }}
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isOutsideKB
          ? "border-alert-amber bg-amber-50/60"
          : "border-border bg-card"
      )}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          {isOutsideKB ? (
            <AlertTriangle className="h-4 w-4 text-alert-amber" />
          ) : (
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
              <span className="text-[9px] font-bold text-primary">
                {index + 1}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          {isOutsideKB && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-alert-amber">
                Outside knowledge base
              </span>
            </div>
          )}
          <p
            className={cn(
              "text-sm leading-relaxed",
              isOutsideKB ? "text-foreground" : "text-foreground"
            )}
          >
            {card.prompt}
          </p>
          <div className="flex items-start gap-1 mt-0.5">
            <Info className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground/50" />
            <p
              className={cn(
                "text-[11px] leading-relaxed",
                isOutsideKB
                  ? "text-alert-amber/80"
                  : "text-muted-foreground"
              )}
            >
              {card.citation}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
