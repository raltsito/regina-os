import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Heart, Music } from 'lucide-react'

export default function AudioWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)

  // Inicializamos el audio
  useEffect(() => {
    // Asegúrate de que el nombre del archivo coincida con el de la carpeta public
    audioRef.current = new Audio('/mama.mp3') 
    
    // Actualizar barra de progreso
    audioRef.current.ontimeupdate = () => {
      const duration = audioRef.current.duration || 100 // Evitar división por cero
      const current = audioRef.current.currentTime
      setProgress((current / duration) * 100)
    }

    // Cuando termine, resetear
    audioRef.current.onended = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    return () => {
      audioRef.current.pause() // Pausar si cerramos la app
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="md:col-span-2 lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Fondo con gradiente animado sutil */}
      <div className={`absolute inset-0 bg-gradient-to-br from-pastel-purple/10 to-pastel-pink/10 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>

      {/* Cabecera */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="font-bold text-slate-700 text-lg">Cajita de Amor</h3>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Now Playing</p>
        </div>
        <div className="bg-pastel-purple/20 p-2 rounded-full text-purple-400 animate-pulse">
          <Music size={20} />
        </div>
      </div>

      {/* Centro: El "Vinilo" o Foto */}
      <div className="flex items-center gap-4 z-10 mt-2">
        {/* Este círculo girará cuando suene la música */}
        <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-purple-200 to-pink-200 border-4 border-white shadow-md flex items-center justify-center transition-transform duration-[3000ms] ease-linear ${isPlaying ? 'rotate-[360deg]' : 'rotate-0'}`}>
          <Heart size={32} className={`text-white drop-shadow-sm ${isPlaying ? 'animate-pulse' : ''}`} fill="currentColor" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-lg leading-tight">Mensaje Especial</h4>
          <p className="text-slate-500 text-sm">De: Mamá </p>
        </div>
      </div>

      {/* Controles y Barra */}
      <div className="z-10 mt-auto">
        <div className="flex items-center gap-3 mb-2">
           {/* Botón Play/Pause Gigante */}
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>

          {/* Onda de sonido visual (decorativa) */}
          <div className="flex-1 flex items-center gap-1 h-8 px-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} 
                className={`w-1 bg-pastel-purple rounded-full transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-1'}`}
                style={{ height: isPlaying ? `${Math.random() * 24 + 4}px` : '4px', animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Barra de Progreso Real */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-800 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

    </div>
  )
}