"use client";
import { useState } from "react";

export function placeholder(c1 = "#0f172a", c2 = "#1e1b4b") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="r" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <rect width="800" height="600" fill="url(#r)"/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

export default function ImageSlot({ src, alt, label, c1, c2, className = "" }) {
  const [error, setError] = useState(false);
  const fallback = placeholder(c1, c2);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`block w-full object-cover select-none ${className}`}
      src={!error && src ? src : fallback}
      alt={alt || "Project visual"}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
