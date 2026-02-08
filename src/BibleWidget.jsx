import { useState } from 'react'
import { BookOpen, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const verses = [
  { text: "Todo lo puedo en Cristo que me fortalece.", cite: "Filipenses 4:13" },
  { text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes.", cite: "Josué 1:9" },
  { text: "Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de calamidad.", cite: "Jeremías 29:11" },
  { text: "El Señor es mi pastor, nada me faltará.", cite: "Salmos 23:1" },
  { text: "No temas, porque yo estoy contigo; no te angusties, porque yo soy tu Dios.", cite: "Isaías 41:10" },
  { text: "Echa sobre Jehová tu carga, y él te sustentará.", cite: "Salmos 55:22" }
]

export default function BibleWidget() {
  const [index, setIndex] = useState(0)

  const nextVerse = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * verses.length)
    } while (newIndex === index)
    setIndex(newIndex)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
      
      {/* Fondo Decorativo (Cruz sutil o luz) */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>

      {/* Encabezado */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="bg-blue-50 p-2 rounded-full text-blue-600">
            <BookOpen size={18} />
          </span>
          <h3 className="font-bold text-slate-700">Palabra Diaria</h3>
        </div>
        <button onClick={nextVerse} className="p-2 hover:bg-slate-50 rounded-full transition-colors active:rotate-180 duration-500">
          <RefreshCw size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Versículo */}
      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 mt-2 cursor-pointer" onClick={nextVerse}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg font-serif text-slate-700 italic leading-relaxed">
              "{verses[index].text}"
            </p>
            <p className="mt-3 text-xs font-bold text-blue-400 uppercase tracking-widest">
              {verses[index].cite}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}