import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-300 p-8 md:p-24 selection:bg-brand/30">
      <div className="grain" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-brand mb-12 hover:gap-3 transition-all uppercase tracking-[0.3em] text-[10px] font-black">
          <ChevronLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <h1 className="editorial-title text-5xl md:text-7xl text-white mb-12">Sobre MangaSphere</h1>
        
        <div className="space-y-8 text-sm leading-relaxed tracking-wide">
          <p className="text-lg text-white font-medium italic">
            "Redefiniendo la forma en que los entusiastas del manga interactúan con sus colecciones digitales."
          </p>
          
          <p>MangaSphere nació como un proyecto dedicado a la excelencia visual y la simplicidad técnica. Nuestra misión es proporcionar el visor de archivos CBZ más fluido, moderno y cinematográfico disponible en la web.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="p-6 border border-white/5 bg-white/5 rounded-2xl">
              <Mail className="w-6 h-6 text-brand mb-4" />
              <h3 className="text-white font-bold mb-2 uppercase tracking-tighter">Contacto</h3>
              <p className="text-xs">support@mangasphere.app</p>
            </div>
            <div className="p-6 border border-white/5 bg-white/5 rounded-2xl">
              <Globe className="w-6 h-6 text-brand mb-4" />
              <h3 className="text-white font-bold mb-2 uppercase tracking-tighter">Comunidad</h3>
              <p className="text-xs">Discord / Twitter / Github</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
