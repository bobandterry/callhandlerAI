"use client";

import { AnimatePresence, motion } from "framer-motion";

interface AnnotationOverlayProps {
  isVisible: boolean;
}

export function AnnotationOverlay({ isVisible }: AnnotationOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute inset-0 z-20"
        >
          {/* SVG arrows — percentage coords relative to SVG viewport */}
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#E5281A" opacity="0.85" />
              </marker>
            </defs>

            {/* Transcript → Expert Guidance (left column to centre) */}
            <line
              x1="24%"
              y1="45%"
              x2="29%"
              y2="38%"
              stroke="#E5281A"
              strokeWidth="2"
              strokeDasharray="7 4"
              strokeOpacity="0.8"
              markerEnd="url(#arrowhead)"
            />

            {/* Transcript → Classification (left column to upper-right) */}
            <line
              x1="24%"
              y1="58%"
              x2="66%"
              y2="26%"
              stroke="#E5281A"
              strokeWidth="2"
              strokeDasharray="7 4"
              strokeOpacity="0.8"
              markerEnd="url(#arrowhead)"
            />

            {/* Classification → Recommendations (right column top to bottom) */}
            <line
              x1="83%"
              y1="37%"
              x2="83%"
              y2="52%"
              stroke="#E5281A"
              strokeWidth="2"
              strokeDasharray="7 4"
              strokeOpacity="0.8"
              markerEnd="url(#arrowhead)"
            />
          </svg>

          {/* Annotation labels */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute rounded bg-primary px-2 py-1 shadow-md"
            style={{ left: "26%", top: "33%" }}
          >
            <p className="whitespace-nowrap text-[10px] font-semibold text-white">
              Transcript → Expert Guidance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute rounded bg-primary px-2 py-1 shadow-md"
            style={{ left: "36%", top: "18%" }}
          >
            <p className="whitespace-nowrap text-[10px] font-semibold text-white">
              Transcript → Classification
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute rounded bg-primary px-2 py-1 shadow-md"
            style={{ right: "12%", top: "45%" }}
          >
            <p className="whitespace-nowrap text-[10px] font-semibold text-white">
              Classification → Resources
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
