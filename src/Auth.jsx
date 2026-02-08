import { useState } from 'react'
import { supabase } from './supabase'
import { Heart, Loader2 } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Intentamos iniciar sesión
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      // Si falla, intentamos registrar (Sign Up) automáticamente para facilitar
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) alert("Error: " + signUpError.message)
      else alert("¡Cuenta creada! Revisa tu correo para confirmar (o entra directo si no requiere confirmación).")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-regina-bg flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="bg-pastel-pink/30 p-4 rounded-full animate-bounce">
            <Heart size={40} className="text-pastel-pink fill-pastel-pink" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Regina OS</h1>
        <p className="text-slate-500 mb-6">te amo preciosa hermosa!!!</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Tu correo"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pastel-pink transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña secreta"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pastel-pink transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={loading}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Acceder al mejor Habit Tracker'}
          </button>
        </form>
        <p className="text-xs text-slate-300 mt-4">Solo para personal autorizado (Tú)</p>
      </div>
    </div>
  )
}