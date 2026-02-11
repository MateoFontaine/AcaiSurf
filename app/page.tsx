'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { enviarQueja } from './actions'; 

export default function Home() {
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState<'rating' | 'form' | 'success'>('rating');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Referencia al contenedor para calcular el ancho al deslizar
  const starsContainerRef = useRef<HTMLDivElement>(null);

  // TU LINK CON EL PLACE ID (YA CONFIGURADO)
  const GOOGLE_REVIEW_LINK = "https://search.google.com/local/writereview?placeid=ChIJMSTpPwCdnJURc-Lm7IarJ9M"; 

  // --- LÓGICA DEL SWIPE (DESLIZAR) ---
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!starsContainerRef.current) return;

    // 1. Obtenemos medidas del contenedor
    const { left, width } = starsContainerRef.current.getBoundingClientRect();
    
    // 2. Vemos dónde está el dedo (o mouse)
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

    // 3. Calculamos porcentaje y asignamos estrellas
    const x = clientX - left;
    const percent = x / width;
    let newRating = Math.ceil(percent * 5);

    // Límites (para que no de 0 ni 6)
    if (newRating < 1) newRating = 1;
    if (newRating > 5) newRating = 5;

    setRating(newRating);
  };

  // --- CUANDO LEVANTA EL DEDO (CONFIRMAR) ---
  const handleInteractionEnd = () => {
    if (rating === 0) return;

    // Pequeño delay para ver la selección antes de cambiar de pantalla
    setTimeout(() => {
      if (rating >= 4) {
        // ÉXITO: Abrir Google y mostrar gracias
        window.open(GOOGLE_REVIEW_LINK, '_blank');
        setStep('success');
      } else {
        // QUEJA: Ir al formulario
        setStep('form');
      }
    }, 200);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append('rating', rating.toString());
    
    const result = await enviarQueja(formData);
    
    setIsSubmitting(false);
    if (result?.success) {
      setStep('success');
    } else {
      alert("Hubo un error. Por favor, intentá de nuevo.");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2e1065] to-[#000000] p-4 font-sans overflow-hidden relative selection:bg-purple-500/30">
      
      {/* Fondos decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Tarjeta Principal */}
      <motion.div 
        layout
        className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 md:p-12 relative z-10">
          
          <AnimatePresence mode="wait">
            
            {/* --- PASO 1: SELECCIÓN DE ESTRELLAS (AHORA CON SWIPE) --- */}
            {step === 'rating' && (
              <motion.div
                key="step-rating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col items-center text-center space-y-8"
              >
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-[10px] font-bold tracking-widest text-purple-200 uppercase mb-2 border border-purple-500/30">
                    Feedback
                  </span>
                  <h1 className="text-3xl font-bold text-white">
                    ¿Cómo estuvo tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Acai</span>?
                  </h1>
                  <p className="text-white/50 text-sm">Deslizá el dedo para calificar</p>
                </div>

                {/* --- CONTENEDOR TÁCTIL --- */}
                <div 
                  ref={starsContainerRef}
                  // Eventos de Mouse (PC)
                  onMouseMove={handleTouchMove}
                  onClick={handleInteractionEnd}
                  onMouseLeave={() => setRating(0)}
                  // Eventos Táctiles (Celular)
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleInteractionEnd}
                  // CLASES CLAVE: touch-none (evita scroll), cursor-pointer
                  className="flex gap-1 py-4 px-2 cursor-pointer touch-none select-none hover:scale-105 transition-transform"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      className="p-1"
                      animate={{ 
                        scale: rating >= star ? 1.2 : 1,
                        rotate: rating >= star ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star 
                        size={46} 
                        fill={rating >= star ? "#fbbf24" : "transparent"} 
                        className={`transition-colors duration-100 drop-shadow-lg ${
                          rating >= star ? 'text-yellow-400' : 'text-white/10'
                        }`} 
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  ))}
                </div>
                {/* --- FIN CONTENEDOR --- */}

              </motion.div>
            )}

            {/* --- PASO 2: FORMULARIO --- */}
            {step === 'form' && (
              <motion.div
                key="step-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <button 
                    onClick={() => setStep('rating')} 
                    className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white/70"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-white">Cuéntanos qué pasó</h2>
                </div>

                <form action={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative group">
                      <textarea 
                        name="comment"
                        required
                        placeholder="Escribí acá tu experiencia..."
                        className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none h-32"
                      />
                      <MessageSquare className="absolute top-4 right-4 text-white/10 pointer-events-none group-focus-within:text-purple-500/50 transition-colors" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="text"
                      name="contact"
                      placeholder="Email o teléfono (Opcional)"
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Enviando...</span>
                    ) : (
                      <>
                        <span>Enviar Comentario Privado</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- PASO 3: ÉXITO --- */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/10">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                   >
                     <CheckCircle className="text-green-400 w-10 h-10" />
                   </motion.div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">¡Muchas Gracias!</h2>
                  <p className="text-white/60 max-w-[260px] mx-auto text-sm leading-relaxed">
                    {rating >= 4 
                      ? "Te agradecemos por tomarte el tiempo de calificarnos en Google. 💜" 
                      : "Tu mensaje fue enviado directamente al dueño. Gracias por ayudarnos a mejorar."}
                  </p>
                </div>

                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-purple-200 hover:text-white transition-colors border border-white/5"
                >
                  Volver al inicio
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center w-full opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] tracking-widest uppercase text-white">Powered by Devoys</p>
      </div>
    </main>
  );
}