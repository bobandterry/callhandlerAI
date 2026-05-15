"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type TranscriptLine } from "@/lib/call-handler-data";
import { cn } from "@/lib/utils";

interface TranscriptPanelProps {
  lines: TranscriptLine[];
  currentStage: number;
  isProcessing: boolean;
  isLastStage: boolean;
  canAdvance: boolean;
  onNextStage: () => void;
}

export function TranscriptPanel({
  lines,
  currentStage,
  isProcessing,
  isLastStage,
  canAdvance,
  onNextStage,
}: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

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
      <div className="shrink-0 border-b border-border px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Call Transcript
        </p>
        <p className="text-[10px] text-muted-foreground/70">Case #LDN-4471</p>
      </div>

      {/* Scrollable transcript */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.div
                key={line.id}
                initial={
                  line.stageIndex === currentStage
                    ? { opacity: 0, y: 10 }
                    : false
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {/* Stage divider */}
                {line === lines.find((l) => l.stageIndex === line.stageIndex) &&
                  line.stageIndex > 0 && (
                    <div className="mb-2.5 flex items-center gap-2">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">
                        Stage {line.stageIndex + 1}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}

                <div
                  className={cn(
                    "flex flex-col gap-0.5",
                    line.speaker === "caller" ? "items-start" : "items-end"
                  )}
                >
                  <span
                    className={cn(
                      "text-[9px] font-semibold uppercase tracking-wide",
                      line.speaker === "caller"
                        ? "text-muted-foreground"
                        : "text-primary/70"
                    )}
                  >
                    {line.speaker === "caller" ? "Caller" : "Handler"}
                  </span>
                  <div
                    className={cn(
                      "max-w-[90%] rounded-lg px-2.5 py-1.5 text-xs leading-relaxed",
                      line.speaker === "caller"
                        ? "bg-muted text-foreground"
                        : "bg-primary/10 text-foreground"
                    )}
                  >
                    {line.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Continue conversation button */}
      <div className="shrink-0 border-t border-border p-3">
        <Button
          onClick={onNextStage}
          disabled={isProcessing || isLastStage || !canAdvance}
          size="sm"
          className={cn(
            "w-full gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40",
            isLastStage && "opacity-30"
          )}
        >
          {isLastStage ? (
            <span className="text-xs">Call complete</span>
          ) : (
            <>
              <span className="text-xs">Continue conversation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
