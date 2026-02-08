import { useState, useEffect, useRef } from 'react'
import { Heart, Moon, Sun, Image as ImageIcon, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import GoalsWidget from './GoalsWidget' // <--- IMPORTA ESTO
import BibleWidget from './BibleWidget' // <--- IMPORTA ESTO
// Importamos los widgets
import MotivationWidget from './MotivationWidget'
import FocusWidget from './FocusWidget'
import AudioWidget from './AudioWidget'
import JournalWidget from './JournalWidget'

function App() {
  const [date, setDate] = useState(new Date())
  const [isDark, setIsDark] = useState(false)
  
  // Estado para la foto modal
  const [showPhoto, setShowPhoto] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState('')

  // Control de Confeti (Anti-Lag)
  const confettiCount = useRef(0)

  // TUS FOTOS
  const photos = [
    '/nosotros.jpeg',
    '/nosotros2.jpeg',
    '/nosotros3.jpeg'
  ]

  // OPTIMIZACIÓN 1: Pre-cargar imágenes en segundo plano
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Función: Modo Oscuro
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  // Función: Abrir Foto Sorpresa
  const handleOpenPhoto = () => {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)]
    setCurrentPhoto(randomPhoto)
    setShowPhoto(true)
  }

  // OPTIMIZACIÓN 2: Confeti Limitado (Máximo 3 a la vez)
  const launchConfetti = () => {
    if (confettiCount.current >= 3) return; // Si hay 3 activos, no hace nada

    confettiCount.current += 1; // Sumamos 1 al contador

    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD6E0', '#FF69B4', '#C1E7F5'],
        shapes: ['circle', 'heart'] 
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD6E0', '#FF69B4', '#C1E7F5'],
        shapes: ['circle', 'heart']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Liberamos el contador después de 2.5 segundos
    setTimeout(() => {
      confettiCount.current = Math.max(0, confettiCount.current - 1);
    }, 2500);
  }

  const formattedDate = date.toLocaleDateString('es-MX', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  })

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDark ? 'bg-regina-dark' : 'bg-regina-bg'}`}>
      
      {/* HEADER */}
      <header className="flex justify-between items-start pt-8 px-6 md:px-10 mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Hola, Regi <span className="inline-block animate-bounce text-pastel-pink"></span>
          </h1>
          <p className={`capitalize text-lg mt-1 font-medium transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {formattedDate}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleOpenPhoto}
            className={`p-3 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}
          >
            <ImageIcon className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
          </button>

          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}
          >
            {isDark ? 
              <Sun className="w-6 h-6 group-hover:text-yellow-400 transition-colors" /> : 
              <Moon className="w-6 h-6 group-hover:text-indigo-400 transition-colors" />
            }
          </button>

          <button 
            onClick={launchConfetti}
            className={`p-3 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}
          >
            <Heart className="w-6 h-6 text-pastel-pink fill-pastel-pink group-hover:animate-pulse" />
          </button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10">
        
        {/* Columna 1: Motivación y Fe */}
        <div className="space-y-6">
          <FocusWidget />
          <BibleWidget />
        </div>

        {/* Columna 2: Productividad */}
        <div className="space-y-6">
           <MotivationWidget />
           <JournalWidget />
        </div>

        {/* Columna 3: Emociones y Recuerdos */}
        <div className="space-y-6">
          <AudioWidget />
          <GoalsWidget />
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-xs py-4 font-medium opacity-60">
        Regina OS v1.0 • Hecho con 💚 por Ralts
      </footer>

      {/* MODAL: FOTO FLOTANTE OPTIMIZADO */}
      <AnimatePresence>
        {showPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Reduje el blur a backdrop-blur-sm para mejorar rendimiento
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowPhoto(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
              className="bg-white p-3 md:p-4 rounded-3xl shadow-2xl max-w-sm md:max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPhoto(false)}
                className="absolute -top-3 -right-3 bg-red-400 text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 relative">
                {/* OPTIMIZACIÓN 3: decoding="async" para no bloquear el hilo principal */}
                <img 
                  src={currentPhoto} 
                  alt="Nosotros" 
                  className="w-full h-full object-cover"
                  decoding="async" 
                />
                
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
                  <p className="text-white font-bold text-lg text-center drop-shadow-md">
                    "Te amo chaparra!" 
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default App