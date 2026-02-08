import { useState, useEffect } from 'react'
import { Trophy, Target, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GoalsWidget() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('regina-goals')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Ser la mejor Project Manager 👩‍💼' },
      { id: 2, text: 'Viajar a Europa contigo ✈️' }
    ]
  })
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    localStorage.setItem('regina-goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setGoals([...goals, { id: Date.now(), text: inputValue }])
    setInputValue('')
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col relative overflow-hidden group">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 p-2 rounded-full text-orange-500">
            <Target size={18} />
          </span>
          <h3 className="font-bold text-slate-700">Metas y Sueños</h3>
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