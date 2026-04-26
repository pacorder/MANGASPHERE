/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { MangaUploader } from './components/MangaUploader';
import { MangaReader } from './components/MangaReader';
import { ReaderControls } from './components/ReaderControls';
import { MangaFile, cleanupManga } from './lib/cbz';
import { ReaderSettings } from './types/manga';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentManga, setCurrentManga] = useState<MangaFile | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [settings, setSettings] = useState<ReaderSettings>({
    mode: 'horizontal-rtl',
    viewMode: 'single',
    zoom: 1,
    showControls: true,
    fitMode: 'contain'
  });

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentManga) return;

      const isRTL = settings.mode === 'horizontal-rtl';
      const step = settings.viewMode === 'double' ? 2 : 1;
      
      switch (e.key) {
        case 'ArrowRight':
          handlePageChange(isRTL ? currentIndex - step : currentIndex + step);
          break;
        case 'ArrowLeft':
          handlePageChange(isRTL ? currentIndex + step : currentIndex - step);
          break;
        case ' ':
          e.preventDefault();
          handlePageChange(currentIndex + 1);
          break;
        case 'q':
        case 'Escape':
          handleClose();
          break;
        case 'f':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentManga, currentIndex, settings.mode]);

  const handleUpload = useCallback((manga: MangaFile) => {
    setCurrentManga(manga);
    setCurrentIndex(0);
    setShowControls(true);
  }, []);

  const handlePageChange = useCallback((index: number) => {
    if (!currentManga) return;
    if (index >= 0 && index < currentManga.pages.length) {
      setCurrentIndex(index);
    }
  }, [currentManga]);

  const handleSettingsChange = useCallback((newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleClose = useCallback(() => {
    if (currentManga) {
      cleanupManga(currentManga);
      setCurrentManga(null);
    }
  }, [currentManga]);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-brand/30 bg-[#0d0d0d] overflow-hidden">
      <div className="grain" />
      
      <AnimatePresence mode="wait">
        {!currentManga ? (
          <MangaUploader onUpload={handleUpload} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen"
          >
            <div 
              className="flex-grow cursor-alias"
              onClick={() => settings.mode !== 'vertical' && toggleControls()}
            >
              <MangaReader
                manga={currentManga}
                currentIndex={currentIndex}
                settings={settings}
                onPageChange={handlePageChange}
              />
            </div>

            <ReaderControls
              manga={currentManga}
              currentIndex={currentIndex}
              settings={settings}
              onPageChange={handlePageChange}
              onSettingsChange={handleSettingsChange}
              onClose={handleClose}
              visible={showControls}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Info (Cinematic Version) */}
      {currentManga && showControls && (
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="fixed bottom-32 left-24 hidden lg:flex flex-col gap-4 z-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-brand" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-neutral-500">Navigation Protocol</span>
          </div>
          <div className="space-y-2 text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-600">
            <p>Arrows / click: traverse</p>
            <p>F: Cinematic Mode</p>
            <p>ESC: Terminate Session</p>
          </div>
        </motion.div>
      )}

      {/* Brand Watermark Editorial */}
      <div className="fixed bottom-12 right-12 z-50 pointer-events-none">
        <div className="flex flex-col items-end opacity-20 hover:opacity-100 transition-opacity duration-700">
          <span className="editorial-title text-2xl italic tracking-tighter text-white">MangaSphere.</span>
          <span className="text-[8px] uppercase tracking-[0.6em] font-black mr-1">Premium Reader</span>
        </div>
      </div>
    </div>
  );
}

