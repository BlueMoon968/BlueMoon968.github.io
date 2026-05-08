import { useState, useEffect } from 'react'
import { blip } from '../utils/audio'

export function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    let cancelled = false
    let timerId: ReturnType<typeof setTimeout>

    function tick() {
      if (cancelled) return
      if (i >= text.length) {
        setDone(true)
        return
      }
      const ch = text[i++]
      setDisplayed(prev => prev + ch)
      if (ch !== ' ' && i % 2 === 0) blip(440 + (i % 5) * 20, 0.015, 'square', 0.015)
      const delay = ch === '.' ? speed * 4 : ch === ',' ? speed * 2 : speed
      timerId = setTimeout(tick, delay)
    }

    tick()
    return () => {
      cancelled = true
      clearTimeout(timerId)
    }
  }, [text, speed])

  return { displayed, done }
}
