import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  "Ese es mi Camino Ninja.", 
  "El trabajo duro derrota al talento.",
  "No he vuelto, soy mejor.", 
  "La duda mata más sueños que el fracaso.",
  "Todo es posible para quien cree.",
  "Sin disculpas."
]

export default function MotivationWidget() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length)
    }, 8000) // Un poco más rápido
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-full w-full bg-loyal-pink-dark rounded-[2rem] p-5 shadow-sm shadow-loyal-pink-dark/20 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Icono Blanco */}
      <div className="flex items-center gap-2">
        <span className="bg-white/20 p-2 rounded-full text-white">
          <Sparkles size={16} />
        </span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-start mt-2">
        <AnimatePresence mode='wait'>
          <motion.p
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-lg md:text-xl font-serif italic text-white leading-tight font-medium"
          >
            {quotes[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
    </div>
  )
}