"use client";
import { useEffect, useRef, useState } from "react";
import Entry from "../components/Entry";
import Transition from "../components/Transition";
import VideoModal from "../components/VideoModal";
import ImageSlot from "../components/ImageSlot";
import { profile, projects as defaultProjects } from "./data";
import { supabase } from "../lib/supabase";

const section = "px-[5vw] py-[12vh] relative z-10";
const label = "mb-7 font-ocr text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase";

const CAPABILITIES = [
  {
    tag: "GET DISCOVERED",
    tab: "Search",
    title: "Search",
    desc: "Help businesses become visible and chosen when people are looking.",
  },
  {
    tag: "ENGAGE & CONVERT",
    tab: "Experience",
    title: "Experience",
    desc: "Create digital experiences that help people understand, interact, and act.",
  },
  {
    tag: "RETAIN & GROW",
    tab: "Loyalty & CRM",
    title: "Loyalty & CRM",
    desc: "Build useful, relevant relationships that give customers reasons to return.",
  },
  {
    tag: "DATA & AI AS CONNECTIVE LAYER",
    tab: "Intelligence",
    title: "Intelligence",
    desc: "Connects customer data across all three, and helps clients transform their own business with AI.",
  },
];

export default function Page() {
  const [phase, setPhase] = useState("entry");
  const [transition, setTransition] = useState(false);
  const [video, setVideo] = useState(false);

  // State untuk menyimpan data proyek dari Supabase / default fallback
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // State Carousel Work Experience (Otomatis & Interactive)
  const [activeWork, setActiveWork] = useState(0);
  const [isHoveringWork, setIsHoveringWork] = useState(false);

  // State & Ref untuk Capabilities Section (Dengan Scroll Interaktif)
  const [activeCap, setActiveCap] = useState(0);
  const capSectionRef = useRef(null);
  const capProgressRef = useRef(0);
  const canvasRef = useRef(null);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoverWork, setHoverWork] = useState(false);

  // Ambil data proyek dari tabel `lists` Supabase
  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("lists")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Gagal mengambil data dari Supabase:", error.message);
          const fallback = defaultProjects.map((item, idx) => ({
            id: `default-${idx}`,
            title: item.title,
            text: item.text,
            image: item.image,
            link: "#",
            type: "Project",
            c1: idx % 2 === 0 ? "#172554" : "#1e3a8a",
            c2: "#0f172a",
          }));
          setProjects(fallback);
        } else if (data && data.length > 0) {
          const formatted = data.map((item, index) => ({
            id: item.id,
            title: item.Project_Name || "Untitled Project",
            text: item.About_Project || item.MyParticipation || "Information architecture and design system.",
            image: item.Link_bukti && item.Link_bukti.startsWith("http") ? item.Link_bukti : "/images/work-1.jpg",
            link: item.Link_bukti,
            type: "Project",
            c1: index % 2 === 0 ? "#172554" : "#1e3a8a",
            c2: "#0f172a",
          }));
          setProjects(formatted);
        } else {
          const fallback = defaultProjects.map((item, idx) => ({
            id: `default-${idx}`,
            title: item.title,
            text: item.text,
            image: item.image,
            link: "#",
            type: "Project",
            c1: idx % 2 === 0 ? "#172554" : "#1e3a8a",
            c2: "#0f172a",
          }));
          setProjects(fallback);
        }
      } catch (err) {
        console.error("Error koneksi Supabase:", err);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  // Lock scroll selama phase entry / transition
  useEffect(() => {
    const lock = phase === "entry" || transition;
    document.body.style.overflow = lock ? "hidden" : "";
    if (!lock) window.scrollTo(0, 0);
  }, [phase, transition]);

  // Otomatis ganti slide proyek (Autoplay Carousel - tidak wajib scroll)
  useEffect(() => {
    if (phase !== "home" || projects.length <= 1 || isHoveringWork) return;

    const interval = setInterval(() => {
      setActiveWork((prev) => (prev + 1) % projects.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [phase, projects.length, isHoveringWork]);

  // Scroll listener untuk Capabilities Section
  useEffect(() => {
    if (phase !== "home") return;

    const handleScroll = () => {
      if (capSectionRef.current) {
        const rect = capSectionRef.current.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / total));
          capProgressRef.current = progress;
          const idx = Math.min(
            CAPABILITIES.length - 1,
            Math.floor(progress * CAPABILITIES.length)
          );
          setActiveCap(idx);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  // Animasi Kanvas Partikel dengan Spektrum Biru Elegan
  useEffect(() => {
    if (phase !== "home") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const NUM_PARTICLES = 440;
    const HUB_COUNT = 100;

    const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => {
      const randSpread = (Math.random() + Math.random() + Math.random() - 1.5) * 0.9;
      return {
        u: Math.random(),
        v: randSpread,
        z: Math.random(),
        speed: 0.00015 + Math.random() * 0.0003,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        hueJitter: (Math.random() - 0.5) * 20,
        isHub: i < HUB_COUNT,
      };
    });

    let smoothProgress = capProgressRef.current;

    const render = (now) => {
      const t = now * 0.001;
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);

      smoothProgress += (capProgressRef.current - smoothProgress) * 0.035;
      const baseHue = (205 + smoothProgress * 40 + t * 3) % 360;
      const streamSpread = (0.2 + smoothProgress * 0.28) * Math.min(w, h);
      const streamAngle = 0.38 - smoothProgress * 0.12;
      const cosA = Math.cos(streamAngle);
      const sinA = Math.sin(streamAngle);

      const projected = [];
      const hubs = [];

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles[i];
        p.u = (p.u + p.speed) % 1;
        p.angle += p.rotSpeed;

        const along = (p.u - 0.5) * Math.max(w, h) * 1.45;
        const wave = Math.sin(p.u * 6.0 - t * 0.35 + smoothProgress * 3) * (30 + smoothProgress * 20);
        const taper = 1.25 - p.u * 0.65;
        const across = p.v * streamSpread * taper + wave;

        const x = w * 0.48 + along * cosA - across * sinA;
        const y = h * 0.38 + along * sinA + across * cosA;

        const sizeFactor = Math.max(0.2, (1.15 - p.u * 0.75) * (0.4 + p.z * 0.9));
        const size = (2.1 + smoothProgress * 1.6) * sizeFactor;
        const hue = (baseHue + p.u * 40 + p.hueJitter + 360) % 360;
        const alpha = Math.sin(p.u * Math.PI) * (0.3 + p.z * 0.6) * (1 - p.u * 0.25);

        const item = { x, y, size, hue, alpha, angle: p.angle, z: p.z };
        projected.push(item);
        if (p.isHub && alpha > 0.22) hubs.push(item);
      }

      const maxConnectDist = 82 + smoothProgress * 24;
      const maxDistSq = maxConnectDist * maxConnectDist;
      ctx.lineWidth = 0.85;

      for (let i = 0; i < hubs.length; i++) {
        const a = hubs[i];
        for (let j = i + 1; j < hubs.length; j++) {
          const b = hubs[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;

          if (dSq < maxDistSq) {
            const distAlpha = (1 - Math.sqrt(dSq) / maxConnectDist) * 0.25;
            ctx.strokeStyle = `hsla(${a.hue}, 88%, 68%, ${distAlpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        if (pt.alpha <= 0.02) continue;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.angle);
        ctx.fillStyle = `hsla(${pt.hue}, 92%, ${55 + pt.z * 18}%, ${pt.alpha})`;
        ctx.fillRect(-pt.size, -pt.size, pt.size * 2, pt.size * 2);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  const scrollToSectionItem = (ref, index, totalItems) => {
    const el = ref.current;
    if (!el) return;
    const sectionTop = el.offsetTop;
    const totalScrollable = el.offsetHeight - window.innerHeight;
    const targetScroll = sectionTop + (index / totalItems) * totalScrollable + 20;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const handleScrollToWork = (e) => {
    e?.preventDefault();
    const el = document.getElementById("work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {phase === "entry" && <Entry onEnter={() => setTransition(true)} />}
      {transition && (
        <Transition
          onCovered={() => setPhase("home")}
          onDone={() => setTransition(false)}
        />
      )}

      {phase === "home" && (
        <main
          onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
          className="relative min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200"
        >
          {/* Background Ambient Dark Atmosphere & Blue Glow (Bukan Hijau) */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div
              className="absolute -bottom-36 -left-36 h-[550px] w-[550px] rounded-full opacity-15 blur-[160px]"
              style={{ background: "radial-gradient(circle, #2563eb 0%, #1d4ed8 45%, transparent 75%)" }}
            />
            <div
              className="absolute -top-36 -right-36 h-[500px] w-[500px] rounded-full opacity-10 blur-[160px]"
              style={{ background: "radial-gradient(circle, #38bdf8 0%, #1e40af 50%, transparent 75%)" }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-5 blur-[180px]"
              style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)" }}
            />
          </div>

          {/* Floating Cursor untuk Work Showcase */}
          <div
            className={`pointer-events-none fixed top-0 left-0 z-50 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/20 font-ocr text-[10px] font-semibold tracking-[0.2em] text-white uppercase shadow-[0_0_35px_rgba(59,130,246,0.35)] backdrop-blur-md transition-opacity duration-300 ${
              hoverWork ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
          >
            VIEW WORK
          </div>

          {/* ================= NAVBAR (ELEGANT HEADER) ================= */}
          <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[5vw] pt-[calc(20px+env(safe-area-inset-top))] pb-5 text-white backdrop-blur-[2px]">
            <a href="#" className="font-ocr text-sm font-bold tracking-[0.22em] uppercase text-white transition-opacity hover:opacity-80">
              {profile.name}
            </a>

            <div className="flex items-center gap-6 font-ocr text-xs font-medium tracking-[0.2em] uppercase text-neutral-300 md:gap-9">
              <a href="#work" className="transition-colors hover:text-blue-400">Work</a>
              <a href="#capabilities" className="transition-colors hover:text-blue-400">Services</a>
              <a href="#about" className="transition-colors hover:text-blue-400">About</a>
              <a href="#contact" className="transition-colors hover:text-blue-400">Contact</a>

              {/* Hamburger Icon seperti gaya ANTIKODE */}
              <button
                type="button"
                onClick={handleScrollToWork}
                aria-label="Navigation Menu"
                className="flex flex-col justify-center gap-1.5 p-1 text-white opacity-85 transition hover:opacity-100"
              >
                <span className="block h-[1.5px] w-5 bg-white" />
                <span className="block h-[1.5px] w-5 bg-white" />
              </button>
            </div>
          </nav>

          {/* ================= HERO SECTION (SEPERTI REFERENSI ANTIKODE) ================= */}
          <header className="relative z-10 flex min-h-screen flex-col justify-between px-[5vw] pt-[15vh] pb-[6vh]">
            <div />

            {/* Konten Utama Hero */}
            <div className="grid w-full grid-cols-1 items-end gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
              {/* Kolom Kiri: Title Besar dengan Bungee Hairline (Tipis) & OCR-B 10 BT (Tebal) */}
              <div>
                <p className="font-ocr mb-4 text-[10px] font-semibold tracking-[0.28em] text-neutral-400 uppercase md:text-xs">
                  CUSTOMER GROWTH &amp; DIGITAL EXPERIENCE
                </p>

                <h1 className="text-[clamp(36px,6.2vw,92px)] font-normal leading-[1.08] tracking-tight text-neutral-100">
                  <span className="font-bungee block font-normal tracking-[0.03em] text-neutral-100">
                    Designing Digital Experiences
                  </span>
                  <span className="font-bungee font-normal tracking-[0.03em] text-neutral-100">
                    Built for{" "}
                  </span>
                  <span className="font-ocr font-bold tracking-tight text-sky-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                    Business Growth
                  </span>
                </h1>
              </div>

              {/* Kolom Kanan: Deskripsi Singkat & Tombol Get To Know Us */}
              <div className="flex flex-col items-start lg:pb-3 lg:pl-6">
                <p className="max-w-[42ch] text-sm leading-relaxed text-neutral-300 md:text-base">
                  A Customer Growth &amp; Digital Experience designer. We help businesses get
                  discovered, convert, and grow, backed by craft and dedicated design systems
                  across modern platforms.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#work"
                    onClick={handleScrollToWork}
                    className="font-ocr group inline-flex items-center gap-3 rounded-full border border-neutral-600/80 bg-neutral-900/30 px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-200 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:bg-blue-600/15 hover:text-white"
                  >
                    <span>GET TO KNOW ME</span>
                    <span className="text-sm transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                  </a>

                  {profile.videoId && (
                    <button
                      type="button"
                      onClick={() => setVideo(true)}
                      className="font-ocr cursor-pointer text-xs font-medium tracking-[0.18em] uppercase text-neutral-400 underline underline-offset-4 transition hover:text-white"
                    >
                      Watch Video
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian Bawah: SCROLL TO EXPLORE (Bisa dipencet langsung ke bawah) */}
            <div className="flex flex-col items-center justify-center pt-10">
              <a
                href="#work"
                onClick={handleScrollToWork}
                className="font-ocr group flex flex-col items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-neutral-400 uppercase transition-colors hover:text-blue-400"
              >
                <span>SCROLL TO EXPLORE</span>
                <div className="h-8 w-[1px] bg-gradient-to-b from-neutral-500 to-transparent transition-all duration-300 group-hover:h-12 group-hover:from-blue-400" />
              </a>
            </div>
          </header>

          {/* ================= WORK EXPERIENCE SECTION (AUTO SLIDESHOW - BEBAS SCROLL) ================= */}
          <section
            id="work"
            className="relative z-10 w-full px-[5vw] py-20 md:py-28"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
              {/* Header Section */}
              <div className="mb-12 flex flex-col items-center text-center">
                <span className="font-ocr text-[11px] font-semibold tracking-[0.28em] text-neutral-400 uppercase">
                  OUR FEATURED WORK
                </span>
                <div className="mt-3 h-[1px] w-16 bg-neutral-800" />
              </div>

              {loadingProjects ? (
                <div className="py-20 text-center text-sm text-neutral-400">
                  <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  Memuat data proyek...
                </div>
              ) : projects.length === 0 ? (
                <p className="py-20 text-sm text-neutral-400">Belum ada data proyek.</p>
              ) : (
                <div className="w-full">
                  <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1fr_minmax(320px,460px)_1fr]">
                    {/* Kolom Kiri: Navigasi Prev Slide */}
                    <div className="hidden items-center justify-end md:flex">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveWork((prev) => (prev - 1 + projects.length) % projects.length)
                        }
                        aria-label="Previous project"
                        className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-400 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:text-white"
                      >
                        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
                      </button>
                    </div>

                    {/* Kolom Tengah: Visual Card & Judul Proyek */}
                    <div
                      className="relative flex flex-col items-center"
                      onMouseEnter={() => {
                        setHoverWork(true);
                        setIsHoveringWork(true);
                      }}
                      onMouseLeave={() => {
                        setHoverWork(false);
                        setIsHoveringWork(false);
                      }}
                    >
                      <div className="relative aspect-[4/4.5] w-full">
                        {/* Container Kartu Gambar Bersih (Tanpa Form Upload / Dashed Border) */}
                        <div className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
                          {projects.map((p, idx) => {
                            const isActive = idx === activeWork;
                            return (
                              <div
                                key={p.id || idx}
                                className={`absolute inset-0 transition-all duration-700 ease-out ${
                                  isActive
                                    ? "z-10 scale-100 opacity-100"
                                    : "pointer-events-none z-0 scale-105 opacity-0"
                                }`}
                              >
                                <ImageSlot
                                  className="h-full w-full object-cover"
                                  src={p.image}
                                  alt={p.title}
                                  c1={p.c1}
                                  c2={p.c2}
                                />
                                {/* Vignette Gelap Halus untuk Kontras Judul */}
                                <div
                                  className="pointer-events-none absolute inset-0"
                                  style={{
                                    background:
                                      "radial-gradient(circle at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)",
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Judul Proyek dengan Font OCR-B 10 BT */}
                        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4">
                          {projects.map((p, idx) => {
                            const isActive = idx === activeWork;
                            return (
                              <div
                                key={p.id || idx}
                                className={`flex w-full items-center justify-center transition-all duration-700 ease-out ${
                                  isActive
                                    ? "translate-y-0 opacity-100"
                                    : idx < activeWork
                                    ? "pointer-events-none absolute -translate-y-6 opacity-0"
                                    : "pointer-events-none absolute translate-y-6 opacity-0"
                                }`}
                              >
                                <div className="pointer-events-none absolute h-24 w-3/4 rounded-full bg-black/60 blur-2xl" />
                                <h4
                                  style={{
                                    textShadow:
                                      "0 4px 14px rgba(0,0,0,0.95), 0 12px 36px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8)",
                                  }}
                                  className="font-ocr relative z-10 text-center text-[clamp(28px,4.5vw,52px)] font-bold tracking-tight text-white uppercase"
                                >
                                  {p.title}
                                </h4>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tombol Indikator Dots di Bawah (Bisa Diklik Langsung untuk Ganti Slide) */}
                      <div className="mt-7 flex items-center justify-center gap-2.5">
                        {projects.map((p, idx) => {
                          const isActive = idx === activeWork;
                          return (
                            <button
                              key={p.id || idx}
                              type="button"
                              onClick={() => setActiveWork(idx)}
                              aria-label={`View ${p.title}`}
                              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                                isActive
                                  ? "w-8 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]"
                                  : "w-2 bg-neutral-700 hover:bg-neutral-500"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Kolom Kanan: Detail Deskripsi Proyek & Link Bukti */}
                    <div className="flex flex-col items-center md:items-start">
                      <div className="relative min-h-[140px] text-center md:text-left">
                        {projects.map((p, idx) => {
                          const isActive = idx === activeWork;
                          return (
                            <div
                              key={p.id || idx}
                              className={`transition-all duration-700 ease-out ${
                                isActive
                                  ? "relative translate-y-0 opacity-100"
                                  : "pointer-events-none absolute inset-x-0 top-0 translate-y-4 opacity-0"
                              }`}
                            >
                              <span className="font-ocr mb-2 inline-block text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                                {p.type || "FEATURED PROJECT"}
                              </span>
                              <p className="mx-auto max-w-[28ch] text-sm leading-relaxed text-neutral-300 md:mx-0">
                                {p.text}
                              </p>
                              {p.link && p.link !== "#" && (
                                <a
                                  href={p.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-ocr mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 underline underline-offset-4 transition hover:text-white"
                                >
                                  <span>Lihat Proyek</span>
                                  <span>→</span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Tombol Navigasi Next di Mobile & Desktop */}
                      <div className="mt-4 flex items-center gap-3 md:hidden">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveWork((prev) => (prev - 1 + projects.length) % projects.length)
                          }
                          aria-label="Previous project"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:border-blue-400"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveWork((prev) => (prev + 1) % projects.length)
                          }
                          aria-label="Next project"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:border-blue-400"
                        >
                          →
                        </button>
                      </div>

                      <div className="hidden md:block">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveWork((prev) => (prev + 1) % projects.length)
                          }
                          aria-label="Next project"
                          className="group mt-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-400 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:text-white"
                        >
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ================= CAPABILITIES SECTION ================= */}
          <section className="relative z-10 px-[5vw] pt-[16vh] pb-[6vh] text-center">
            <p className="font-ocr text-[11px] font-semibold tracking-[0.28em] text-neutral-400 uppercase">
              GROWTH BY DESIGN
            </p>
            <h3 className="mx-auto mt-4 max-w-[20ch] text-[clamp(32px,5.5vw,76px)] leading-[1.1] font-normal tracking-tight text-white">
              <span className="font-bungee block">Growth isn&apos;t accidental.</span>
              <span className="font-ocr font-bold tracking-tight text-sky-400">It&apos;s designed.</span>
            </h3>
            <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-relaxed text-neutral-400">
              We connect how people discover a product, how they experience it,
              and why they come back.
            </p>
          </section>

          <section
            id="capabilities"
            ref={capSectionRef}
            className="relative z-10"
            style={{ height: `${CAPABILITIES.length * 90}vh` }}
          >
            <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-end overflow-hidden px-[5vw] pb-[8vh]">
              <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[50vh]"
                style={{
                  background: "linear-gradient(to top, #000000 22%, rgba(0,0,0,0.85) 60%, transparent 100%)",
                }}
              />

              <div className="relative z-20 flex w-full max-w-2xl flex-col items-center text-center">
                <div className="relative flex min-h-[150px] w-full flex-col items-center justify-center">
                  {CAPABILITIES.map((c, idx) => {
                    const isActive = idx === activeCap;
                    return (
                      <div
                        key={c.title}
                        className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
                          isActive
                            ? "relative translate-y-0 opacity-100"
                            : "pointer-events-none absolute inset-x-0 translate-y-5 opacity-0"
                        }`}
                      >
                        <span
                          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}
                          className="font-ocr text-[11px] font-semibold tracking-[0.26em] text-blue-400 uppercase"
                        >
                          {c.tag}
                        </span>
                        <h4
                          style={{
                            textShadow: "0 4px 16px rgba(0,0,0,0.95), 0 8px 32px rgba(0,0,0,0.9)",
                          }}
                          className="font-ocr mt-2.5 text-[clamp(30px,4.5vw,52px)] font-bold uppercase leading-none text-white"
                        >
                          {c.title}
                        </h4>
                        <p
                          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 4px 20px rgba(0,0,0,0.9)" }}
                          className="mt-3.5 max-w-[44ch] text-sm leading-relaxed text-neutral-200 md:text-base"
                        >
                          {c.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="font-ocr mt-6 flex flex-wrap items-center justify-center gap-7 text-xs tracking-[0.15em] uppercase">
                  {CAPABILITIES.map((c, idx) => {
                    const isActive = idx === activeCap;
                    return (
                      <button
                        key={c.tab}
                        onClick={() => scrollToSectionItem(capSectionRef, idx, CAPABILITIES.length)}
                        style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
                        className={`cursor-pointer pb-1.5 transition-all duration-300 ${
                          isActive
                            ? "border-b-2 border-blue-400 font-semibold text-sky-300"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {c.tab}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ================= ABOUT & SKILLS ================= */}
          <section className={section}>
            <p className={label}>SKILLS &amp; CAPABILITIES WE BRING TO THE TABLE</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-ocr text-[clamp(20px,3.2vw,38px)] leading-[1.25] text-neutral-200">
              {profile.skills.map((s, idx) => (
                <span key={s} className="flex items-center gap-5">
                  <span className="transition-colors duration-300 hover:text-blue-400">{s}</span>
                  {idx < profile.skills.length - 1 && <span className="text-sm text-blue-500/70">•</span>}
                </span>
              ))}
            </div>
          </section>

          <section id="about" className={section}>
            <div className="mb-10 flex items-center justify-between">
              <h3 className="font-ocr text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase">ABOUT &amp; INSIGHTS</h3>
              <a href="#contact" className="font-ocr text-xs tracking-[0.2em] text-blue-400 uppercase hover:underline">
                + GET IN TOUCH
              </a>
            </div>

            <div className="grid items-start gap-12 md:grid-cols-[minmax(240px,360px)_1fr]">
              <ImageSlot
                className="aspect-square rounded-xl shadow-2xl border border-neutral-800"
                src={profile.photo}
                alt={profile.name}
                c1="#0f172a"
                c2="#1e293b"
              />
              <div className="flex flex-col justify-between">
                <p className="mb-10 max-w-[34ch] text-[clamp(20px,2.6vw,34px)] leading-relaxed text-neutral-100 font-light">
                  {profile.bio}
                </p>
              </div>
            </div>
          </section>

          {/* ================= CONTACT SECTION ================= */}
          <section id="contact" className="relative z-10 border-t border-neutral-900 px-[5vw] pt-[14vh] pb-[8vh]">
            <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="text-[clamp(32px,5vw,66px)] leading-[1.08] font-normal tracking-tight text-white">
                  <span className="font-bungee block">Let&apos;s build something</span>
                  <span className="font-ocr font-bold text-sky-400">awesome.</span>
                </h3>
                <a
                  className="font-ocr mt-6 inline-block text-[clamp(18px,2.8vw,36px)] font-medium tracking-tight text-sky-400 underline decoration-blue-500/40 underline-offset-8 wrap-break-word hover:text-sky-300"
                  href={`mailto:${profile.email}`}
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {video && <VideoModal id={profile.videoId} onClose={() => setVideo(false)} />}
    </>
  );
}