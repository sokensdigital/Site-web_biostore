'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, MessageCircle, X } from 'lucide-react'

export default function MobileNav({ whatsappNumber }: { whatsappNumber: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const prefix = pathname === '/' ? '' : '/'
  const whatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <>
      <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Ouvrir le menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
        <Link href={`${prefix}#accueil`} onClick={() => setMenuOpen(false)}>Accueil</Link>
        <Link href={`${prefix}#produits`} onClick={() => setMenuOpen(false)}>Nos produits</Link>
        <Link href={`${prefix}#histoire`} onClick={() => setMenuOpen(false)}>Notre histoire</Link>
        <Link href={`${prefix}#contact`} onClick={() => setMenuOpen(false)}>Contact</Link>
      </nav>
      <a className="button button-primary nav-cta" href={whatsappLink('Bonjour Biostore, je souhaite avoir des informations sur vos produits.')} target="_blank" rel="noreferrer">
        <MessageCircle size={17} /> Se faire livrer
      </a>
    </>
  )
}
