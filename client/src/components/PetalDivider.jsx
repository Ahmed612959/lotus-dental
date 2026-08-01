import React from 'react';

/**
 * PetalDivider — the page's signature motif: a single lotus petal,
 * repeated as a section divider instead of a plain horizontal rule.
 * Fades/scales in on mount (respects prefers-reduced-motion via global CSS).
 */
export default function PetalDivider({ flip = false, className = '' }) {
  return (
    <div className={`flex justify-center py-2 ${className}`} aria-hidden="true">
      <svg
        width="40"
        height="44"
        viewBox="0 0 40 44"
        fill="none"
        className={`animate-bloom ${flip ? 'rotate-180' : ''}`}
      >
        <path
          d="M20 0C20 0 0 12 0 25C0 33 8.5 40 20 44C31.5 40 40 33 40 25C40 12 20 0 20 0Z"
          fill="#1F4D3D"
          fillOpacity="0.9"
        />
        <path
          d="M20 12C20 12 10 19 10 27C10 32 14 36.5 20 39C26 36.5 30 32 30 27C30 19 20 12 20 12Z"
          fill="#F0C9C0"
        />
      </svg>
    </div>
  );
}
