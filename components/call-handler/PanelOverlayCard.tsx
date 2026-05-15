"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PanelOverlayCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isRevealed: boolean;
  onReveal: () => void;
  className?: string;
}

export function PanelOverlayCard({
  icon,
  title,
  description,
  isRevealed,
  onReveal,
  className,
}: PanelOverlayCardProps) {
  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "group absolute inset-0 z-10 flex items-center justify-center bg-background",
            className
          )}
        >
          <div className="flex flex-col items-center gap-4 px-6 text-center" style={{ maxWidth: 220 }}>
            {/* Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>

            {/* Description — always visible, brightens on hover */}
            <p className="text-[11px] leading-relaxed text-muted-foreground/50 transition-colors duration-200 group-hover:text-muted-foreground">
              {description}
            </p>

            {/* Reveal button */}
            <Button
              size="sm"
              onClick={onReveal}
              className="h-7 bg-primary px-5 text-xs text-primary-foreground hover:bg-primary/90"
            >
              Reveal
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
