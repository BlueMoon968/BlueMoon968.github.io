import { useBM } from '../context/BMContext'
import { Sprite } from './Sprite'

export function TitleStrip() {
  const { lang, setLang, palette, blip } = useBM()

  function switchLang(l: 'en' | 'it') {
    setLang(l)
    blip(660, 0.05)
  }

  return (
    <div className="title-strip">
      <div className="left">
        <Sprite name="moon" scale={2} />
        <span>BLUEMOON · PAUSE</span>
        <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 8 }}>
          ▌ <span className="saving-dot" /> SAVED
        </span>
      </div>
      <div className="right">
        <button
          className="pill"
          data-active={lang === 'en' ? 'true' : 'false'}
          type="button"
          onClick={() => switchLang('en')}
        >
          EN
        </button>
        <button
          className="pill"
          data-active={lang === 'it' ? 'true' : 'false'}
          type="button"
          onClick={() => switchLang('it')}
        >
          IT
        </button>
        <span style={{ opacity: 0.5, paddingLeft: 8 }}>
          ★ <span>{palette.toUpperCase()}</span>
        </span>
      </div>
    </div>
  )
}
