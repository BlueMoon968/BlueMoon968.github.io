import { useState, useEffect } from 'react'

export function usePlaytime() {
  const [startedAt] = useState(Date.now)
  const [display, setDisplay] = useState('000:00')

  useEffect(() => {
    const id = setInterval(() => {
      const t = Math.floor((Date.now() - startedAt) / 1000)
      const m = String(Math.floor(t / 60)).padStart(3, '0')
      const s = String(t % 60).padStart(2, '0')
      setDisplay(`${m}:${s}`)
    }, 500)
    return () => clearInterval(id)
  }, [startedAt])

  return display
}
