import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VehiclePhotoCarouselProps {
  photos: string[];
  alt: string;
}

export const VehiclePhotoCarousel = ({ photos, alt }: VehiclePhotoCarouselProps) => {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-dark-elevated flex items-center justify-center">
        <span className="text-tw-muted text-sm">No photos available</span>
      </div>
    );
  }

  const next = () => setCurrent((c) => (c + 1) % photos.length);
  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);

  return (
    <div className="relative w-full aspect-[16/10] bg-dark-elevated overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={photos[current]}
          alt={`${alt} - Photo ${current + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark/70 border border-dark-border text-tw-text flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan hover:text-dark hover:border-cyan"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark/70 border border-dark-border text-tw-text flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan hover:text-dark hover:border-cyan"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-cyan w-5' : 'bg-tw-muted/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
