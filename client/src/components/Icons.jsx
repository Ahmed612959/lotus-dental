import React from 'react';

// Lightweight inline SVG icon set — no external icon library dependency needed.
// Each icon accepts className for sizing/color via Tailwind (currentColor).

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconSparkles = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </svg>
);

export const IconTooth = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3c-2.5 0-3 1.5-4.5 1.5S5 3.5 3.8 4.6C2.6 5.7 3 8 3.5 10c.5 2 1 4 1.5 6 .3 1.2.8 4 2.3 4 1.3 0 1.2-2.5 1.7-4.2.3-1 .6-2.3 1-2.3s.7 1.3 1 2.3c.5 1.7.4 4.2 1.7 4.2 1.5 0 2-2.8 2.3-4 .5-2 1-4 1.5-6 .5-2 .9-4.3-.3-5.4C15 3.5 14.5 4.5 13 4.5S14.5 3 12 3z" />
  </svg>
);

export const IconActivity = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M22 12h-4l-3 8-6-16-3 8H2" />
  </svg>
);

export const IconAlign = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="4" y="7" width="16" height="4" rx="1" />
    <rect x="7" y="14" width="10" height="4" rx="1" />
  </svg>
);

export const IconAnchor = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v14M5 12H2a10 10 0 0020 0h-3M5 12c0 3 3 5 7 6M19 12c0 3-3 5-7 6" />
  </svg>
);

export const IconStar = ({ className = 'w-6 h-6', filled = false }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 17l-5.9 3.2 1.3-6.5-4.9-4.5 6.6-.7L12 2.5z" strokeLinejoin="round" />
  </svg>
);

export const IconShield = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconTag = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M20.5 12.5l-8 8a2 2 0 01-2.8 0l-6.2-6.2a2 2 0 010-2.8l8-8H18a2.5 2.5 0 012.5 2.5v6.5z" />
    <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCalendar = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconClock = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconPhone = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 012-2z" />
  </svg>
);

export const IconMail = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const IconMapPin = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const IconCheck = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 12l6 6L20 6" />
  </svg>
);

export const IconChevronLeft = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const IconChevronRight = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconMenu = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconX = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconGlobe = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" />
  </svg>
);

export const IconUser = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
);

// Map used by Service model's `icon` string field -> component
export const ServiceIconMap = {
  sparkles: IconSparkles,
  tooth: IconTooth,
  activity: IconActivity,
  'align-center': IconAlign,
  anchor: IconAnchor,
  star: IconStar,
  shield: IconShield,
};
