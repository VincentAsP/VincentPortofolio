"use client";
import { useEffect, useRef } from "react";
import { drawInk, INK_DURATION } from "./inkScenes";

// Animasi tinta berbasis code. Jalan 1x setiap `stage` berubah, lalu berhenti di frame akhir.
export default function InkCanvas({ stage = 0, className = "absolute inset-0 h-full w-full pointer-events-none" }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const start = performance.now();
    const dur = INK_DURATION[stage];
    let raf, w = 0, h = 0;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = () => drawInk(ctx, w, h, stage, Math.min((performance.now() - start) / 1000, dur));
    const loop = () => { paint(); if ((performance.now() - start) / 1000 < dur) raf = requestAnimationFrame(loop); };

    fit(); loop();
    const onResize = () => { fit(); paint(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [stage]);

  return <canvas ref={ref} className={className} />;
}
