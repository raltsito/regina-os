import { useState, useEffect } from 'react'
import { Trophy, Target, Plus, X, Loader2, Star } from 'lucide-react' // Importamos Star
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase'

export default function GoalsWidget() {
  const [goals, setGoals] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    const { data, error } = await supabase.from('goals').select('*').order('inserted_at', { ascending: false })
    if (!error) setGoals(data || [])
    setLoading(false)
  }

  const addGoal = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    const user = (await supabase.auth.getUser()).data.user
    const { data, error } = await supabase.from('goals').insert([{ text: inputValue, user_id: user.id }]).select()
    if (!error) { setGoals([data[0], ...goals]); setInputValue('') }
  }

  const deleteGoal = async (id) => {
    setGoals(goals.filter(g => g.id !== id))
    await supabase.from('goals').delete().eq('id', id)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-loyal-pink-light h-64 flex flex-col relative overflow-hidden group">
      
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-loyal-cream p-2 rounded-full text-loyal-pink-dark">
            <Target size={18} />
          </span>
          <h3 className="font-bold italic text-loyal-text flex items-center gap-2">
            Metas {loading && <Loader2 size={14} className="animate-spin" />}
          </h3>
        </div>
        <Trophy size={18} className="text-loyal-peach" />
      </div>

      <form onSubmit={addGoal} className="flex gap-2 mb-2 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Un sueño..."
          className="flex-1 bg-loyal-cream/50 border-none rounded-xl px-4 py-2 text-sm outline-none placeholder:text-loyal-text/40 text-loyal-text italic focus:ring-1 focus:ring-loyal-pink-mid"
        />
        <button type="submit" disabled={!inputValue.trim()} className="bg-loyal-peach text-loyal-text font-bold p-2 rounded-xl hover:bg-loyal-pink-mid transition-colors">
          <Plus size={18} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar z-10">
        <AnimatePresence>
          {goals.map(goal => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-loyal-cream/40 to-white border border-loyal-cream group/item"
            >
              <div className="flex items-center gap-2">
                <Star size={14} className="text-loyal-peach fill-loyal-peach" /> 
                <span className="text-sm font-medium text-loyal-text italic">{goal.text}</span>
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover/item:opacity-100 text-loyal-pink-light hover:text-loyal-pink-dark transition-all">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}