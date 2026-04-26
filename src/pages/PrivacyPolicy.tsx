import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPolicy() {
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
        
        <h1 className="editorial-title text-5xl md:text-7xl text-white mb-12">Política de Privacidad</h1>
        
        <div className="space-y-8 text-sm leading-relaxed tracking-wide">
          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Introducción</h2>
            <p>En MangaSphere, valoramos tu privacidad. Esta política describe cómo manejamos la información en nuestra plataforma de visualización de archivos CBZ.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Datos Locales</h2>
            <p>MangaSphere procesa tus archivos .cbz localmente en tu navegador. Nosotros NO subimos tus archivos de manga a nuestros servidores. Todo el procesamiento de imágenes ocurre en tu dispositivo.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Google AdSense</h2>
            <p>Utilizamos Google AdSense para mostrar anuncios. Google puede utilizar cookies para mostrar anuncios basados en tus visitas previas a este u otros sitios web.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Cookies</h2>
            <p>Utilizamos cookies esenciales para el funcionamiento técnico de la aplicación y para análisis anónimos que nos ayudan a mejorar la experiencia del usuario.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
