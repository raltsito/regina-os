import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const verses = [
  { text: "Todo lo puedo en Cristo que me fortalece.", cite: "Fil. 4:13" },
  { text: "Mira que te mando que te esfuerces y seas valiente.", cite: "Jos. 1:9" },
  { text: "Porque yo sé los planes que tengo para vosotros.", cite: "Jer. 29:11" },
  { text: "El Señor es mi pastor, nada me faltará.", cite: "Sal. 23:1" },
  { text: "No temas, porque yo estoy contigo.", cite: "Isa. 41:10" }
]

export default function BibleWidget() {
  const [index, setIndex] = useState(0)

  const nextVerse = () => {
    let newIndex;
    do { newIndex = Math.floor(Math.random() * verses.length) } while (newIndex === index)
    setIndex(newIndex)
  }

  return (
    <div 
      onClick={nextVerse}
      className="h-full w-full bg-white rounded-[2rem] p-5 shadow-sm border border-loyal-pink-light/30 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
    >
      {/* Icono Cabecera */}
      <div className="flex items-center gap-2">
        <span className="bg-loyal-cream p-2 rounded-full text-loyal-pink-dark">
          <BookOpen size={16} />
        </span>
      </div>

      {/* Contenido Centralizado */}
      <div className="flex-1 flex flex-col justify-center items-start mt-2">
        <AnimatePresence mode='wait'>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-serif text-loyal-text italic leading-snug font-medium">
              "{verses[index].text}"
            </p>
            <p className="mt-2 text-[10px] font-bold text-loyal-pink-dark uppercase tracking-widest">
              {verses[index].cite}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decoración Sutil */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-loyal-pink-light/20 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  )
}