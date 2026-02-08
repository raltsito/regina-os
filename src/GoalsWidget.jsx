import { useState, useEffect } from 'react'
import { Trophy, Target, Plus, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase'

export default function GoalsWidget() {
  const [goals, setGoals] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. CARGAR METAS
  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('inserted_at', { ascending: false })
    
    if (!error) setGoals(data || [])
    setLoading(false)
  }

  // 2. AGREGAR META
  const addGoal = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const user = (await supabase.auth.getUser()).data.user
    
    // Insertar en Supabase
    const { data, error } = await supabase
      .from('goals')
      .insert([{ text: inputValue, user_id: user.id }])
      .select()

    if (!error) {
      setGoals([data[0], ...goals])
      setInputValue('')
    }
  }

  // 3. BORRAR META
  const deleteGoal = async (id) => {
    // Optimistic UI (borrar visualmente rápido)
    setGoals(goals.filter(g => g.id !== id))
    // Borrar en DB
    await supabase.from('goals').delete().eq('id', id)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col relative overflow-hidden group">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 p-2 rounded-full text-orange-500">
            <Target size={18} />
          </span>
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            Metas {loading && <Loader2 size={14} className="animate-spin" />}
          </h3>
        </div>
        <Trophy size={18} className="text-yellow-400" />
      </div>

      {/* Input */}
      <form onSubmit={addGoal} className="flex gap-2 mb-2 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Un sueño por cumplir..."
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-slate-400 text-slate-700"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-orange-400 text-white p-2 rounded-xl hover:bg-orange-500 transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Lista de Metas */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar z-10">
        <AnimatePresence>
          {goals.map(goal => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-white border border-orange-100 group/item"
            >
              <span className="text-sm font-medium text-slate-700">⭐ {goal.text}</span>
              <button 
                onClick={() => deleteGoal(goal.id)}
                className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-400 transition-all"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}