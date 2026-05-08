import { useBM } from '../../context/BMContext'
import { useTypewriter } from '../../hooks/useTypewriter'

const SKILLS = ['PIXEL ART', 'CHIPTUNE', 'GAMEFEEL', 'GODOT · UNITY', 'GLSL', 'SOLO DEV', 'ASEPRITE', 'WEB']

const STAT_CELLS = [
  { label: 'BASED IN', value: 'ITALY' },
  { label: 'CLASS', value: 'SOLO' },
  { label: 'SINCE', value: '2017' },
]

export function BioTab() {
  const { t } = useBM()
  const { displayed, done } = useTypewriter(t('bio_text'), 22)

  return (
    <>
      <div className={`dialog-box${done ? ' cursor-blink' : ''}`}>
        {displayed}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        {STAT_CELLS.map(cell => (
          <div
            key={cell.label}
            style={{ background: 'var(--c0)', border: '3px solid var(--c3)', padding: 10, textAlign: 'center' }}
          >
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 8, color: 'var(--c2)' }}>
              {cell.label}
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 11, marginTop: 6 }}>
              {cell.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 9, marginBottom: 8, color: 'var(--c2)' }}>
        SKILLS
      </div>
      <div className="chips">
        {SKILLS.map(s => <span key={s} className="chip">{s}</span>)}
      </div>
    </>
  )
}
