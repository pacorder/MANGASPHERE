import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BookOpen, 
  Layout, 
  ArrowDown,
  Maximize2,
  X,
  FileImage,
  FileText,
  Columns,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MangaFile } from '@/src/lib/cbz';
import { ReaderSettings, ReadingMode } from '@/src/types/manga';
import { cn } from '@/src/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReaderControlsProps {
  manga: MangaFile;
  currentIndex: number;
  settings: ReaderSettings;
  onPageChange: (index: number) => void;
  onSettingsChange: (settings: Partial<ReaderSettings>) => void;
  onClose: () => void;
  visible: boolean;
}

export function ReaderControls({ 
  manga, 
  currentIndex, 
  settings, 
  onPageChange, 
  onSettingsChange,
  onClose,
  visible 
}: ReaderControlsProps) {
  const progress = ((currentIndex + 1) / manga.pages.length) * 100;

  const handleExportPNG = async () => {
    const element = document.getElementById('reader-content');
    if (!element) return;
    const canvas = await html2canvas(element, { useCORS: true });
    const link = document.createElement('a');
    link.download = `${manga.name}-page-${currentIndex + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('reader-content');
    if (!element) return;
    const canvas = await html2canvas(element, { useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${manga.name}-page-${currentIndex + 1}.pdf`);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Rail Metadata (Zen Aesthetic) */}
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="fixed left-0 top-0 bottom-0 w-20 border-r border-white/10 hidden md:flex flex-col items-center justify-between py-12 z-40 bg-neutral-950/20 backdrop-blur-sm"
          >
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-neutral-600 [writing-mode:vertical-rl] rotate-180">
              ZEN PROTOCOL // 2.04
            </div>
            <div className="w-1 h-12 bg-brand" />
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-neutral-600 [writing-mode:vertical-rl] rotate-180">
              VOLUMI EDITORIAL
            </div>
          </motion.div>

          {/* Top Bar Editorial */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center"
          >
            <div className="w-full max-w-6xl flex items-start justify-between bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
              <div className="flex gap-8">
                <button 
                  onClick={onClose}
                  className="group flex flex-col items-center gap-1 text-neutral-500 hover:text-brand transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span className="text-[8px] uppercase tracking-widest font-black">Exit</span>
                </button>
                <div className="flex flex-col">
                  <h1 className="editorial-title text-4xl text-white mb-1 leading-none uppercase italic">{manga.name}</h1>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand">CHAPTER REVELATION</span>
                     <div className="h-px w-8 bg-white/10" />
                     <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500">PAG. {currentIndex + 1} / {manga.pages.length}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex bg-black p-1.5 border border-white/5 rounded-2xl gap-1">
                  <ModeButton 
                    active={settings.mode === 'horizontal-rtl'} 
                    onClick={() => onSettingsChange({ mode: 'horizontal-rtl' })}
                    icon={<ArrowDown className="w-3 h-3 rotate-90" />}
                    label="MANGA (RTL)"
                  />
                  <ModeButton 
                    active={settings.mode === 'horizontal-ltr'} 
                    onClick={() => onSettingsChange({ mode: 'horizontal-ltr' })}
                    icon={<ArrowDown className="w-3 h-3 -rotate-90" />}
                    label="COMIC (LTR)"
                  />
                  <ModeButton 
                    active={settings.mode === 'vertical'} 
                    onClick={() => onSettingsChange({ mode: 'vertical' })}
                    icon={<ArrowDown className="w-3 h-3" />}
                    label="STRIP"
                  />
                </div>

                <div className="flex bg-black p-1.5 border border-white/5 rounded-2xl gap-1">
                  <ModeButton 
                    active={settings.viewMode === 'single'} 
                    onClick={() => onSettingsChange({ viewMode: 'single' })}
                    icon={<Square className="w-3 h-3" />}
                    label="1 PAG"
                  />
                  <ModeButton 
                    active={settings.viewMode === 'double'} 
                    onClick={() => onSettingsChange({ viewMode: 'double' })}
                    icon={<Columns className="w-3 h-3" />}
                    label="2 PAGS"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExportPNG}
                    className="p-3 bg-white/5 hover:bg-neutral-800 rounded-2xl transition-all text-neutral-400 group flex items-center gap-2"
                    title="Export as PNG"
                  >
                    <FileImage className="w-4 h-4" />
                    <span className="text-[8px] uppercase tracking-widest font-black hidden lg:inline">PNG</span>
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    className="p-3 bg-white/5 hover:bg-neutral-800 rounded-2xl transition-all text-neutral-400 group flex items-center gap-2"
                    title="Export as PDF"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-[8px] uppercase tracking-widest font-black hidden lg:inline">PDF</span>
                  </button>
                </div>

                <button 
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else if (document.exitFullscreen) {
                      document.exitFullscreen();
                    }
                  }}
                  className="p-3 bg-white/5 hover:bg-brand hover:text-white rounded-2xl transition-all text-neutral-400 group"
                >
                  <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Nav Cinematic */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-6"
          >
            <div className="max-w-4xl mx-auto flex flex-col gap-6 bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.8)]">
              <div className="relative h-1 bg-white/5 rounded-full overflow-hidden group cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max={manga.pages.length - 1}
                  value={currentIndex}
                  onChange={(e) => onPageChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="absolute top-0 left-0 h-full bg-brand transition-all duration-300 shadow-[0_0_15px_rgba(230,0,18,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => onPageChange(currentIndex - (settings.viewMode === 'double' ? 2 : 1))}
                  disabled={currentIndex === 0}
                  className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-brand disabled:opacity-20 transition-colors"
                >
                  ← Previous
                </button>
                
                <div className="editorial-title text-5xl italic text-white/10 select-none">
                   {String(currentIndex + 1).padStart(2, '0')}
                </div>

                <button 
                  onClick={() => onPageChange(currentIndex + (settings.viewMode === 'double' ? 2 : 1))}
                  disabled={currentIndex >= manga.pages.length - 1}
                  className="bg-brand text-white px-8 py-3 text-[10px] uppercase tracking-[0.4em] font-black hover:scale-105 active:scale-95 transition-all rounded-full shadow-lg shadow-brand/20"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModeButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all duration-500",
        active ? "bg-brand text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
