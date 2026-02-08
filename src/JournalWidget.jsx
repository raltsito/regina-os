import { useState, useEffect } from 'react'
import { BookHeart, Send, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase'

export default function JournalWidget() {
  const [entries, setEntries] = useState([])
  const [text, setText] = useState('')
  const [mood, setMood] = useState('😊')
  const [loading, setLoading] = useState(true)

  // 1. CARGAR DIARIO
  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('journal')
      .select('*')
      .order('inserted_at', { ascending: false })

    if (!error) setEntries(data || [])
    setLoading(false)
  }

  // 2. AGREGAR ENTRADA
  const addEntry = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    const user = (await supabase.auth.getUser()).data.user
    const dateDisplay = new Date().toLocaleDateString('es-MX', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    })

    const { data, error } = await supabase
      .from('journal')
      .insert([{ 
        text, 
        mood, 
        date_display: dateDisplay, 
        user_id: user.id 
      }])
      .select()

    if (!error) {
      setEntries([data[0], ...entries])
      setText('')
    }
  }

  // 3. BORRAR ENTRADA
  const deleteEntry = async (id) => {
    setEntries(entries.filter(entry => entry.id !== id))
    await supabase.from('journal').delete().eq('id', id)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col relative overflow-hidden group">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 p-2 rounded-full text-yellow-600">
            <BookHeart size={18} />
          </span>
          <h3 className="font-bold text-slate-700 flex gap-2 items-center">
            Bitácora {loading && <Loader2 size={14} className="animate-spin" />}
          </h3>
        </div>
        <div className="flex gap-1 bg-slate-50 rounded-full p-1">
          {['😊', '😐', '😔'].map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`p-1 rounded-full transition-all hover:scale-110 ${mood === m ? 'bg-white shadow-sm' : 'opacity-50'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={addEntry} className="flex gap-2 mb-4 relative z-10">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Cómo te sientes hoy?..."
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-200 outline-none transition-all placeholder:text-slate-400 text-slate-700"
        />
        <button 
          type="submit"
          disabled={!text.trim()}
          className="bg-yellow-300 text-yellow-800 p-2 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Send size={18} />
        </button>
      </form>

      {/* Lista de Entradas */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar z-10">
        <AnimatePresence>
          {entries.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group/card"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xl">{entry.mood}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {entry.date_display}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-snug">
                {entry.text}
              </p>
              
              <button 
                onClick={() => deleteEntry(entry.id)}
                className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 text-slate-300 hover:text-red-400 transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
           {!loading && entries.length === 0 && (
            <p className="text-center text-slate-300 text-xs mt-6 italic">
              Escribe tu primer recuerdo... 🖊️
            </p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decoración */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
    </div>
  )
}