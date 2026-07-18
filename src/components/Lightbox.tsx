import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  startIndex: number;
  onClose: () => void;
  alt?: string;
}

export function Lightbox({ images, startIndex, onClose, alt }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [images.length, onClose]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="إغلاق"
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
      >
        <X className="h-6 w-6" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="السابق"
            className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="التالي"
            className="absolute right-16 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <img
        src={images[idx]}
        alt={alt ?? ""}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
          touchX.current = null;
        }}
        className="max-w-full max-h-full object-contain select-none"
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 rounded-full px-3 py-1">
          {idx + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
