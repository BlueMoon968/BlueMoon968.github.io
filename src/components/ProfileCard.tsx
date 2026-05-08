import { useBM } from '../context/BMContext'
import { usePlaytime } from '../hooks/usePlaytime'
import { Sprite } from './Sprite'

const BARS = [
  { label: 'HP', cls: 'hp', target: 86, val: '86 / 100' },
  { label: 'MP', cls: 'mp', target: 62, val: '62 / 100' },
  { label: 'EXP', cls: 'exp', target: 74, val: 'LV 28' },
]

const BADGES = [
  { glyph: '★', title: 'First commit' },
  { glyph: '♥', title: 'Game jam' },
  { glyph: '✦', title: 'Released' },
  { glyph: '♪', title: 'Open source' },
  { glyph: '◆', title: 'Pixel artist' },
  { glyph: '♫', title: 'Chiptune' },
  null,
  null,
]

export function ProfileCard() {
  const { t } = useBM()
  const playtime = usePlaytime()

  return (
    <div className="profile">
      <div className="head">
        <div className="portrait">
          <Sprite name="hero" scale={5} className="bob" />
        </div>
        <div className="head-info">
          <div className="name">LUCA<br />MASTROIANNI</div>
          <div className="role">{t('role').toUpperCase()}</div>
          <div className="id-row">ID · 968</div>
        </div>
      </div>

      <div className="bars">
        {BARS.map(bar => (
          <div key={bar.label} className="bar-row">
            <div className="bar-label">{bar.label}</div>
            <div className="bar-track">
              <div
                className={`bar-fill ${bar.cls}`}
                style={{ width: `${bar.target}%`, transition: 'width 0.6s steps(20)' }}
              />
            </div>
            <div className="bar-val">{bar.val}</div>
          </div>
        ))}
      </div>

      <div className="badges-row">
        {BADGES.map((b, i) =>
          b ? (
            <div key={i} className="badge-cell" title={b.title}>
              <span className="glyph">{b.glyph}</span>
            </div>
          ) : (
            <div key={i} className="badge-cell empty" />
          )
        )}
      </div>

      <div className="playtime">
        PLAYTIME · <span className="clock">{playtime}</span>
      </div>
    </div>
  )
}
