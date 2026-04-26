import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MangaFile, MangaPage } from '@/src/lib/cbz';
import { ReadingMode, ReaderSettings } from '@/src/types/manga';
import { cn } from '@/src/lib/utils';

interface MangaReaderProps {
  manga: MangaFile;
  currentIndex: number;
  settings: ReaderSettings;
  onPageChange: (index: number) => void;
}

export function MangaReader({ manga, currentIndex, settings, onPageChange }: MangaReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  useEffect(() => {
    if (settings.mode === 'vertical' && containerRef.current) {
      const pageElements = containerRef.current.querySelectorAll('[data-page-index]');
      const targetElement = pageElements[currentIndex];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentIndex, settings.mode]);

  if (settings.mode === 'vertical') {
    return (
      <div 
        ref={containerRef}
        className="w-full flex flex-col items-center bg-black min-h-screen overflow-y-auto px-4 md:px-0"
      >
        {manga.pages.map((page, index) => (
          <div 
            key={page.url}
            data-page-index={index}
            className={cn(
              "w-full max-w-4xl transition-opacity duration-700",
              loadedImages.has(index) ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={page.url}
              alt={page.name}
              className="w-full h-auto block"
              loading={Math.abs(index - currentIndex) < 3 ? 'eager' : 'lazy'}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    );
  }

  const isRTL = settings.mode === 'horizontal-rtl';
  const currentPage = manga.pages[currentIndex];

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? -100 : 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center p-4 md:p-8"
        >
          <img
            src={currentPage.url}
            alt={currentPage.name}
            className={cn(
              "max-w-full max-h-full object-contain shadow-2xl transition-all duration-300",
              !loadedImages.has(currentIndex) && "opacity-0 scale-95"
            )}
            onLoad={() => handleImageLoad(currentIndex)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Invisible Click Zones for Navigation */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div 
          className="w-1/3 h-full cursor-pointer pointer-events-auto"
          onClick={() => onPageChange(isRTL ? currentIndex + 1 : currentIndex - 1)}
        />
        <div className="w-1/3 h-full" />
        <div 
          className="w-1/3 h-full cursor-pointer pointer-events-auto"
          onClick={() => onPageChange(isRTL ? currentIndex - 1 : currentIndex + 1)}
        />
      </div>
    </div>
  );
}
