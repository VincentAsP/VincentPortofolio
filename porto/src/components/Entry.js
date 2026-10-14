"use client";
import { useState } from "react";
import { btnGhost } from "./ui";

// Taruh gambarmu di public/images/entry.jpg (atau ubah path ini)
const BG = "/images/entry.jpg";

export default function Entry({ onEnter }) {
  const [hasBg, setHasBg] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-white dark:bg-neutral-950">
      {/* Slot gambar latar. Disembunyikan kalau filenya belum ada. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG}
        alt=""
        onLoad={() => setHasBg(true)}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Lapisan gelap supaya tulisan tetap terbaca */}
      {hasBg && <div className="absolute inset-0 bg-black/40" />}

      <div className={`relative z-10 flex h-full flex-col items-center justify-center p-6 text-center ${hasBg ? "text-white" : ""}`}>
        <p className={`mb-3 ${hasBg ? "text-white/80" : "text-neutral-500"}`}>My portfolio</p>
        <h1 aria-label="AXEL" className="mb-10 text-[clamp(102px,24vw,500px)] leading-[.9] font-extrabold tracking-tighter">
          {"AXEL".split("").map((c, i) => (
            <span key={i} className="inline-block animate-rise" style={{ animationDelay: `${i * 0.07}s` }}>{c}</span>
          ))}
        </h1>
        <button
          className={`${btnGhost} ${hasBg ? "border-white! text-white! hover:bg-white! hover:text-black!" : ""}`}
          onClick={onEnter}
        >
          Enter
        </button>
      </div>
    </div>
  );
}