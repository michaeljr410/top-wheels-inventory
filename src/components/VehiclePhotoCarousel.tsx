import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface VehiclePhotoCarouselProps {
  photos: string[];
  alt: string;
}

export const VehiclePhotoCarousel = ({ photos, alt }: VehiclePhotoCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState<Set<number>>(new Set());
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter out errored images
  const validPhotos = photos.filter((_, i) => !imgError.has(i));
  const validIndices = photos.map((_, i) => i).filter(i => !imgError.has(i));

  // Reset current if it goes out of bounds
  useEffect(() => {
    if (current >= photos.length) setCurrent(0);
  }, [current, photos.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  const handleImageError = (index: number) => {
    setImgError(prev => new Set(prev).add(index));
  };

  if (photos.length === 0 || validPhotos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-dark-elevated flex flex-col items-center justify-center gap-2">
        <Camera size={32} className="text-tw-muted/40" />
        <span className="text-tw-muted text-sm">Photos coming soon</span>
      </div>
    );
  }

  const showDots = photos.length <= 8;
  const showCounter = photos.length > 1;

  return (
    <div
      className="relative w-full aspect-[16/10] bg-dark-elevated overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={photos[current]}
          alt={`${alt} - Photo ${current + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onError={() => handleImageError(current)}
          loading="lazy"
        />
      </AnimatePresence>

      {/* Navigation arrows — visible on hover (desktop) + always visible on mobile */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-dark/60 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center rounded-full opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity active:scale-95 hover:bg-cyan hover:text-dark hover:border-cyan"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-dark/60 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center rounded-full opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity active:scale-95 hover:bg-cyan hover:text-dark hover:border-cyan"
          >
            <ChevronRight size={18} />
          </button>

          {/* Photo counter (always shown for large galleries) */}
          {showCounter && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-dark/70 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-white text-xs font-mono font-medium">
                {current + 1} / {photos.length}
              </span>
            </div>
          )}

          {/* Dots — only for ≤8 photos */}
          {showDots && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-cyan w-5' : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Progress bar — for large galleries (>8 photos) */}
          {!showDots && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark/40">
              <div
                className="h-full bg-cyan/80 transition-all duration-300"
                style={{ width: `${((current + 1) / photos.length) * 100}%` }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
