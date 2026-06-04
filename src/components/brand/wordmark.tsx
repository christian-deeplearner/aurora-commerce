import * as React from "react";

import { cn } from "@/lib/utils";

export interface AuroraGlyphProps extends React.SVGProps<SVGSVGElement> {
  /** Pixel size of the square glyph. Defaults to 20. */
  size?: number;
}

/**
 * The Aurora mark — a minimal geometric "house of light":
 * a rising arc (the aurora / dawn) cradled inside an open square frame.
 * Drawn with currentColor so it inherits ink / paper-on-panel in context.
 */
export function AuroraGlyph({
  size = 20,
  className,
  ...props
}: AuroraGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* open frame — the house */}
      <path d="M3 21V6.5L12 2l9 4.5V21" />
      {/* the light — concentric rising arcs */}
      <path d="M7 21a5 5 0 0 1 10 0" />
      <path d="M9.5 21a2.5 2.5 0 0 1 5 0" />
    </svg>
  );
}

export interface WordmarkProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show the geometric glyph alongside the wordmark. Default true. */
  showGlyph?: boolean;
  /** Show the "A House of Light" subline. Default false. */
  showTagline?: boolean;
  /** Pixel size of the glyph. Default 20. */
  glyphSize?: number;
}

/**
 * The AURORA wordmark — geometric glyph + wide-tracked uppercase wordmark.
 * Inherits currentColor, so place inside text-ink (storefront nav) or
 * text-paper-on-panel (command sidebar) and it adapts. Reusable everywhere.
 */
export function Wordmark({
  showGlyph = true,
  showTagline = false,
  glyphSize = 20,
  className,
  ...props
}: WordmarkProps) {
  return (
    <span
      className={cn("inline-flex select-none items-center gap-2.5", className)}
      {...props}
    >
      {showGlyph && <AuroraGlyph size={glyphSize} />}
      <span className="inline-flex flex-col leading-none">
        <span className="font-mono text-[15px] font-medium uppercase tracking-[0.28em]">
          Aurora
        </span>
        {showTagline && (
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
            A House of Light
          </span>
        )}
      </span>
    </span>
  );
}
