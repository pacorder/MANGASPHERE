import React, { useCallback, useState } from 'react';
import { Upload, FileArchive, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { processCBZ, MangaFile } from '@/src/lib/cbz';
import { motion, AnimatePresence } from 'motion/react';

interface MangaUploaderProps {
  onUpload: (manga: MangaFile) => void;
}

export function MangaUploader({ onUpload }: MangaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.cbz')) {
      alert('Por favor, sube un archivo .cbz');
      return;
    }

    setIsProcessing(true);
    try {
      const manga = await processCBZ(file);
      onUpload(manga);
    } catch (error) {
      console.error('Error al procesar el manga:', error);
      alert('Error al procesar el archivo CBZ.');
    } finally {
      setIsProcessing(false);
    }
  }, [onUpload]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 cinematic-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale blur-3xl pointer-events-none" />

      {/* Modern Editorial Layout */}
      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col md:flex-row items-end justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-0.5 bg-brand" />
            <span className="text-xs uppercase tracking-[0.5em] font-bold text-brand">V.2.04 • ZEN VIEWER</span>
          </div>
          
          <h1 className="editorial-title text-[12vw] md:text-[8rem] text-white leading-none">
            Manga<br/>
            <span className="text-brand">Sphere</span>
          </h1>
          
          <div className="mt-12 flex gap-12 text-[10px] uppercase tracking-[0.3em] font-medium text-neutral-500">
            <div className="space-y-1">
              <p className="text-neutral-400">Optimized for</p>
              <p>IMMERSIÓN TOTAL</p>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-400">Format</p>
              <p>COMIC ARCHIVE (.CBZ)</p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           className="w-full max-w-sm"
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={cn(
              "relative group aspect-[3/4] flex flex-col items-center justify-center border border-white/10 transition-all duration-700",
              "bg-white/5 backdrop-blur-2xl hover:bg-white/10",
              isDragging && "border-brand border-2 scale-[1.02]",
              isProcessing && "pointer-events-none"
            )}
          >
            <input
              type="file"
              accept=".cbz"
              onChange={onFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              disabled={isProcessing}
            />

            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 animate-spin text-brand" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Procesando...</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  className="flex flex-col items-center text-center p-8"
                >
                  <div className="mb-8 p-6 rounded-full border border-white/10 group-hover:bg-brand group-hover:border-brand transition-all duration-500">
                    <FileArchive className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold tracking-widest mb-2 uppercase">Cargar archivo</h3>
                  <p className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase leading-relaxed">
                    Arrastra tu archivo aquí para iniciar la secuencia de lectura
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Bottom Cinematic Textures */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-20">
        <p className="text-[4rem] font-serif italic font-black text-black">A CINEMATIC EXPERIENCE</p>
      </div>
    </div>
  );
}
