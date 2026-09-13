'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * FixedBlob
 * Merender elemen langsung ke document.body lewat Portal,
 * supaya `position: fixed` selalu relatif ke viewport,
 * apapun ancestor-nya (transform, filter, backdrop-blur, dll
 * yang biasanya bikin `fixed` malah ikut ke-scroll).
 */
export default function FixedBlob({ className = '', style = {}, ariaHidden = true }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`pointer-events-none fixed z-0 rounded-full ${className}`}
      style={style}
      aria-hidden={ariaHidden}
    />,
    document.body
  );
}
