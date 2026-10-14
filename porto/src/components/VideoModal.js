"use client";
import { btnGhost } from "./ui";

export default function VideoModal({ id, onClose }) {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 p-[5vw]" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-[1000px]" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            className="h-full w-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="Video"
          />
        </div>
        <div className="mt-3.5 flex items-center justify-between text-sm text-white">
          <a className="underline" href={`https://youtu.be/${id}`} target="_blank" rel="noopener noreferrer">Open on YouTube</a>
          <button className={`${btnGhost} !border-white !px-4.5 !py-2 !text-white hover:!bg-white hover:!text-black`} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
