"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// These regions contain only neutral lettering, wheel strokes and stars.
// The original blue artwork and alpha channel are never recolored.
const regions = [
  [120, 600, 1320, 180],
  [450, 790, 650, 100],
  [300, 340, 65, 66],
  [1220, 360, 75, 80],
];

export default function BrandLogo({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="118 142 1366 751" aria-hidden="true" focusable="false"
      className={cn("block w-full h-full text-text", className)}>
      <defs>
        <clipPath id={`${id}-details`}>
          {regions.map(([x, y, width, height]) => <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} />)}
        </clipPath>
        <mask id={`${id}-art`} maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024">
          <rect width="1536" height="1024" fill="white" />
          {regions.map(([x, y, width, height]) => <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} fill="black" />)}
        </mask>
        <filter id={`${id}-ink`} colorInterpolationFilters="sRGB">
          <feFlood floodColor="currentColor" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <image href="/Images/Homepage/logo.png" width="1536" height="1024" mask={`url(#${id}-art)`} />
      <g clipPath={`url(#${id}-details)`}>
        <image href="/Images/Homepage/logo.png" width="1536" height="1024" filter={`url(#${id}-ink)`} />
      </g>
    </svg>
  );
}
