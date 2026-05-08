import { useBM } from '../context/BMContext'
import { Sprite } from './Sprite'
import { BioTab } from './tabs/BioTab'
import { ProjectsTab } from './tabs/ProjectsTab'
import { ContactsTab } from './tabs/ContactsTab'
import { PROJECTS } from '../data/projects'
import { CONTACTS } from '../data/contacts'

type TabName = 'bio' | 'projects' | 'contacts'

const TAB_ICONS: Record<TabName, string> = { bio: 'book', projects: 'cart', contacts: 'env' }
const TAB_SCALES: Record<TabName, number> = { bio: 2, projects: 2, contacts: 4 }

const SIDE: Record<TabName, string> = {
  bio: 'ENTRY · 01',
  projects: `× ${PROJECTS.length - 1}`,
  contacts: `× ${CONTACTS.length}`,
}

interface ContentPanelProps {
  currentTab: TabName
}

export function ContentPanel({ currentTab }: ContentPanelProps) {
  const { t } = useBM()

  return (
    <div className="content">
      <h2>
        <span className="h2-icon">
          <Sprite name={TAB_ICONS[currentTab]} scale={TAB_SCALES[currentTab]} />
        </span>
        <span>{t(currentTab)}</span>
        <span className="h2-side">{SIDE[currentTab]}</span>
      </h2>

      <div className="body">
        {currentTab === 'bio' && <BioTab />}
        {currentTab === 'projects' && <ProjectsTab />}
        {currentTab === 'contacts' && <ContactsTab />}
      </div>

      <div className="skip">PRESS A TO SKIP</div>
    </div>
  )
}
