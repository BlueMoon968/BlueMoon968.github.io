import { useState } from 'react'
import { useBM } from '../context/BMContext'

type TabName = 'bio' | 'projects' | 'contacts'
const TAB_ORDER: TabName[] = ['bio', 'projects', 'contacts']

interface BottomBarProps {
  currentTab: TabName
  onTabChange: (t: TabName) => void
  onPressA: () => void
  onPressB: () => void
}

export function BottomBar({ currentTab, onTabChange, onPressA, onPressB }: BottomBarProps) {
  const { t, blip } = useBM()
  const [flashA, setFlashA] = useState(false)
  const [flashB, setFlashB] = useState(false)
  const [flashDir, setFlashDir] = useState<string | null>(null)

  function flash(setter: (v: boolean) => void) {
    setter(true)
    setTimeout(() => setter(false), 100)
  }

  function flashDpad(dir: string) {
    setFlashDir(dir)
    setTimeout(() => setFlashDir(null), 100)
  }

  function pressUp() {
    const idx = TAB_ORDER.indexOf(currentTab)
    onTabChange(TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length])
    blip(440, 0.03)
  }
  function pressDown() {
    const idx = TAB_ORDER.indexOf(currentTab)
    onTabChange(TAB_ORDER[(idx + 1) % TAB_ORDER.length])
    blip(440, 0.03)
  }

  const tabIdx = TAB_ORDER.indexOf(currentTab)

  return (
    <div className="bottom-bar">
      <div className="bb-left">
        <div className="dpad">
          <div className="empty" />
          <button
            data-dir="up"
            data-flash={flashDir === 'up' ? 'true' : 'false'}
            type="button"
            onClick={() => { pressUp(); flashDpad('up') }}
          >▲</button>
          <div className="empty" />

          <button
            data-dir="left"
            data-flash={flashDir === 'left' ? 'true' : 'false'}
            type="button"
            onClick={() => { pressUp(); flashDpad('left') }}
          >◀</button>
          <div className="center" />
          <button
            data-dir="right"
            data-flash={flashDir === 'right' ? 'true' : 'false'}
            type="button"
            onClick={() => { pressDown(); flashDpad('right') }}
          >▶</button>

          <div className="empty" />
          <button
            data-dir="down"
            data-flash={flashDir === 'down' ? 'true' : 'false'}
            type="button"
            onClick={() => { pressDown(); flashDpad('down') }}
          >▼</button>
          <div className="empty" />
        </div>
        <div className="key-hint"><kbd>↑↓</kbd> {t('tip_arrows')}</div>
      </div>

      <div className="bb-right">
        <div className="minimap">
          {TAB_ORDER.map((_, i) => (
            <div key={i} data-on={i === tabIdx ? 'true' : 'false'} />
          ))}
        </div>
        <div className="key-hint"><kbd>L</kbd> EN/IT</div>
        <div className="key-hint" style={{ opacity: 0.7 }}>type BLUEMOON ✨</div>
        <div className="ab-buttons">
          <button
            className="abtn"
            data-flash={flashB ? 'true' : 'false'}
            type="button"
            onClick={() => { onPressB(); flash(setFlashB) }}
          >B</button>
          <button
            className="abtn"
            data-flash={flashA ? 'true' : 'false'}
            type="button"
            onClick={() => { onPressA(); flash(setFlashA) }}
          >A</button>
        </div>
      </div>
    </div>
  )
}
