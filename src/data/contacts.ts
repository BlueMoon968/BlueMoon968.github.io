export interface Contact {
  id: string
  lbl: string
  val: string
  href: string
  icon: string
}

export const CONTACTS: Contact[] = [
  { id: 'github', lbl: 'GITHUB', val: 'github.com/BlueMoon968', href: 'https://github.com/BlueMoon968', icon: 'cart' },
  { id: 'email', lbl: 'EMAIL', val: 'dev@bluemoon.moe', href: 'mailto:hello@bluemoon.moe', icon: 'env' },
  { id: 'itchio', lbl: 'ITCH.IO', val: 'bluemooncoder.itch.io', href: 'https://bluemooncoder.itch.io/', icon: 'moon' },
]
