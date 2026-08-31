import Header from './Component/Header';
import MarqueeText from './Component/movingtext';
import { Inter } from 'next/font/google';
import HeroText from './Component/Herotext';
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
  return (
    // Added 'relative' and 'overflow-hidden' to prevent scrollbars from the decorative circles
    <div className="min-h-screen relative overflow-hidden">
      
      <Header />
      
      {/* Added 'relative' and 'w-full' to constrain children properly */}
      <main className="relative w-full h-full flex flex-col items-left justify-center pt-20">
        {/* Decorative Gradient Circle */}
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full z-0"
          style={{
            background: "linear-gradient(254deg, #FF7373 50%, #FFFEF7 87%)"
          }}
        />
        
        {/* Decorative Pink Circle */}
        <div className="absolute -bottom-90 -left-40 w-100 h-100 rounded-full z-0" style={{
            background: "linear-gradient(45deg, #FF7373 50%, #FFFEF7 87%)"
          }}/>
        <Image src='/modified.png' alt='muka' width={936} height={1405} className='absolute -top-20 -right-100'></Image>
        {/* Marquee Container */}
        <div className="absoulute left-46 z-10 w-full max-w-7 xl overflow-hidden mt-10">
          <div className="px-10 py-4">
            <MarqueeText />
          </div>
        </div>
        <div className={`relative left-50 z-10 w-full h-full mt-10 ${inter.className}`} >
          <div className='px-5 '><p className="text-2xl font-normal ml-2 -mb-40">Hi! my Name is</p></div>
          <h1 className='px-10 text-[450px] font-normal -mb-30'>AXEL</h1>
          <div className="ml-60"><HeroText></HeroText> <h2 className={`mt-4 ml-110 text-5xl font-extrabold ${firaMono.className}`}>Digitaly Improve </h2></div>
        </div>
        
      </main>
    </div>
  );
}