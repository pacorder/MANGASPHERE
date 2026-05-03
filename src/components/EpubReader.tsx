import { useEffect, useRef, useState, useCallback } from 'react';
import ePub, { Rendition, Book } from 'epubjs';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Settings, Maximize2, X, List } from 'lucide-react';

interface EpubReaderProps {
  file: File;
  onClose: () => void;
}

export function EpubReader({ file, onClose }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [showToc, setShowToc] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = ePub();
    bookRef.current = book;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (data) {
        await book.open(data as ArrayBuffer);
        
        const rendition = book.renderTo(viewerRef.current!, {
          width: '100%',
          height: '100%',
          flow: 'paginated',
          manager: 'default',
        });
        
        renditionRef.current = rendition;

        rendition.display();
        
        book.loaded.metadata.then((meta) => setMetadata(meta));
        book.loaded.navigation.then((nav) => setToc(nav.toc));

        rendition.on('relocated', (location: any) => {
          setLocation(location);
        });

        // Aplicar estilos iniciales
        rendition.themes.default({
          'body': {
            'background': 'transparent !important',
            'color': '#d4d4d4 !important',
            'font-family': "'Inter', sans-serif !important",
            'line-height': '1.6 !important',
            'padding': '0 40px !important'
          },
          'h1, h2, h3, h4, h5, h6': {
            'color': '#ffffff !important'
          }
        });

        setIsLoaded(true);
      }
    };
    reader.readAsArrayBuffer(file);

    return () => {
      if (bookRef.current) {
        bookRef.current.destroy();
      }
    };
  }, [file]);

  const prevPage = useCallback(() => {
    renditionRef.current?.prev();
  }, []);

  const nextPage = useCallback(() => {
    renditionRef.current?.next();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  const handleFontSizeChange = (delta: number) => {
    const newSize = fontSize + delta;
    if (newSize >= 50 && newSize <= 200) {
      setFontSize(newSize);
      renditionRef.current?.themes.fontSize(`${newSize}%`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d0d0d] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:block">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand mb-0.5">LECTURA EN CURSO</h2>
            <p className="text-[9px] uppercase tracking-[0.1em] text-neutral-400 font-bold truncate max-w-[200px]">
              {metadata?.title || 'Cargando Libro...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-xl transition-all ${showToc ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'hover:bg-white/5 text-neutral-400'}`}
          >
            <List className="w-5 h-5" />
          </button>
          <div className="flex items-center bg-white/5 rounded-2xl p-1">
            <button onClick={() => handleFontSizeChange(-10)} className="px-3 py-1 text-[10px] font-black hover:text-white transition-colors">-A</button>
            <div className="w-px h-3 bg-white/10" />
            <button onClick={() => handleFontSizeChange(10)} className="px-3 py-1 text-[10px] font-black hover:text-white transition-colors">+A</button>
          </div>
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-grow relative flex overflow-hidden">
        {/* TOC Sidebar */}
        <AnimatePresence>
          {showToc && (
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-[#121212] border-r border-white/5 z-20 flex flex-col"
            >
              <div className="p-6 border-b border-white/5">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/50">Índice de contenidos</h3>
              </div>
              <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                {toc.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      renditionRef.current?.display(item.href);
                      setShowToc(false);
                    }}
                    className="w-full text-left p-3 text-[10px] uppercase tracking-wider font-bold text-neutral-500 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-grow relative bg-[#0b0b0b]">
           <div ref={viewerRef} className="w-full h-full max-w-3xl mx-auto" />
           
           {/* Navigation Hitboxes */}
           <div 
             className="absolute left-0 top-0 bottom-0 w-1/4 cursor-w-resize z-10" 
             onClick={prevPage}
           />
           <div 
             className="absolute right-0 top-0 bottom-0 w-1/4 cursor-e-resize z-10" 
             onClick={nextPage}
           />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 px-8 py-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-t border-white/5 mt-auto">
        <button 
          onClick={prevPage}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-neutral-500 hover:text-white transition-all"
        >
          <div className="p-2 border border-white/10 rounded-full group-hover:border-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Anterior
        </button>

        <div className="text-[9px] uppercase tracking-[0.5em] font-black text-neutral-600 hidden md:block">
          VOLUMI CINEMATIC INTERFACE
        </div>

        <button 
          onClick={nextPage}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-neutral-500 hover:text-white transition-all"
        >
          Siguiente
          <div className="p-2 bg-brand text-white rounded-full shadow-lg shadow-brand/20 group-hover:scale-110 transition-all">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
      
      <div className="grain pointer-events-none opacity-[0.03]" />
    </div>
  );
}
