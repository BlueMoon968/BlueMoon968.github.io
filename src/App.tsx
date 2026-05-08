import { useState, useEffect, useRef, useCallback } from 'react'
import { useBM } from './context/BMContext'
import { TitleStrip } from './components/TitleStrip'
import { ProfileCard } from './components/ProfileCard'
import { ContentPanel } from './components/ContentPanel'
import { BottomBar } from './components/BottomBar'
import { TweaksPanel } from './components/TweaksPanel'
import { Sprite } from './components/Sprite'

type TabName = 'bio' | 'projects' | 'contacts'
const TAB_ORDER: TabName[] = ['bio', 'projects', 'contacts']
const TAB_COUNTS: Record<TabName, string> = { bio: '·', projects: '×6', contacts: '×3' }
const BLUEMOON_SEQ = 'BLUEMOON'

export function App() {
  const { t, toggleLang, blip, chord, cyclePalette } = useBM()
  const [currentTab, setCurrentTab] = useState<TabName>('bio')
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const bufferRef = useRef('')

  const fit = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    const sx = window.innerWidth / 1280
    const sy = window.innerHeight / 720
    const s = Math.min(sx, sy)
    el.style.transform = `scale(${s})`
    el.style.transformOrigin = 'center center'
  }, [])

  useEffect(() => {
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [fit])

  function switchTab(name: TabName) {
    setCurrentTab(name)
    chord([520, 720], 0.06)
  }

  function pressA() {
    chord([720, 960], 0.05)
  }

  function pressB() {
    switchTab('bio')
    blip(380, 0.06)
  }

  function tabUp() {
    const idx = TAB_ORDER.indexOf(currentTab)
    switchTab(TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length])
  }
  function tabDown() {
    const idx = TAB_ORDER.indexOf(currentTab)
    switchTab(TAB_ORDER[(idx + 1) % TAB_ORDER.length])
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Easter egg: type BLUEMOON
      const k = (e.key || '').toUpperCase()
      if (k.length === 1 && /[A-Z]/.test(k)) {
        bufferRef.current = (bufferRef.current + k).slice(-BLUEMOON_SEQ.length)
        if (bufferRef.current === BLUEMOON_SEQ) {
          cyclePalette()
          bufferRef.current = ''
        }
      }

      // Lang toggle
      if (k === 'L' && !e.ctrlKey && !e.metaKey) {
        toggleLang()
        return
      }

      if (e.key === 'ArrowDown') { e.preventDefault(); tabDown() }
      else if (e.key === 'ArrowUp') { e.preventDefault(); tabUp() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); tabDown() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); tabUp() }
      else if (['Enter', ' ', 'a', 'A', 'z', 'Z'].includes(e.key)) {
        e.preventDefault(); pressA()
      } else if (['b', 'B', 'Escape', 'x', 'X'].includes(e.key)) {
        e.preventDefault(); pressB()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  return (
    <div className="stage-fit">
      <div className="stage" id="stage" ref={stageRef} data-screen-label="02 Pause Menu">
        <TitleStrip />

        <div className="grid">
          {/* Tab list */}
          <div className="tabs">
            {TAB_ORDER.map(tab => (
              <div
                key={tab}
                className="tab"
                data-tab={tab}
                data-active={currentTab === tab ? 'true' : 'false'}
                onClick={() => switchTab(tab)}
              >
                <span className="icon">
                  <Sprite
                    name={tab === 'bio' ? 'book' : tab === 'projects' ? 'cart' : 'env'}
                    scale={tab === 'contacts' ? 4 : 2}
                  />
                </span>
                <span className="label">{t(tab)}</span>
                <span className="count">{TAB_COUNTS[tab]}</span>
              </div>
            ))}
          </div>

          <ProfileCard />
          <ContentPanel currentTab={currentTab} />
        </div>

        <BottomBar
          currentTab={currentTab}
          onTabChange={switchTab}
          onPressA={pressA}
          onPressB={pressB}
        />

        <TweaksPanel visible={tweaksOpen} onClose={() => setTweaksOpen(false)} />
      </div>
    </div>
  )
}
