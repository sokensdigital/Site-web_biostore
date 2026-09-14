'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import {
  Check,
  ChevronDown,
  Eye,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Pencil,
  RotateCcw,
  Save,
  Settings,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { Product, SiteContent } from '@/lib/content'
import { logout, updateContent, updateProduct, uploadProductImage } from '@/app/admin/actions'

type TextFieldId = 'heroTitle' | 'heroText' | 'storyTitle' | 'storyText' | 'productsTitle' | 'ctaTitle' | 'whatsappNumber'
type Selection = { id: string; label: string; type: 'text' | 'product' }

const productFieldLabels: Record<keyof Omit<Product, 'id' | 'position' | 'createdAt' | 'updatedAt'>, string> = {
  name: 'Nom du produit',
  category: 'Catégorie',
  description: 'Description',
  price: 'Prix',
  format: 'Format',
  image: 'Image',
  ingredients: 'Ingrédients',
  conservation: 'Conservation',
}

const productFieldOrder = ['name', 'category', 'description', 'price', 'format', 'ingredients', 'conservation'] as const

export default function AdminEditor({ initialContent, initialProducts }: { initialContent: SiteContent; initialProducts: Product[] }) {
  const [content, setContent] = useState(initialContent)
  const [products, setProducts] = useState(initialProducts)
  const [selected, setSelected] = useState<Selection>({ id: 'heroTitle', label: 'Titre principal', type: 'text' })
  const [saved, setSaved] = useState(true)
  const [menu, setMenu] = useState(false)
  const [pending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedProduct = selected.type === 'product' ? products.find((p) => p.id === selected.id) ?? null : null

  function updateText(key: TextFieldId, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function updateSelectedProduct(key: keyof typeof productFieldLabels, value: string) {
    if (!selectedProduct) return
    setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, [key]: value } : p)))
    setSaved(false)
  }

  async function handleImageReplace(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const url = await uploadProductImage(formData)
    updateSelectedProduct('image', url)
  }

  function save() {
    startTransition(async () => {
      await updateContent({
        heroTitle: content.heroTitle,
        heroText: content.heroText,
        storyTitle: content.storyTitle,
        storyText: content.storyText,
        productsTitle: content.productsTitle,
        ctaTitle: content.ctaTitle,
        whatsappNumber: content.whatsappNumber,
      })
      await Promise.all(
        products.map((product) =>
          updateProduct(product.id, {
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            format: product.format,
            image: product.image,
            ingredients: product.ingredients,
            conservation: product.conservation,
          })
        )
      )
      setSaved(true)
    })
  }

  function reset() {
    setContent(initialContent)
    setProducts(initialProducts)
    setSaved(false)
  }

  const preview = useMemo(() => content, [content])

  return (
    <main className="admin-shell">
      <aside className={`admin-sidebar ${menu ? 'open' : ''}`}>
        <div className="admin-logo">
          <span className="brand-mark"><Leaf size={17} /></span> bio<span>store</span>
        </div>
        <div className="workspace-label">Studio de contenu</div>
        <nav className="admin-nav">
          <a className="active"><LayoutDashboard size={17} /> Tableau de bord</a>
          <a><FileText size={17} /> Gestion de contenu <ChevronDown size={15} /></a>
          <a><Settings size={17} /> Paramètres</a>
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user">
            <span>AM</span>
            <div><strong>Admin Biostore</strong><small>Administrateur</small></div>
          </div>
          <button onClick={() => logout()}><LogOut size={16} /> Déconnexion</button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <button className="admin-menu-toggle" onClick={() => setMenu(!menu)}><Menu /></button>
          <div>
            <span className="admin-kicker">Tableau de bord</span>
            <h1>Bonjour, Admin <span>•</span></h1>
          </div>
          <div className="admin-header-actions">
            <span className={`save-status ${saved ? 'saved' : ''}`}><span /> {saved ? 'Enregistré' : 'Modifications non enregistrées'}</span>
            <button className="outline-button" onClick={() => window.open('/', '_blank')}><Eye size={16} /> Voir le site</button>
            <button className="save-button" onClick={save} disabled={pending}><Save size={16} /> {pending ? 'Publication…' : 'Publier'}</button>
          </div>
        </header>
        <div className="admin-content">
          <div className="content-toolbar">
            <div><h2>Éditeur visuel</h2><p>Cliquez sur un élément de la page pour le modifier.</p></div>
            <div className="toolbar-actions">
              <button onClick={reset}><RotateCcw size={15} /> Réinitialiser</button>
              <button><SlidersHorizontal size={15} /> Affichage</button>
            </div>
          </div>
          <div className="editor-layout">
            <section className="site-canvas">
              <div className="canvas-bar">
                <span><span className="live-dot" /> Aperçu en direct</span>
                <span>Desktop <ChevronDown size={14} /></span>
              </div>
              <div className="mini-site">
                <div className="mini-nav">
                  <span className="mini-brand"><Leaf size={13} /> bio<span>store</span></span>
                  <span>Accueil　 Nos produits　 Notre histoire　 Contact</span>
                  <b>Se faire livrer</b>
                </div>
                <div className="mini-hero editable" onClick={() => setSelected({ id: 'heroTitle', label: 'Titre principal', type: 'text' })}>
                  <div>
                    <span className="mini-eyebrow">— {preview.heroEyebrow}</span>
                    <h3>{preview.heroTitle}</h3>
                    <p>{preview.heroText}</p>
                    <button>Découvrir nos produits　→</button>
                  </div>
                  <img src={preview.heroImage} alt="Aperçu hero" />
                </div>
                <div className="mini-strip">DU CHAMP À VOTRE TABLE　 •　 QUALITÉ LOCALE　 •　 LIVRAISON DISPONIBLE</div>
                <div className="mini-story editable" onClick={() => setSelected({ id: 'storyTitle', label: 'Titre histoire', type: 'text' })}>
                  <img src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=700&q=80" alt="Aperçu histoire" />
                  <div>
                    <span className="mini-eyebrow">— NOTRE HISTOIRE</span>
                    <h3>{preview.storyTitle}</h3>
                    <p>{preview.storyText}</p>
                    <a>Découvrir notre démarche　→</a>
                  </div>
                </div>
                <div className="mini-values">
                  <span>✦<strong>Naturel par choix</strong></span>
                  <span>◌<strong>Sûr et transparent</strong></span>
                  <span>✧<strong>Fait avec soin</strong></span>
                </div>
                <div className="mini-products">
                  <div className="mini-section-heading editable" onClick={() => setSelected({ id: 'productsTitle', label: 'Titre produits', type: 'text' })}>
                    <span className="mini-eyebrow">— LA SÉLECTION BIOSTORE</span>
                    <h3>{preview.productsTitle}</h3>
                  </div>
                  <div className="mini-product-grid">
                    {products.map((product) => (
                      <article className="mini-product editable" key={product.id} onClick={() => setSelected({ id: product.id, label: product.name, type: 'product' })}>
                        <img src={product.image} alt={product.name} />
                        <small>{product.category}</small>
                        <strong>{product.name}</strong>
                        <span>{product.price}</span>
                        <Pencil size={13} />
                      </article>
                    ))}
                  </div>
                </div>
                <div className="mini-cta editable" onClick={() => setSelected({ id: 'ctaTitle', label: 'Appel à l’action', type: 'text' })}>
                  <div>
                    <span>— PARLONS DE VOS ENVIES</span>
                    <h3>{preview.ctaTitle}</h3>
                  </div>
                  <b>Écrire sur WhatsApp　→</b>
                </div>
                <div className="mini-footer">
                  <span className="mini-brand"><Leaf size={13} /> bio<span>store</span></span>
                  <small>Le naturel, avec intention.</small>
                  <small>© 2024 Biostore</small>
                </div>
              </div>
            </section>
            <aside className="inspector">
              <div className="inspector-header">
                <div><span className="inspector-kicker">Propriétés</span><h2>{selected.label}</h2></div>
                <button aria-label="Fermer"><X size={17} /></button>
              </div>
              <div className="inspector-body">
                {selected.type === 'product' && selectedProduct ? (
                  <>
                    <div className="field">
                      <label>Image du produit</label>
                      <div className="image-field">
                        <img src={selectedProduct.image} alt="" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageReplace(file)
                          }}
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon size={15} /> Remplacer
                        </button>
                      </div>
                    </div>
                    {productFieldOrder.map((key) => (
                      <div className="field" key={key}>
                        <label>{productFieldLabels[key]}</label>
                        <input value={selectedProduct[key]} onChange={(e) => updateSelectedProduct(key, e.target.value)} />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="field">
                      <label>Texte à afficher</label>
                      <textarea
                        value={String(content[selected.id as TextFieldId] ?? '')}
                        onChange={(e) => updateText(selected.id as TextFieldId, e.target.value)}
                        rows={selected.id.toLowerCase().includes('text') ? 5 : 3}
                      />
                    </div>
                    <div className="field">
                      <label>Numéro WhatsApp</label>
                      <input value={content.whatsappNumber} onChange={(e) => updateText('whatsappNumber', e.target.value)} />
                    </div>
                  </>
                )}
              </div>
              <div className="inspector-footer">
                <button className="secondary-button" onClick={() => setSelected({ id: 'heroTitle', label: 'Titre principal', type: 'text' })}>Annuler</button>
                <button className="save-button" onClick={save} disabled={pending}><Check size={16} /> Appliquer</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
