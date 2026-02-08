import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Circle, ListTodo } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FocusWidget() {
  // 1. Cargar tareas guardadas o usar las de ejemplo
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('regina-tasks')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Tomar agüita 💧', completed: false },
      { id: 2, text: 'Ser increíble hoy ✨', completed: true }
    ]
  })
  const [inputValue, setInputValue] = useState('')

  // 2. Guardar automáticamente cada vez que cambian las tareas
  useEffect(() => {
    localStorage.setItem('regina-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Lógica para agregar
  const addTask = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false
    }
    
    setTasks([newTask, ...tasks])
    setInputValue('')
  }

  // Lógica para completar/descompletar
  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  // Lógica para borrar
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  // Calcular progreso
  const completedCount = tasks.filter(t => t.completed).length
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100

  return (
    <div className="md:col-span-2 lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col relative overflow-hidden">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-pastel-blue/30 p-2 rounded-full text-blue-500">
            <ListTodo size={18} />
          </span>
          <h3 className="font-bold text-slate-700">Focus Mode</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {/* Input para nueva tarea */}
      <form onSubmit={addTask} className="flex gap-2 mb-4 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="¿Qué haremos hoy, Inge?..."
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pastel-blue outline-none transition-all placeholder:text-slate-400 text-slate-700"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-slate-800 text-white p-2 rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Lista de Tareas (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 z-10 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${task.completed ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 hover:border-pastel-blue'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 transition-colors ${task.completed ? 'text-pastel-blue' : 'text-slate-300 hover:text-pastel-blue'}`}
                >
                  {task.completed ? <Check size={20} strokeWidth={3} /> : <Circle size={20} />}
                </button>
                <span className={`text-sm truncate transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.text}
                </span>
              </div>
              
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all p-1"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
          
          {tasks.length === 0 && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center text-slate-300 text-sm mt-8 italic"
            >
              Todo limpio. ¡A descansar o crear! 🍃
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Barra de Progreso Inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
        <motion.div 
          className="h-full bg-pastel-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}