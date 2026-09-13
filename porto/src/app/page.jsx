'use client';

import { useState, useRef, useEffect } from 'react';
import LetterWithEffects from './Component/LetterWithEffects';
import Header from './Component/Header';
import MarqueeText from './Component/movingtext';
import { Inter } from 'next/font/google';
import { HeroText, KeepText } from './Component/Herotext';
import { Fira_Mono } from 'next/font/google';
import Image from "next/image";


const inter = Inter({
  subsets:["latin"],
  weight: ["400", "500", "700"],
});

const firaMono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export default function Home() {
  const [mode, setMode] = useState('horizontal');
  const mainRef = useRef(null);
  const lockRef = useRef(false);
  const modeRef = useRef(mode); // biar handler selalu baca mode terbaru

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    function handleWheel(event) {
      const delta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
      if (delta === 0) return;

      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
      const atMaxRight = container.scrollLeft >= maxScrollLeft;
      const atMinLeft = container.scrollLeft <= 0;

      if (modeRef.current === 'horizontal') {
        if (delta < 0 && atMinLeft) {
          event.preventDefault();
          container.scrollLeft = 0;
          return;
        }

        if (delta > 0 && atMaxRight && !atMinLeft) {
          setMode('vertical');
          lockAndRelease();
          return; // biarkan native vertical scroll jalan
        }

        event.preventDefault(); // sekarang beneran ke-block karena passive:false
        const next = Math.max(0, Math.min(maxScrollLeft, container.scrollLeft + delta));
        container.scrollLeft = next;
        return;
      }

      if (modeRef.current === 'vertical') {
        const atPageTop = window.scrollY <= 0;

        if (delta < 0 && atPageTop && !lockRef.current) {
          setMode('horizontal');
          lockAndRelease();
          event.preventDefault();
          const next = Math.max(0, Math.min(maxScrollLeft, container.scrollLeft + delta));
          container.scrollLeft = next;
          return;
        }

        return; // native vertical scroll jalan seperti biasa
      }
    }

    function lockAndRelease() {
      lockRef.current = true;
      setTimeout(() => {
        lockRef.current = false;
      }, 400);
    }

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      
      <Header />

      <div
        className="pointer-events-none fixed -top-20 -right-20 z-0 h-80 w-80 rounded-full"
        style={{
          background: "linear-gradient(254deg, #FF7373 50%, #FFFEF7 87%)"
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-40 -left-40 z-0 h-100 w-100 rounded-full"
        style={{
          background: "linear-gradient(45deg, #FF7373 50%, #FFFEF7 87%)"
        }}
        aria-hidden="true"
      />
      
      {/* Added 'relative' and 'w-full' to constrain children properly */}
      <main
        ref={mainRef}
        className="relative w-full hide-scrollbar overflow-x-auto overflow-y-hidden h-screen"
      >
        <div
          className="relative h-screen min-w-max flex flex-col items-left justify-center pt-20"
        >
        <div className="absolute top-0 -right-100 z-0 h-[calc(100vh+5rem)] w-1/2 pointer-events-none">
          <Image
            src="/modified.png"
            alt="muka"
            fill
            sizes="50vw"
            className="object-cover object-top-right"
          />
        </div>
        {/* Marquee Container */}
        <div className="relative left-30 z-10 w-full max-w-400 mt-10">
          <div className="px-5 py-4">
            <MarqueeText />
          </div>
        </div>
        <div className={`relative left-50 z-10 min-w-max h-full mt-12 ${inter.className}`} >
          <div className='px-5 '><p className="text-2xl font-normal ml-10 -mb-30">Hi! my Name is</p></div>
          <h1 className='px-10 text-[450px] font-normal -mb-30'>AXEL</h1>
          <div className="ml-60"><HeroText></HeroText> <h2 className={`mt-10 ml-110 text-5xl font-extrabold ${firaMono.className}`}>Digitaly Improve </h2></div>
        </div>
        <div className="absolute -right-1/4 top-60 z-10 translate-x-60 w-1 flex flex-col justify-center">
          <KeepText/>
          <div className='relative self-start -ml-10 flex gap-20 -top-15'>
            <svg
              className="pointer-events-none absolute -inset-24 z-0 h-[calc(100%+12rem)] w-[calc(100%+12rem)]"
              viewBox="0 0 1400 700"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M85 360C40 130 410 40 710 180S1390 120 1290 390 900 690 610 520 120 620 85 360Z"
                stroke="#ff7373"
                strokeOpacity=".35"
                strokeWidth="3"
              />
              <path
                d="M180 500C360 650 390 170 650 270S860 610 1030 350 1190 170 1260 300"
                stroke="#171717"
                strokeOpacity=".3"
                strokeWidth="2"
              />
              <path
                d="M120 240C300 80 470 520 720 390S980 100 1270 500"
                stroke="#171717"
                strokeOpacity=".25"
                strokeWidth="2"
              />
            </svg>
            <LetterWithEffects
              text="P"
              href="/projects"
              className="text-[clamp(600px,20vw,462px)] font-normal text-[rgba(74,74,74,1)] leading-none"
            />
            <LetterWithEffects
              text="W"
              href="/projects"
              className="text-[clamp(600px,20vw,462px)] font-normal text-[rgba(74,74,74,1)] leading-none"
            />
            <LetterWithEffects
              text="E"
              href="/projects"
              className="text-[clamp(600px,20vw,462px)] font-normal text-[rgba(74,74,74,1)] leading-none"
              
            />
            <div className="w-20 shrink-0" aria-hidden="true"></div>
          </div>
          </div>
        </div>
      </main>
      <div id="page-two" className="relative min-h-screen w-full px-20 pt-29 pb-20 flex flex-col items-center justify-start">
        <div className="absolute -bottom-40 -left-40 w-100 h-100 rounded-full z-0" style={{
            background: "linear-gradient(45deg, #307FC8 50%, #FFFEF7 87%)"
          }}/>
        <div className="relative translate-y-15 text-center">
          <span className="text-[43px] font-bold">Vincentius Axel Sebastian Pradono</span>
          <span className="block text-[16px] font-normal">A Computer Science student that love to explore</span>
        </div>
        <div className="relative mt-25 flex gap-35">
          <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="relative z-0 flex h-full flex-col justify-end p-8 text-left">
              <div className="absolute -top-40 left-40 w-150 h-100 rounded-full -z-100" style={{
            background: "linear-gradient(45deg, #fffef7 13%, #FF7373 87%)"
          }}/>
              <span className="text-sm">01</span>
              <h3 className="mt-2 text-3xl font-bold">AI</h3>
              <p className="mt-3 text-base">Integrating projects with Machine Learning model or with Generative.</p>
            </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
          <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="relative z-0 flex h-full flex-col justify-end p-8 text-left">
              <div className="absolute -top-40 left-40 w-150 h-100 rounded-full -z-100" style={{
            background: "linear-gradient(45deg, #fffef7 13%, #FF7373 87%)"
          }}/>
              <span className="text-sm">02</span>
              <h3 className="mt-2 text-3xl font-bold">IoT</h3>
              <p className="mt-3 text-base">Building a usefull application with an efficient and physical interaction.</p>
            </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
          <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="relative z-0 flex h-full flex-col justify-end p-8 text-left">
              <div className="absolute -top-40 left-40 w-150 h-100 rounded-full -z-100" style={{
            background: "linear-gradient(45deg, #fffef7 13%, #FF7373 87%)"
          }}/>
              <span className="text-sm">03</span>
              <h3 className="mt-2 text-3xl font-bold">Web and App Dev</h3>
              <p className="mt-3 text-base">Making a unique web and app. with iot and ai, it's a good combination</p>
            </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      <div id="page-three" className="relative mt-6 min-h-screen w-full px-20 pt-16 pb-10 flex flex-col items-center justify-start">
        <div className="relative translate-y-15 text-center">
          <span className="text-[43px] font-bold">Vincentius Axel Sebastian Pradono</span>
          <span className="block text-[16px] font-normal">A Computer Science student that love to explore</span>
        </div>
        <div className="relative mt-25 flex gap-35">
          <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="relative z-0 flex h-full flex-col justify-end p-8 text-left">
              <div className="absolute -top-40 left-40 w-150 h-100 rounded-full -z-100" style={{
            background: "linear-gradient(45deg, #fffef7 13%, #FF7373 87%)"
          }}/>
              <span className="text-sm">01</span>
              <h3 className="mt-2 text-3xl font-bold">AI</h3>
              <p className="mt-3 text-base">Integrating projects with Machine Learning model or with Generative.</p>
            </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
          <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="relative z-0 flex h-full flex-col justify-end p-8 text-left">
              <div className="absolute -top-40 left-40 w-150 h-100 rounded-full -z-100" style={{
            background: "linear-gradient(45deg, #fffef7 13%, #FF7373 87%)"
          }}/>
              <span className="text-sm">02</span>
              <h3 className="mt-2 text-3xl font-bold">IoT</h3>
              <p className="mt-3 text-base">Building a usefull application with an efficient and physical interaction.</p>
            </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
          <div className="group relative h-164.5 w-100.75 shrink-0 overflow-hidden rounded-4xl bg-[#ffffff]">
            <div className="relative z-0 flex h-full flex-col justify-end p-8 text-left">
              <div className="absolute -top-40 left-40 w-150 h-100 rounded-full -z-100" style={{
            background: "linear-gradient(45deg, #fffef7 13%, #FF7373 87%)"
          }}/>
              <span className="text-sm">03</span>
              <h3 className="mt-2 text-3xl font-bold">Web and App Dev</h3>
              <p className="mt-3 text-base">Making a unique web and app. with iot and ai, it's a good combination</p>
            </div>
            <div className="absolute inset-0 z-10 rounded-4xl bg-[#777777] transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  );
}