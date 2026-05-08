import { useState, useEffect } from 'react'
import { useBM } from '../context/BMContext'

interface TweakState {
  zoom: number
  crt: boolean
}

function loadTweaks(): TweakState {
  try { return { zoom: 1.0, crt: false, ...JSON.parse(localStorage.getItem('bm_tweaks') || '{}') } }
  catch { return { zoom: 1.0, crt: false } }
}

interface TweaksPanelProps {
  visible: boolean
  onClose: () => void
}

export function TweaksPanel({ visible, onClose }: TweaksPanelProps) {
  const { muted, setMuted, t } = useBM()
  const [state, setState] = useState<TweakState>(loadTweaks)

  useEffect(() => {
    try { localStorage.setItem('bm_tweaks', JSON.stringify(state)) } catch { /* */ }
    document.documentElement.classList.toggle('crt', state.crt)
    const stage = document.getElementById('stage')
    if (stage) {
      const sx = window.innerWidth / 1280
      const sy = window.innerHeight / 720
      const base = Math.min(sx, sy)
      stage.style.transform = `scale(${base * state.zoom})`
    }
  }, [state])

  if (!visible) return null

  return (
    <div className="tweaks-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 11 }}>★ TWEAKS</span>
        <button
          onClick={onClose}
          style={{
            background: 'var(--c3)', color: 'var(--c0)', border: 'none',
            padding: '3px 6px', fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
          }}
        >✕</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ marginBottom: 8 }}>{t('zoom')} · {state.zoom.toFixed(2)}×</div>
        <input
          type="range" min={0.5} max={1.5} step={0.05} value={state.zoom}
          style={{ width: '100%' }}
          onChange={e => setState(s => ({ ...s, zoom: parseFloat(e.target.value) }))}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ marginBottom: 6 }}>{t('crt')} SCANLINES</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ON', 'OFF'] as const).map(v => (
            <button
              key={v}
              onClick={() => setState(s => ({ ...s, crt: v === 'ON' }))}
              style={{
                flex: 1, padding: '6px 8px',
                background: (v === 'ON') === state.crt ? 'var(--c3)' : 'var(--c0)',
                color: (v === 'ON') === state.crt ? 'var(--c0)' : 'var(--c3)',
                border: '2px solid var(--c3)', fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
              }}
            >{v}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ marginBottom: 6 }}>{t('sound')}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ON', 'OFF'] as const).map(v => (
            <button
              key={v}
              onClick={() => setMuted(v === 'OFF')}
              style={{
                flex: 1, padding: '6px 8px',
                background: (v === 'OFF') === muted ? 'var(--c3)' : 'var(--c0)',
                color: (v === 'OFF') === muted ? 'var(--c0)' : 'var(--c3)',
                border: '2px solid var(--c3)', fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
              }}
            >{v}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '2px dashed var(--c2)', fontSize: 8, opacity: 0.8 }}>
        Tip: type{' '}
        <span style={{ background: 'var(--c3)', color: 'var(--c0)', padding: '2px 4px' }}>BLUEMOON</span>
        {' '}to swap palette.
      </div>
    </div>
  )
}
