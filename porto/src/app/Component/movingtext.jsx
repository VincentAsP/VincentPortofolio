import Marquee from "react-fast-marquee";
import Image from "next/image";
import { Fira_Mono } from "next/font/google";

// 1. Perbaiki inisialisasi font (Hanya gunakan weight yang tersedia)
const firaMono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Hapus 600 dan 800
  // variable: "--font-inter", (Opsional: baris ini boleh dihapus kalau tidak dipakai di Tailwind config)
});

export default function MarqueeText() {
  return (
    <Marquee speed={50} gradient={false} autoFill={true}>
      {/* 2. Panggil font dengan benar menggunakan ${firaMono.className} */}
      <div className={`flex items-center gap-5 px-4 ${firaMono.className}`}>
        <span>latest project : lastbite</span>
        <span>-</span>
        <span>I'm Indonesian and i'm Happy</span>
        <span>-</span>
        <span>LOCALTIME 19:17, UTC +7/WIB</span>
        <Image src="/Star 4.svg" alt="star" width={20} height={20} />
      </div>
    </Marquee>
  );
}