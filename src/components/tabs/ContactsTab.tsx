import { useState } from 'react'
import { useBM } from '../../context/BMContext'
import { useTypewriter } from '../../hooks/useTypewriter'
import { CONTACTS } from '../../data/contacts'
import { Sprite } from '../Sprite'

export function ContactsTab() {
  const { t, blip } = useBM()
  const [focus, setFocus] = useState(0)

  const { displayed, done } = useTypewriter(t('contacts_intro'), 22)

  return (
    <>
      <div className={`dialog-box${done ? ' cursor-blink' : ''}`}>
        {displayed}
      </div>

      <div className="contacts-list">
        {CONTACTS.map((c, i) => (
          <a
            key={c.id}
            className="contact-row"
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            data-focus={i === focus ? 'true' : 'false'}
            onMouseEnter={() => { setFocus(i); blip(620, 0.03) }}
          >
            <span className="icon">
              <Sprite name={c.icon} scale={3} />
            </span>
            <span className="lbl">{c.lbl}</span>
            <span>{c.val}</span>
            <span className="arrow">▶</span>
          </a>
        ))}
      </div>
    </>
  )
}
