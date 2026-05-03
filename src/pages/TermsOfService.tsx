import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function TermsOfService() {
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
        
        <h1 className="editorial-title text-5xl md:text-7xl text-white mb-12">Términos de Servicio</h1>
        
        <div className="space-y-8 text-sm leading-relaxed tracking-wide">
          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Uso de la Aplicación</h2>
            <p>VOLUMI es una herramienta de visualización. El usuario es el único responsable del contenido legal que visualiza utilizando nuestra plataforma.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Propiedad Intelectual</h2>
            <p>No reclamamos propiedad sobre los archivos cargados por el usuario. La interfaz y el código de VOLUMI son propiedad exclusiva de sus creadores.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">// Limitación de Responsabilidad</h2>
            <p>VOLUMI se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables de pérdidas de datos resultantes del uso de la aplicación.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
