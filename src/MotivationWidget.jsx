import { useState } from 'react'
import { Quote, RefreshCw, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const phrases = [
  // --- ROCK LEE & ANIME ---
  { text: "Mi lema es ser más fuerte que ayer. Si es necesario, estaré más fuerte que hace medio día, incluso más fuerte que hace un minuto.", author: "Rock Lee" },
  { text: "Un héroe no es el que nunca cae. Es el que se levanta, una y otra vez, sin perder de vista sus sueños.", author: "Rock Lee" },
  { text: "Nunca retrocederé a mi palabra. ¡Ese es mi camino ninja!", author: "Naruto Uzumaki" },

  // --- ATLETAS ---
  { text: "Ningún humano es limitado.", author: "Eliud Kipchoge" },
  { text: "El dolor es temporal. La satisfacción es para siempre.", author: "Atletismo" },

  // --- MAMÁ (Transcritas del audio) ---
  { text: "Para mí eres la niña más valiente, más fuerte, más lista, más inteligente, más atleta.", author: "Mamá" },
  { text: "Nunca cambies, mi amor, ese corazón tan grande.", author: "Mamá" },
  { text: "Quiero verte ganar, mi amor, quiero verte lograr todo.", author: "Mamá" },
  { text: "Aún cuando se ponga todo difícil, nena, ya sabes con quién recurrir.", author: "Mamá" },
  { text: "Siempre voy a estar bien agradecida con Dios por darme la mejor hija de todo el mundo.", author: "Mamá" },

  // --- CARLOS (TÚ) ---
  { text: "Vivo si me exiges.", author: "Carlos" },
  { text: "No tengo nada y te doy todo si tan solo me lo pides.", author: "Carlos" },
  { text: "Cuando triunfes yo no estaré sorprendido porque sé cuánto te has esforzado.", author: "Carlos" },
  { text: "¡Te amo preciosa hermosa!", author: "Carlos" }
]

export default function MotivationWidget() {
  const [index, setIndex] = useState(0)

  const nextPhrase = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * phrases.length)
    } while (newIndex === index)
    setIndex(newIndex)
  }

  // Detectamos quién es el autor para cambiar el color del ícono
  const isLove = phrases[index].author === "Mamá" || phrases[index].author === "Carlos";

  return (
    <div className="relative h-64 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow duration-300">
      
      {/* Icono de fondo decorativo */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        {isLove ? <Heart size={80} className="text-pastel-pink rotate-12" /> : <Quote size={80} className="text-pastel-blue rotate-12" />}
      </div>

      {/* Cabecera */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className={`p-2 rounded-full ${isLove ? 'bg-pastel-pink/30 text-pink-600' : 'bg-pastel-blue/30 text-blue-600'}`}>
            {isLove ? <Heart size={18} /> : <Quote size={18} />}
          </span>
          <h3 className="font-bold text-slate-700">Tu Nindo</h3>
        </div>
        
        <button onClick={nextPhrase} className="p-2 hover:bg-slate-50 rounded-full transition-colors active:rotate-180 duration-500">
          <RefreshCw size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Frase */}
      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 mt-2 cursor-pointer" onClick={nextPhrase}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed italic">
              "{phrases[index].text}"
            </p>
            <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${isLove ? 'text-pastel-pink' : 'text-pastel-blue'}`}>
              - {phrases[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}