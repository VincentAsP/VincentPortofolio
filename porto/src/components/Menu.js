"use client";
import { useEffect, useRef, useState } from "react";
import { placeholder } from "./ImageSlot";
import { profile } from "../app/data";

// Letter-by-letter vertical roll on hover (each letter swaps with a copy sliding up from below).
function Roll({ text }) {
  const t = "transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover/link:-translate-y-full";
  return (
    <span className="inline-flex" aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block overflow-hidden align-top">
          <span className={`block ${t}`} style={{ transitionDelay: `${i * 35}ms` }}>{c}</span>
          <span className={`absolute top-full left-0 block ${t}`} style={{ transitionDelay: `${i * 35}ms` }}>{c}</span>
        </span>
      ))}
    </span>
  );
}

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Dark tinted frames behind the photo (back to front), each shifted left/down.
const PANELS = [
  { x: -150, y: 44, c: "#1f2627" },
  { x: -112, y: 33, c: "#252e30" },
  { x: -76, y: 22, c: "#2b3639" },
  { x: -40, y: 11, c: "#323f42" },
];
// Faded echoes of the photo itself (motion-trail effect).
const GHOSTS = [
  { x: -64, y: 8, o: 0.14 },
  { x: -42, y: 5, o: 0.2 },
  { x: -20, y: 2.5, o: 0.3 },
];
const CLIP = "polygon(5% 6%, 96% 0%, 100% 100%, 0% 97%)";

export default function Menu({ onClose }) {
  const stack = useRef(null);
  const [ready, setReady] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeRef = useRef();
  // Fade to dark, then close (and jump to the chosen section).
  closeRef.current = (href) => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      onClose();
      if (href) setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 450);
  };
  const fallback = placeholder("#2b3639", "#4a5c60", "Your portrait");

  useEffect(() => {
    const r = requestAnimationFrame(() => setReady(true));
    const key = (e) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(r); window.removeEventListener("keydown", key); };
  }, [onClose]);

  // Mouse parallax: layers drift at different depths.
  const move = (e) => {
    const el = stack.current;
    if (!el) return;
    el.style.setProperty("--mx", (e.clientX / window.innerWidth - 0.5) * 2);
    el.style.setProperty("--my", (e.clientY / window.innerHeight - 0.5) * 2);
  };

  const layer = (x, y, depth) => ({
    transform: `translate(calc(${ready ? x : 0}px + var(--mx, 0) * ${depth}px), calc(${ready ? y : 0}px + var(--my, 0) * ${depth * 0.6}px))`,
    clipPath: CLIP,
  });

  const imgProps = {
    src: profile.menuPhoto,
    alt: "",
    onError: (e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback; },
  };

  return (
    <div onMouseMove={move} className={`fixed inset-0 z-40 animate-fade overflow-y-auto bg-[#1a1a1a] text-white transition-opacity duration-[450ms] md:overflow-hidden ${closing ? "opacity-0" : ""}`}>
      <button onClick={() => closeRef.current()} className="fixed top-[calc(18px+env(safe-area-inset-top))] right-[5vw] z-10 cursor-pointer font-mono text-xs font-bold uppercase">
        Close
      </button>

      <div className="grid min-h-full md:h-full md:grid-cols-[1fr_minmax(340px,32%)]">
        {/* Photo stack */}
        <div className="relative h-[46vh] overflow-hidden md:h-full" style={{ perspective: "1600px" }}>
          <div ref={stack} className="absolute inset-y-0 right-0 left-[4%] md:left-[3%]"
            style={{ transform: "rotateY(-3deg) rotateZ(-0.8deg)", transformStyle: "preserve-3d" }}>
            {PANELS.map((p, i) => (
              <div key={i} className="absolute inset-0 transition-transform duration-[900ms] ease-out"
                style={{ background: p.c, ...layer(p.x, p.y, 6 + i * 3) }} />
            ))}
            {GHOSTS.map((g, i) => (
              <div key={i} className="absolute inset-0 transition-transform duration-[900ms] ease-out" style={{ opacity: g.o, ...layer(g.x, g.y, 14 + i * 4) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...imgProps} className="h-full w-full object-cover object-center" />
              </div>
            ))}
            <div className="absolute inset-0 transition-transform duration-[900ms] ease-out" style={layer(0, 0, 22)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...imgProps} className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/50" />
            </div>
          </div>
        </div>

        {/* Menu column */}
        <div className="flex flex-col justify-between gap-14 px-[5vw] py-8 md:px-0 md:py-[7vh] md:pr-[3vw]">
          <svg width="56" height="34" viewBox="0 0 56 34" fill="#fff" aria-label={profile.name}>
            <circle cx="9" cy="25" r="9" />
            <path d="M18 34 24 6a6 6 0 0 1 6-5h14a8 8 0 0 1 7 11l-6 22Z" />
          </svg>

          <ul className="[&:hover_li:not(:hover)]:opacity-40">
            {LINKS.map((l, i) => (
              <li key={l.label} className="animate-rise transition-opacity" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                <a href={l.href} onClick={(e) => { e.preventDefault(); closeRef.current(l.href); }} className="group/link block text-[clamp(36px,4.2vw,64px)] leading-[.95] font-extrabold tracking-tight uppercase">
                  <Roll text={l.label} />
                </a>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 font-mono text-[11px] leading-snug uppercase">
            <div>Follow<br />({profile.name})</div>
            <div>{profile.socials.map((s) => <a key={s.label} href={s.href} className="block hover:underline">{s.label}</a>)}</div>

            <div>Get in touch</div>
            <div><a href={`mailto:${profile.email}`} className="inline-block bg-white px-1.5 py-0.5 text-black">Email &gt;</a></div>

            {profile.locations.map((l) => (
              <div key={l.city}>{l.city}{l.lines.map((t) => <span key={t} className="block">{t}</span>)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
