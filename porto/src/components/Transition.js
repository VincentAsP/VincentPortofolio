"use client";
import { useEffect, useState } from "react";

const TITLE = "Vincentius Axel";
const SUBTITLE = "At Your Service";

export default function Transition({ onCovered, onDone }) {
  const [typedTitle, setTypedTitle] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [out, setOut] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let i = 0;
    // 1. Efek mengetik per karakter untuk "Vincentius Axel"
    const typeInterval = setInterval(() => {
      i += 1;
      setTypedTitle(TITLE.slice(0, i));
      if (i >= TITLE.length) {
        clearInterval(typeInterval);
      }
    }, 180); // Kecepatan ketik (180ms per huruf, total sekitar ~2.7 detik)

    // 2. Munculkan "At Your Service" setelah ketikan utama selesai
    const tSub = setTimeout(() => {
      setShowSubtitle(true);
    }, TITLE.length * 180 + 300);

    // 3. Mulai animasi penutup (wipe) dan panggil callback seperti kode asli
    const t1 = setTimeout(() => setOut(true), 4300);
    const t2 = setTimeout(() => {
      if (onCovered) onCovered();
      setFade(true);
    }, 5100);
    const t3 = setTimeout(() => {
      if (onDone) onDone();
    }, 5800);

    return () => {
      clearInterval(typeInterval);
      [tSub, t1, t2, t3].forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`fixed inset-0 z-60 flex flex-col items-center justify-center overflow-hidden bg-black font-mono text-white transition-opacity duration-700 ${
        fade ? "opacity-0 pointer-events-none" : ""
      }`}
    >
      {/* Kontainer Teks Utama & Subteks */}
      <div className="flex flex-col items-center justify-center px-4 text-center">
        {/* Teks "Vincentius Axel" */}
        <div className="min-h-[3.5rem] text-[clamp(24px,4.5vw,56px)] font-normal tracking-[0.25em] whitespace-pre">
          {typedTitle}
        </div>

        {/* Subteks "At Your Service" */}
        <div
          className={`mt-2 text-[clamp(12px,1.8vw,22px)] tracking-[0.2em] text-neutral-200 transition-opacity duration-500 ${
            showSubtitle ? "opacity-100" : "opacity-0"
          }`}
        >
          {SUBTITLE}
        </div>
      </div>

      {/* Efek Panel Wipe di akhir transisi (mempertahankan mekanisme keluar dari kode asli) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`absolute inset-y-0 w-1/5 origin-top bg-white dark:bg-neutral-950 ${
            out ? "animate-wipe" : ""
          }`}
          style={{
            left: `${i * 20}%`,
            transform: "scaleY(0)",
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}