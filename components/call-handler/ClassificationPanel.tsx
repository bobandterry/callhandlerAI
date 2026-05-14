"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, HelpCircle, Tags } from "lucide-react";
import { type ClassificationTag } from "@/lib/call-handler-data";
import { cn } from "@/lib/utils";

interface ClassificationPanelProps {
  tags: ClassificationTag[];
  isProcessing: boolean;
  updatedTagIds: Set<string>;
}

const CONFIDENCE_COLOUR = (confidence: number) => {
  if (confidence >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (confidence >= 70) return "text-foreground bg-secondary border-border";
  return "text-alert-amber bg-amber-50 border-amber-200";
};

export function ClassificationPanel({
  tags,
  isProcessing,
  updatedTagIds,
}: ClassificationPanelProps) {
  return (
    <motion.div
      animate={{ opacity: isProcessing ? [1, 0.5, 1] : 1 }}
      transition={{
        duration: 0.4,
        repeat: isProcessing ? Infinity : 0,
        ease: "easeInOut",
      }}
      className="flex flex-col"
    >
      {/* Panel header */}
      <div className="border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Tags className="h-3.5 w-3.5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Call Classification
          </h2>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Auto-updating — severity assessment remains with the handler
        </p>
      </div>

      {/* Non-dismissible severity notice */}
      <div className="flex items-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-alert-amber" />
        <p className="text-[11px] font-medium text-alert-amber">
          Severity: Not assessed by AI — handler responsibility
        </p>
      </div>

      {/* Classification tags */}
      <div className="px-4 py-3">
        {tags.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic">
            Classification will appear as the call develops.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {tags.map((tag, index) => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  index={index}
                  isUpdated={updatedTagIds.has(tag.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Data-flow annotation */}
      <div className="border-t border-border px-4 py-2">
        <p className="text-[10px] text-muted-foreground/60">
          ↓ Classification feeds Recommended Resources
        </p>
      </div>
    </motion.div>
  );
}

function TagChip({
  tag,
  index,
  isUpdated,
}: {
  tag: ClassificationTag;
  index: number;
  isUpdated: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.06, duration: 0.18 }}
    >
      <div
        className={cn(
          "flex flex-col gap-0.5 rounded-lg border px-2.5 py-1.5 transition-shadow",
          isUpdated && "ring-2 ring-primary ring-offset-1 shadow-sm"
        )}
      >
        <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {tag.label}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-foreground">
            {tag.value}
          </span>
          {tag.isLowConfidence && (
            <HelpCircle className="h-3 w-3 text-alert-amber" aria-label="Low confidence" />
          )}
        </div>
        <div
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold tabular-nums",
            CONFIDENCE_COLOUR(tag.confidence)
          )}
        >
          {tag.confidence}%
        </div>
      </div>
    </motion.div>
  );
}
