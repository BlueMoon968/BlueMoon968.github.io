import { useState } from 'react'
import { useBM } from '../../context/BMContext'
import { useTypewriter } from '../../hooks/useTypewriter'
import { PROJECTS } from '../../data/projects'

export function ProjectsTab() {
  const { lang, t, blip } = useBM()
  const [focus, setFocus] = useState(0)

  const introText = lang === 'it'
    ? 'Cartucce attualmente in inventario. Scegline una per dettagli.'
    : 'Cartridges currently in inventory. Pick one for details.'

  const { displayed, done } = useTypewriter(introText, 18)

  const p = PROJECTS[focus]
  const desc = lang === 'it' ? p.desc_it : p.desc_en

  return (
    <>
      <div className={`dialog-box${done ? ' cursor-blink' : ''}`}>
        {displayed}
      </div>

      <div className="cart-grid">
        {PROJECTS.map((proj, i) => (
          <div
            key={proj.id}
            className="cart"
            data-focus={i === focus ? 'true' : 'false'}
            onMouseEnter={() => { setFocus(i); blip(620, 0.03) }}
            onClick={() => window.open('https://github.com/BlueMoon968', '_blank', 'noopener')}
          >
            <div className="cart-art" />
            <div className="nm">{proj.name}</div>
            <div className="meta">{proj.year} · {proj.type}</div>
          </div>
        ))}
      </div>

      <div className="project-detail">
        <div className="pd-head">
          <div className="pd-name">{p.name}</div>
          <div className="pd-meta">{p.year} · {p.type} · {p.status}</div>
        </div>
        <div className="pd-desc">{desc}</div>
        <div className="pd-actions">
          <a
            className="pd-action"
            href="https://github.com/BlueMoon968"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('view_on_github')}
          </a>
          <span className="pd-action alt">STACK · {p.stack}</span>
        </div>
      </div>
    </>
  )
}
