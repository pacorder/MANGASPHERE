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
        id="reader-content"
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
  const isDouble = settings.viewMode === 'double';

  // Get pages to show
  const pagesToShow: MangaPage[] = [];
  if (isDouble) {
    // If double, show current and next (or prev depending on logic)
    // Convention: current is always the 'starting' page of the spread
    // In LTR: current is left, current+1 is right
    // In RTL: current is right, current+1 is left
    pagesToShow.push(manga.pages[currentIndex]);
    if (currentIndex + 1 < manga.pages.length) {
      pagesToShow.push(manga.pages[currentIndex + 1]);
    }
  } else {
    pagesToShow.push(manga.pages[currentIndex]);
  }

  return (
    <div id="reader-content" className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex + (isDouble ? '-double' : '-single')}
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? -100 : 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "w-full h-full flex items-center justify-center p-4 md:p-8 gap-1",
            isRTL && "flex-row-reverse"
          )}
        >
          {pagesToShow.map((page, idx) => (
            <img
              key={page.url}
              src={page.url}
              alt={page.name}
              className={cn(
                "max-h-full object-contain shadow-2xl transition-all duration-300",
                isDouble ? "max-w-[50%]" : "max-w-full",
                !loadedImages.has(currentIndex + idx) && "opacity-0 scale-95"
              )}
              onLoad={() => handleImageLoad(currentIndex + idx)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Invisible Click Zones for Navigation */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div 
          className="w-1/3 h-full cursor-pointer pointer-events-auto"
          onClick={() => {
            const step = isDouble ? 2 : 1;
            onPageChange(isRTL ? currentIndex + step : currentIndex - step);
          }}
        />
        <div className="w-1/3 h-full" />
        <div 
          className="w-1/3 h-full cursor-pointer pointer-events-auto"
          onClick={() => {
            const step = isDouble ? 2 : 1;
            onPageChange(isRTL ? currentIndex - step : currentIndex + step);
          }}
        />
      </div>
    </div>
  );
}
