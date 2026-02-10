import { useState, useRef } from 'react'
import { Play, Pause, Music, Volume2 } from 'lucide-react'

export default function AudioWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-loyal-pink-light h-64 flex flex-col justify-between relative overflow-hidden group">
      
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-loyal-text/5 rounded-full border-4 border-loyal-cream flex items-center justify-center animate-spin-slow opacity-50">
        <div className="w-10 h-10 bg-loyal-peach rounded-full"></div>
      </div>

      <div className="z-10">
        <div className="bg-loyal-cream w-fit p-2 rounded-full mb-3 text-loyal-pink-dark">
          <Music size={20} />
        </div>
        <h3 className="font-bold text-xl text-loyal-text italic">Mensaje de Mamá</h3>
        <p className="text-sm text-loyal-text/60 italic">Siempre contigo</p>
      </div>

      <div className="flex items-end gap-1 h-12 mb-2 z-10 opacity-80">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 bg-loyal-pink-mid rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-2'}`}
            style={{ height: isPlaying ? `${Math.random() * 100}%` : '8px' }}
          ></div>
        ))}
      </div>

      <div className="flex items-center gap-4 z-10">
        <button 
          onClick={togglePlay}
          className="bg-loyal-pink-dark text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md shadow-loyal-pink-light"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        
        <div className="flex-1 bg-loyal-cream h-2 rounded-full overflow-hidden">
          <div className={`h-full bg-loyal-pink-dark transition-all duration-1000 ${isPlaying ? 'w-full' : 'w-0'}`}></div>
        </div>
        
        <Volume2 size={20} className="text-loyal-text/40" />
      </div>

      <audio ref={audioRef} src="/mama.mp3" onEnded={() => setIsPlaying(false)} />
    </div>
  )
}