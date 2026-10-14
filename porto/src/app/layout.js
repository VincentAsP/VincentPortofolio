import { Bricolage_Grotesque, Playfair_Display } from "next/font/google";
import "./globals.css";

const sansFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata = {
  title: "Vincentius Axel Sebastian Pradono – Digital Product Designer",
  description: "Portfolio of Vincentius Axel Sebastian Pradono.",
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body className="overflow-x-hidden bg-black pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] font-sans text-neutral-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
