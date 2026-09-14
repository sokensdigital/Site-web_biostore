'use client'

import { useState } from 'react'
import { Menu, MessageCircle, X } from 'lucide-react'

export default function MobileNav({ whatsappLink }: { whatsappLink: (message: string) => string }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Ouvrir le menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
        <a href="#accueil" onClick={() => setMenuOpen(false)}>Accueil</a>
        <a href="#produits" onClick={() => setMenuOpen(false)}>Nos produits</a>
        <a href="#histoire" onClick={() => setMenuOpen(false)}>Notre histoire</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
      <a className="button button-primary nav-cta" href={whatsappLink('Bonjour Biostore, je souhaite avoir des informations sur vos produits.')} target="_blank" rel="noreferrer">
        <MessageCircle size={17} /> Commander sur WhatsApp
      </a>
    </>
  )
}
