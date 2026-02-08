import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Circle, ListTodo } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase' // Importamos la conexión

export default function FocusWidget() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. CARGAR TAREAS DE SUPABASE
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false })
    
    if (error) console.error('Error cargando:', error)
    else setTasks(data || [])
    setLoading(false)
  }

  // 2. AGREGAR TAREA A LA NUBE
  const addTask = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const user = (await supabase.auth.getUser()).data.user
    
    // Insertamos en la DB
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text: inputValue, user_id: user.id }])
      .select()

    if (error) {
      console.error(error)
    } else {
      setTasks([data[0], ...tasks]) // Actualizamos visualmente
      setInputValue('')
    }
  }

  // 3. ACTUALIZAR ESTADO (CHECK)
  const toggleTask = async (id, currentStatus) => {
    // Actualizamos visualmente primero (Optimistic UI)
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t))

    // Actualizamos en la DB
    await supabase.from('todos').update({ is_completed: !currentStatus }).eq('id', id)
  }

  // 4. BORRAR
  const deleteTask = async (id) => {
    // Visual primero
    setTasks(tasks.filter(t => t.id !== id))
    // DB después
    await supabase.from('todos').delete().eq('id', id)
  }

  // Calcular progreso
  const completedCount = tasks.filter(t => t.is_completed).length
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col relative overflow-hidden">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-pastel-blue/30 p-2 rounded-full text-blue-500">
            <ListTodo size={18} />
          </span>
          <h3 className="font-bold text-slate-700">Focus Mode {loading && '...'}</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {/* Input */}
      <form onSubmit={addTask} className="flex gap-2 mb-4 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="¿Qué haremos hoy, Inge?..."
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pastel-blue outline-none text-slate-700"
        />
        <button type="submit" disabled={!inputValue.trim()} className="bg-slate-800 text-white p-2 rounded-xl">
          <Plus size={18} />
        </button>
      </form>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 z-10 custom-scrollbar">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${task.is_completed ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={() => toggleTask(task.id, task.is_completed)} className={`flex-shrink-0 ${task.is_completed ? 'text-pastel-blue' : 'text-slate-300'}`}>
                  {task.is_completed ? <Check size={20} /> : <Circle size={20} />}
                </button>
                <span className={`text-sm truncate ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.text}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Barra Progreso */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
        <motion.div className="h-full bg-pastel-blue" animate={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}