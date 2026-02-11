'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { enviarQueja } from './actions'; // Asegurate de tener tu archivo actions.ts

export default function Home() {
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState<'rating' | 'form' | 'success'>('rating');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ⚠️ IMPORTANTE: REEMPLAZÁ ESTO CON TU LINK DE RESEÑA DIRECTA ---
  // Si usás el link con PlaceID, se abre el popup de estrellas directo.
  const GOOGLE_REVIEW_LINK = "https://search.google.com/local/writereview?placeid=ChIJMSTpPwCdnJURc-Lm7IarJ9M"; 
  // Si no tenés el ID a mano, usá el link corto que tenías:
  // const GOOGLE_REVIEW_LINK = "https://share.google/uvQnQiOShCURBzqK7";

  const handleRate = (star: number) => {
    setRating(star);
    
    if (star >= 4) {
      // CASO ÉXITO: 4 o 5 Estrellas
      // 1. Abrimos Google Maps en una pestaña nueva INMEDIATAMENTE
      window.open(GOOGLE_REVIEW_LINK, '_blank');
      
      // 2. Mostramos mensaje de agradecimiento en la pantalla
      setStep('success');
    } else {
      // CASO QUEJA: 1, 2 o 3 Estrellas
      // Pequeño delay para que la animación de la estrella se vea antes de cambiar
      setTimeout(() => {
        setStep('form');
      }, 300);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append('rating', rating.toString()); // Agregamos las estrellas al form
    
    const result = await enviarQueja(formData); // Llamamos al Server Action
    
    setIsSubmitting(false);
    if (result?.success) {
      setStep('success');
    } else {
      alert("Hubo un error. Por favor, intentá de nuevo.");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2e1065] to-[#000000] p-4 font-sans overflow-hidden relative">
      
      {/* Fondos decorativos (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Tarjeta Principal Glassmorphism */}
      <motion.div 
        layout
        className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 md:p-12 relative z-10">
          
          <AnimatePresence mode="wait">
            
            {/* --- PASO 1: SELECCIÓN DE ESTRELLAS --- */}
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
                  <p className="text-white/50 text-sm">Tu opinión nos ayuda a mejorar cada día.</p>
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRate(star)}
                      className="focus:outline-none transition-transform"
                    >
                      <Star 
                        size={46} 
                        fill={rating >= star ? "#fbbf24" : "transparent"} 
                        className={`transition-all duration-300 drop-shadow-lg ${
                          rating >= star ? 'text-yellow-400' : 'text-white/10 hover:text-white/30'
                        }`} 
                        strokeWidth={1.5}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- PASO 2: FORMULARIO DE QUEJA (1-3 Estrellas) --- */}
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

            {/* --- PASO 3: ÉXITO (Para ambos casos) --- */}
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