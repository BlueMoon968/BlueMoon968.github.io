import { memo } from 'react'
import { SPRITES } from '../data/sprites'

interface SpriteProps {
  name: string
  scale?: number
  className?: string
}

function getColor(ch: string): string {
  if (ch === '1') return 'var(--c1)'
  if (ch === '2') return 'var(--c2)'
  if (ch === '3') return 'var(--c3)'
  if (ch === '0') return 'var(--c0)'
  return 'transparent'
}

export const Sprite = memo(function Sprite({ name, scale = 4, className }: SpriteProps) {
  const art = SPRITES[name]
  if (!art) return null

  const rows = art.trim().split('\n').map(r => r.trim())
  const h = rows.length
  const w = Math.max(...rows.map(r => r.length))

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${w}, ${scale}px)`,
        gridTemplateRows: `repeat(${h}, ${scale}px)`,
        imageRendering: 'pixelated',
        lineHeight: 0,
        flexShrink: 0,
      }}
    >
      {rows.flatMap((row, y) =>
        row.padEnd(w, '.').split('').map((ch, x) => (
          <div
            key={`${y}-${x}`}
            style={{ width: scale, height: scale, background: getColor(ch) }}
          />
        ))
      )}
    </div>
  )
})
