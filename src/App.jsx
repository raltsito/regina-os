import { useState, useEffect, useRef } from 'react'
import { Heart, Moon, Sun, Image as ImageIcon, X, LogOut, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase' 
import Auth from './Auth' 

import MotivationWidget from './MotivationWidget'
import FocusWidget from './FocusWidget'
import AudioWidget from './AudioWidget'
import JournalWidget from './JournalWidget'
import GoalsWidget from './GoalsWidget'
import BibleWidget from './BibleWidget'

function App() {
  const [session, setSession] = useState(null)
  const [date, setDate] = useState(new Date())
  const [isDark, setIsDark] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState('')
  const confettiCount = useRef(0)

  const photos = [
    '/nosotros.jpeg',
    '/nosotros2.jpeg',
    '/nosotros3.jpeg'
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleOpenPhoto = () => {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)]
    setCurrentPhoto(randomPhoto)
    setShowPhoto(true)
  }

  const launchConfetti = () => {
    if (confettiCount.current >= 3) return; 
    confettiCount.current += 1;
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F4C5D7', '#E981A4', '#FEC9C3'], 
        shapes: ['circle', 'heart'] 
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F4C5D7', '#E981A4', '#FEC9C3'],
        shapes: ['circle', 'heart']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    setTimeout(() => {
      confettiCount.current = Math.max(0, confettiCount.current - 1);
    }, 2500);
  }

  const formattedDate = date.toLocaleDateString('es-MX', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  })

  if (!session) {
    return <Auth />
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 font-serif ${isDark ? 'bg-[#2D1B22]' : 'bg-loyal-cream'}`}>
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 py-8 pb-32">

        {/* HEADER */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-loyal-text/50 mb-1">
              {formattedDate}
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold italic tracking-tight transition-colors ${isDark ? 'text-white' : 'text-loyal-text'}`}>
              Hola, Regi <span className="inline-block text-loyal-pink-dark">.</span>
            </h1>
          </div>
          
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 hover:bg-white text-loyal-text transition-all">
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-full bg-white/50 hover:bg-white text-loyal-text transition-all">
               <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* --- GRID MAESTRO --- */}
        {/* Usamos 'grid-cols-1' para móvil (pila vertical) y 'md:grid-cols-2' para PC (2 columnas simétricas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* BLOQUE 1: BIBLIA y MOTIVACIÓN */}
          {/* Orden: Mobile (1º), Desktop (2º - Lado Derecho) */}
          <div className="order-1 md:order-2 grid grid-cols-2 gap-4 h-full">
            <div className="col-span-1 h-full min-h-[10rem]">
               <BibleWidget compact={true} />
            </div>
            <div className="col-span-1 h-full min-h-[10rem]">
               <MotivationWidget compact={true} />
            </div>
          </div>

          {/* BLOQUE 2: FOCUS (Cosas por hacer) */}
          {/* Orden: Mobile (2º), Desktop (1º - Lado Izquierdo) */}
          <div className="order-2 md:order-1 w-full min-h-[16rem]">
            <FocusWidget />
          </div>

          {/* BLOQUE 3: BITÁCORA */}
          {/* Orden: Mobile (3º), Desktop (3º - Lado Izquierdo Abajo) */}
          <div className="order-3 md:order-3 w-full min-h-[16rem]">
            <JournalWidget />
          </div>

          {/* BLOQUE 4: METAS */}
          {/* Orden: Mobile (4º), Desktop (4º - Lado Derecho Abajo) */}
          <div className="order-4 md:order-4 w-full min-h-[16rem]">
            <GoalsWidget />
          </div>

          {/* BLOQUE 5: AUDIO MAMÁ */}
          {/* Orden: Mobile (5º), Desktop (5º - Abajo Completo) */}
          <div className="order-5 md:order-5 md:col-span-2 w-full">
            <AudioWidget />
          </div>

        </div>
      </div>

      {/* BOTONES FLOTANTES */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button 
            onClick={handleOpenPhoto}
            className="p-4 rounded-full bg-loyal-pink-dark text-white shadow-xl shadow-loyal-pink-dark/30 hover:scale-110 active:scale-95 transition-all transform hover:-rotate-12"
        >
            <ImageIcon size={28} />
        </button>
        <button 
            onClick={launchConfetti}
            className="p-4 rounded-full bg-white text-loyal-pink-dark shadow-xl shadow-loyal-pink-dark/10 hover:scale-110 active:scale-95 transition-all hover:animate-pulse"
        >
            <Heart size={28} fill="currentColor" />
        </button>
      </div>

      {/* MODAL FOTO */}
      <AnimatePresence>
        {showPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setShowPhoto(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white p-3 rounded-[2rem] shadow-2xl max-w-sm w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPhoto(false)}
                className="absolute -top-4 -right-4 bg-loyal-text text-white p-2 rounded-full shadow-lg z-10"
              >
                <X size={20} />
              </button>
              
              <div className="rounded-[1.5rem] overflow-hidden aspect-[3/4] bg-loyal-cream relative">
                <img 
                  src={currentPhoto} 
                  alt="Nosotros" 
                  className="w-full h-full object-cover"
                  decoding="async" 
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 pt-20">
                  <p className="text-white font-serif italic text-xl text-center">
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