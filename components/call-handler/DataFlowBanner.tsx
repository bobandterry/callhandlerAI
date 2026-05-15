"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface DataFlowBannerProps {
  isVisible: boolean;
}

export function DataFlowBanner({ isVisible }: DataFlowBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden border-b border-primary/20 bg-primary/5 shrink-0"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              Reveal each panel to explore the dashboard — then begin the scenario
            </span>
            <span className="hidden text-muted-foreground/30 sm:inline">·</span>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-[11px] font-semibold text-foreground">
                Call Transcript
              </span>
              <ArrowRight className="h-3 w-3 text-primary" />
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Expert Guidance
              </span>
              <span className="text-muted-foreground/30 text-[10px]">+</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Call Classification
              </span>
              <span className="text-muted-foreground/30 text-[10px]">+</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Recommended Resources
              </span>
              <span className="text-[11px] text-muted-foreground/60">
                — all populated in real time from the transcript
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
