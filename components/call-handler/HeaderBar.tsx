"use client";

import { motion } from "framer-motion";
import { Info, Radio, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CASE_REF } from "@/lib/call-handler-data";
import { formatDuration } from "@/lib/call-handler-data";
import { cn } from "@/lib/utils";

interface HeaderBarProps {
  currentStage: number;
  totalStages: number;
  elapsedSeconds: number;
  isProcessing: boolean;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
}

export function HeaderBar({
  currentStage,
  totalStages,
  elapsedSeconds,
  isProcessing,
  showAnnotations,
  onToggleAnnotations,
}: HeaderBarProps) {

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-sidebar px-4">
      {/* Left: case info */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <motion.span
            className="inline-block h-2 w-2 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Live
          </span>
        </div>

        <div className="h-4 w-px bg-sidebar-foreground/20" />

        {/* Case ref */}
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-sidebar-foreground/60" />
          <span className="font-mono text-sm font-medium text-sidebar-foreground">
            Case {CASE_REF}
          </span>
        </div>

        {/* Duration */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="text-xs text-sidebar-foreground/50">Duration</span>
          <span className="font-mono text-sm font-medium tabular-nums text-sidebar-foreground">
            {formatDuration(elapsedSeconds)}
          </span>
        </div>

        {/* Stage indicator */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="text-xs text-sidebar-foreground/50">Stage</span>
          <span className="text-sm font-semibold text-sidebar-foreground">
            {currentStage + 1}
            <span className="font-normal text-sidebar-foreground/50">
              {" "}
              / {totalStages}
            </span>
          </span>
        </div>
      </div>

      {/* Right: controls + label */}
      <div className="flex items-center gap-3">
        {/* Handler-only label — always visible */}
        <div className="flex items-center gap-1.5 rounded border border-sidebar-foreground/20 px-2 py-1">
          <ShieldAlert className="h-3 w-3 text-sidebar-foreground/60" />
          <span className="text-[11px] font-medium text-sidebar-foreground/80">
            Visible to handler only
          </span>
        </div>

        {/* Annotation toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAnnotations}
          className={cn(
            "h-8 gap-1.5 text-xs text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
            showAnnotations && "bg-sidebar-foreground/15 text-sidebar-foreground"
          )}
          title="How these work together"
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">How these work together</span>
        </Button>

      </div>
    </header>
  );
}
