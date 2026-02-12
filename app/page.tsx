'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, ExternalLink, MapPin } from 'lucide-react'; 
import { enviarQueja } from './actions'; 

export default function Home() {
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState<'rating' | 'form' | 'success'>('rating');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const ratingRef = useRef(0);
  const starsContainerRef = useRef<HTMLDivElement>(null);

  const GOOGLE_REVIEW_LINK = "https://search.google.com/local/writereview?placeid=ChIJMSTpPwCdnJURc-Lm7IarJ9M"; 
  const BANNER_URL = "https://lh3.googleusercontent.com/p/AF1QipPKgRqeQNwHUALU17fhN3YdD78C0NXqW2zwqHg1=s680-w680-h510-rw";
  const LOGO_URL = "https://lh3.googleusercontent.com/p/AF1QipMRoQo5wdydJ8BwJ8RT7sbsafWEI9ThXWM9hQoa=s680-w680-h510-rw"; 

  // --- LÓGICA SWIPE ---
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!starsContainerRef.current) return;
    const { left, width } = starsContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - left;
    const percent = x / width;
    let newRating = Math.ceil(percent * 5);
    if (newRating < 1) newRating = 1;
    if (newRating > 5) newRating = 5;
    setRating(newRating);
    ratingRef.current = newRating; 
  };

  const handleInteractionEnd = () => {
    const currentRating = ratingRef.current; 
    if (currentRating === 0) return;

    if (currentRating >= 4) {
      const newWindow = window.open(GOOGLE_REVIEW_LINK, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = GOOGLE_REVIEW_LINK;
      }
      setStep('success');
    } else {
      setTimeout(() => {
        setStep('form');
      }, 300);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append('rating', rating.toString());
    const result = await enviarQueja(formData);
    setIsSubmitting(false);
    if (result?.success) setStep('success');
    else alert("Error al enviar. Intenta de nuevo.");
  };

  return (
    // MAIN CONTAINER: Fondo neutro limpio
    <main className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-black p-4 font-sans text-slate-800 dark:text-slate-200 overflow-hidden">
      
      {/* --- FONDO ATMOSFÉRICO (Glows de Playa) --- */}
      
      {/* Luz 1: Cyan/Turquesa (Agua) - Arriba Izquierda */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-screen" />
      
      {/* Luz 2: Ámbar/Naranja (Sol/Arena) - Abajo Derecha */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-700/10 rounded-full blur-[120px] pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-screen" />
      
      {/* ------------------------------------------- */}

      {/* CARD: Con backdrop-blur para que se noten los colores de fondo a través (opcional) */}
      <motion.div 
        layout
        className="relative z-10 w-full max-w-[380px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden border border-white/50 dark:border-zinc-800"
      >
        
        <div className="h-36 w-full relative">
            <div 
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: `url(${BANNER_URL})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 dark:to-zinc-900/90" />
        </div>

        <div className="px-6 pb-8 relative">
            
            <div className="relative -mt-12 mb-3 flex justify-center">
                <div className="w-24 h-24 rounded-full border-[5px] border-white dark:border-zinc-900 shadow-md overflow-hidden bg-white dark:bg-zinc-800">
                    <img 
                        src={LOGO_URL} 
                        alt="Acai Surf Logo" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/10692/10692945.png" }}
                    />
                </div>
            </div>

          <AnimatePresence mode="wait">
            
            {/* --- PANTALLA 1 --- */}
            {step === 'rating' && (
              <motion.div
                key="step-rating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center"
              >
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  Acai Surf
                </h1>
                
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium mb-8">
                    <MapPin size={12} />
                    <span>Pinamar, Arg</span>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                  ¿Qué tal la experiencia?
                </p>

                {/* ESTRELLAS */}
                <div 
                  ref={starsContainerRef}
                  onMouseMove={handleTouchMove}
                  onClick={handleInteractionEnd}
                  onMouseLeave={() => { setRating(0); ratingRef.current = 0; }}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleInteractionEnd}
                  className="flex justify-center gap-3 py-6 px-2 w-full cursor-pointer touch-none select-none"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div 
                        key={star} 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                    >
                      <Star 
                        size={42} 
                        fill={rating >= star ? "#F59E0B" : "transparent"} 
                        className={`transition-all duration-200 ${
                            rating >= star 
                                ? 'text-amber-500 drop-shadow-sm' 
                                : 'text-slate-200 dark:text-zinc-700'
                        }`}
                        strokeWidth={1.5} 
                      />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-[10px] text-slate-300 dark:text-slate-600 font-medium tracking-widest uppercase mt-2">
                    Deslizá para calificar
                </p>
              </motion.div>
            )}

            {/* --- PANTALLA 2: FORMULARIO --- */}
            {step === 'form' && (
              <motion.div
                key="step-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-6 pt-2">
                  <button onClick={() => setStep('rating')} className="p-2 -ml-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-400">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Danos tu opinión</h2>
                </div>

                <form action={handleFormSubmit} className="space-y-4">
                  <div className="relative">
                    <textarea 
                        name="comment" 
                        required 
                        placeholder="Contanos qué pasó..." 
                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none h-32 text-sm"
                    />
                  </div>
                  <div>
                    <input 
                        type="text" 
                        name="contact" 
                        placeholder="Tu contacto (Opcional)" 
                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 dark:bg-black hover:bg-black dark:hover:bg-zinc-900 border border-transparent dark:border-zinc-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70 text-sm"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- PANTALLA 3: ÉXITO --- */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100 dark:border-amber-900/30">
                   <Star className="text-amber-500 w-8 h-8 fill-amber-500" />
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¡Gracias! 🤙</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 px-4 leading-relaxed">
                  {rating >= 4 
                    ? "Te estamos redirigiendo a Google. ¡Gracias por la buena onda!" 
                    : "Mensaje recibido. Gracias por ayudarnos a mejorar."}
                </p>

                {rating >= 4 && (
                    <a 
                      href={GOOGLE_REVIEW_LINK} 
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors mb-8"
                    >
                      <ExternalLink size={14} />
                      Si no abrió Google, click acá
                    </a>
                )}

                <button 
                    onClick={() => window.location.reload()}
                    className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 text-xs font-bold uppercase tracking-widest"
                >
                  Volver al inicio
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full z-10">
        <p className="text-[10px] text-slate-300 dark:text-zinc-700 font-medium">Powered by Devoys</p>
      </div>
    </main>
  );
}