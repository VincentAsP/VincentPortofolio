"use client";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

// const inter = Inter({
//     subsets: ["latin"],
//     weight: [400, 500, 700],
// })

export default function HeroText(){
    const kata = ["A Fullstack Developer", "A Designer", "An AI Engineer", "A Photographer"];

    const [index, setindex] = useState(0);
    const [fade, setfade] = useState(true);

    useEffect (() => {
        const interval = setInterval(() => {
        setfade(false);
        setTimeout(() => {
            setindex((previndex) => (previndex + 1) % kata.length);
            setfade(true)
        }, 500);
    }, 1500);
    return () => clearInterval(interval) }, [kata.length]);

    return(
        <div className={`flex items-center gap-3 mt-4 text-3xl`}>
            <span className={`transition-opacity duration-2500 ${
                fade ? "opacity-100" : "opacity-0"
            }`}>{kata[index]}</span> <span> that is helping your business</span>
        </div>
    );
}