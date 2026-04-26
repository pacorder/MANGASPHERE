/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MangaUploader } from './components/MangaUploader';
import { MangaReader } from './components/MangaReader';
import { ReaderControls } from './components/ReaderControls';
import { MangaFile, cleanupManga } from './lib/cbz';
import { ReaderSettings } from './types/manga';
import { motion, AnimatePresence } from 'motion/react';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { About } from './pages/About';

function AdPlaceholder({ position }: { position: 'top' | 'bottom' | 'sidebar' }) {
  return (
    <div className={`ad-container flex items-center justify-center bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-black overflow-hidden rounded-2xl
      ${position === 'top' ? 'w-full h-24 mb-8' : ''}
      ${position === 'bottom' ? 'w-full h-24 mt-8' : ''}
    `}>
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
        Ad Space // Espacio para Publicidad
      </div>
    </div>
  );
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:max-w-md z-[100] bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand rounded-lg">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 15.5v.01" /><path d="M12 12v.01" /><path d="M11 17v.01" /><path d="M7 14v.01" /></svg>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white">Preferencia de Cookies</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-widest">
              Utilizamos cookies para optimizar tu experiencia y analizar el tráfico para AdSense. Al continuar, aceptas nuestra política de privacidad.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={accept}
                className="flex-1 bg-brand text-white py-2.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Aceptar Todo
              </button>
              <Link 
                to="/privacy" 
                onClick={() => setVisible(false)}
                className="flex-1 bg-white/5 text-neutral-500 py-2.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black text-center hover:bg-white/10 transition-all"
              >
                Configurar
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MainApp() {
  const [currentManga, setCurrentManga] = useState<MangaFile | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const location = useLocation();
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
  }, [currentManga, currentIndex, settings.mode, settings.viewMode]);

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

  // Hide footer when reading
  const isHome = location.pathname === '/';
  const hideChrome = !!currentManga && isHome;

  return (
    <div className="relative min-h-screen selection:bg-brand/30 bg-[#0d0d0d] overflow-x-hidden">
      <div className="grain" />
      
      <CookieConsent />

      <AnimatePresence mode="wait">
        {!currentManga ? (
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<MangaUploader onUpload={handleUpload} />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/about" element={<About />} />
            </Routes>

            {/* Home Footer for AdSense Compliance */}
            {isHome && (
              <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-12 mt-auto">
                <AdPlaceholder position="bottom" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-12 text-[10px] uppercase tracking-[0.3em] font-black text-neutral-500">
                  <div className="flex gap-8">
                    <Link to="/about" className="hover:text-brand transition-colors">Sobre Nosotros</Link>
                    <Link to="/privacy" className="hover:text-brand transition-colors">Privacidad</Link>
                    <Link to="/terms" className="hover:text-brand transition-colors">Términos</Link>
                  </div>
                  <div className="text-neutral-700">
                    © 2026 MANGASPHERE BY ZEN. ALL RIGHTS RESERVED.
                  </div>
                </div>
              </footer>
            )}
          </div>
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
      {!hideChrome && (
        <div className="fixed bottom-12 right-12 z-50 pointer-events-none">
          <div className="flex flex-col items-end opacity-20 hover:opacity-100 transition-opacity duration-700">
            <span className="editorial-title text-2xl italic tracking-tighter text-white">MangaSphere.</span>
            <span className="text-[8px] uppercase tracking-[0.6em] font-black mr-1">Premium Reader</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
