import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Circle, ListTodo, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase'

export default function FocusWidget() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('todos').select('*').order('inserted_at', { ascending: false })
    if (!error) setTasks(data || [])
    setLoading(false)
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    const user = (await supabase.auth.getUser()).data.user
    const { data, error } = await supabase.from('todos').insert([{ text: inputValue, user_id: user.id }]).select()
    if (!error) { setTasks([data[0], ...tasks]); setInputValue('') }
  }

  const toggleTask = async (id, currentStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t))
    await supabase.from('todos').update({ is_completed: !currentStatus }).eq('id', id)
  }

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id))
    await supabase.from('todos').delete().eq('id', id)
  }

  const completedCount = tasks.filter(t => t.is_completed).length
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-loyal-pink-light h-64 flex flex-col relative overflow-hidden">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-loyal-cream p-2 rounded-full text-loyal-pink-dark">
            <ListTodo size={18} />
          </span>
          <h3 className="font-bold italic text-loyal-text">Focus Mode {loading && '...'}</h3>
        </div>
        <span className="text-xs font-bold text-loyal-text/50 bg-loyal-cream px-2 py-1 rounded-full">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {/* Input */}
      <form onSubmit={addTask} className="flex gap-2 mb-4 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="¿Qué haremos hoy?..."
          className="flex-1 bg-loyal-cream/50 border border-transparent focus:border-loyal-pink-mid rounded-xl px-4 py-2 text-sm outline-none text-loyal-text placeholder:text-loyal-text/40 italic"
        />
        <button type="submit" disabled={!inputValue.trim()} className="bg-loyal-pink-dark text-white p-2 rounded-xl hover:bg-loyal-text transition-colors">
          <Plus size={18} />
        </button>
      </form>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 z-10 custom-scrollbar">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${task.is_completed ? 'bg-loyal-cream/30 border-transparent' : 'bg-white border-loyal-cream'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={() => toggleTask(task.id, task.is_completed)} className={`flex-shrink-0 ${task.is_completed ? 'text-loyal-pink-dark' : 'text-loyal-pink-light hover:text-loyal-pink-dark'}`}>
                  {task.is_completed ? <Check size={20} /> : <Circle size={20} />}
                </button>
                <span className={`text-sm truncate font-serif ${task.is_completed ? 'text-loyal-text/40 line-through italic' : 'text-loyal-text'}`}>
                  {task.text}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-loyal-pink-mid hover:text-loyal-pink-dark">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Barra Progreso */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-loyal-cream">
        <motion.div className="h-full bg-loyal-peach" animate={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}