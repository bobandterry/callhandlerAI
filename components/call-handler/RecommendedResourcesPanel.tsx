"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Copy, ExternalLink, LayoutList, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Resource, type ResourceType } from "@/lib/call-handler-data";
import { cn } from "@/lib/utils";

interface RecommendedResourcesPanelProps {
  resources: Resource[];
  isProcessing: boolean;
}

const TYPE_COLOURS: Record<ResourceType, string> = {
  "Protocol guide": "bg-blue-50 text-blue-700 border-blue-200",
  "Partner referral": "bg-violet-50 text-violet-700 border-violet-200",
  "Internal resource": "bg-secondary text-muted-foreground border-border",
  "Risk assessment": "bg-amber-50 text-amber-700 border-amber-200",
  "Crisis accommodation": "bg-primary/10 text-primary border-primary/30",
  "Legal guidance": "bg-orange-50 text-orange-700 border-orange-200",
  "Financial guidance": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function RecommendedResourcesPanel({
  resources,
  isProcessing,
}: RecommendedResourcesPanelProps) {
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
      <div className="shrink-0 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <LayoutList className="h-3.5 w-3.5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Recommended Resources
          </h2>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Based on live classification — updated as the call develops
        </p>
      </div>

      {/* Scrollable resource list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {resources.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic">
            Resources will appear as the call develops.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {resources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-4 py-2">
        <p className="text-[10px] text-muted-foreground/60">
          Partner data shown is for demonstration purposes only
        </p>
      </div>
    </motion.div>
  );
}

function ResourceCard({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) {
  const isElevated = resource.isElevated === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.22 }}
      className={cn(
        "rounded-lg border p-3 transition-shadow",
        isElevated
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
    >
      {isElevated && (
        <div className="mb-2 flex items-center gap-1.5">
          <TriangleAlert className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
            Urgent — Crisis accommodation
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide border rounded px-1.5 py-0.5",
                TYPE_COLOURS[resource.type]
              )}
            >
              {resource.type}
            </span>
          </div>
          <p className="text-[12px] font-semibold text-foreground leading-snug">
            {resource.name}
          </p>
          {resource.mockDetail && (
            <p className="mt-0.5 text-[11px] font-medium text-primary">
              {resource.mockDetail}
            </p>
          )}
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            {resource.reason}
          </p>
        </div>
        <div className="shrink-0">
          {isElevated ? (
            <Bookmark className="h-3.5 w-3.5 text-primary mt-0.5" />
          ) : (
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5" />
          )}
        </div>
      </div>

      <div className="mt-2.5">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 gap-1.5 text-[11px]",
            isElevated
              ? "border-primary/40 text-primary hover:bg-primary/10"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {resource.actionLabel === "View" ? (
            <>
              <ExternalLink className="h-3 w-3" />
              View
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy referral details
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
