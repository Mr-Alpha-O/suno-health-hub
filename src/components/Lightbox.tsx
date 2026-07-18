import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  images: string[];
  startIndex: number;
  onClose: () => void;
  alt?: string;
}

export function Lightbox({ images, startIndex, onClose, alt }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const touchX = useRef<number | null>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  useEffect(() => { resetView(); }, [idx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, z + 0.5));
      else if (e.key === "-") setZoom((z) => Math.max(1, z - 0.5));
      else if (e.key === "0") resetView();
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

  const zoomIn = () => setZoom((z) => Math.min(4, z + 0.5));
  const zoomOut = () => setZoom((z) => { const n = Math.max(1, z - 0.5); if (n === 1) setPan({ x: 0, y: 0 }); return n; });
  const toggleZoom = () => { if (zoom === 1) setZoom(2); else resetView(); };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z + (e.deltaY < 0 ? 0.25 : -0.25))));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} aria-label="تصغير" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
          <ZoomOut className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} aria-label="تكبير" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
          <ZoomIn className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="إغلاق" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
          <X className="h-6 w-6" />
        </button>
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="السابق"
            className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="التالي"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 z-10"
            style={{ top: "50%" }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
      >
        <img
          src={images[idx]}
          alt={alt ?? ""}
          draggable={false}
          onDoubleClick={toggleZoom}
          onMouseDown={(e) => {
            if (zoom === 1) return;
            dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
          }}
          onMouseMove={(e) => {
            if (!dragRef.current) return;
            setPan({ x: dragRef.current.px + (e.clientX - dragRef.current.x), y: dragRef.current.py + (e.clientY - dragRef.current.y) });
          }}
          onMouseUp={() => { dragRef.current = null; }}
          onMouseLeave={() => { dragRef.current = null; }}
          onTouchStart={(e) => {
            if (e.touches.length === 2) {
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              pinchRef.current = { dist: Math.hypot(dx, dy), zoom };
            } else {
              touchX.current = e.touches[0].clientX;
              if (zoom > 1) dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: pan.x, py: pan.y };
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 2 && pinchRef.current) {
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              const d = Math.hypot(dx, dy);
              const newZoom = Math.min(4, Math.max(1, pinchRef.current.zoom * (d / pinchRef.current.dist)));
              setZoom(newZoom);
              if (newZoom === 1) setPan({ x: 0, y: 0 });
            } else if (dragRef.current && zoom > 1) {
              setPan({ x: dragRef.current.px + (e.touches[0].clientX - dragRef.current.x), y: dragRef.current.py + (e.touches[0].clientY - dragRef.current.y) });
            }
          }}
          onTouchEnd={(e) => {
            pinchRef.current = null;
            if (zoom === 1 && touchX.current != null) {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
            }
            touchX.current = null;
            dragRef.current = null;
          }}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragRef.current || pinchRef.current ? "none" : "transform 0.2s ease-out",
            cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in",
          }}
          className="max-w-full max-h-full object-contain select-none"
        />
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 rounded-full px-3 py-1 z-10">
          {idx + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
