'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import {
  Check,
  ChevronDown,
  Eye,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  RotateCcw,
  Save,
  Settings,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { PointOfSale, Product, SiteContent } from '@/lib/content'
import {
  logout,
  updateContent,
  updatePointOfSale,
  updateProduct,
  uploadContentImage,
  uploadOutletImage,
  uploadProductImage,
} from '@/app/admin/actions'

type TextFieldId =
  | 'heroTitle'
  | 'heroText'
  | 'storyTitle'
  | 'storyText'
  | 'productsTitle'
  | 'ctaTitle'
  | 'whatsappNumber'
  | 'aboutHeroTitle'
  | 'aboutHeroText'
  | 'founderQuote'
  | 'founderText'
  | 'founderName'
  | 'founderRole'
  | 'missionTitle'
  | 'missionText1'
  | 'missionText2'
  | 'missionQuote'
  | 'commitment1Title'
  | 'commitment1Text'
  | 'commitment2Title'
  | 'commitment2Text'
  | 'commitment3Title'
  | 'commitment3Text'
type ImageFieldId = 'heroImage' | 'storyImage' | 'founderPhoto' | 'missionImage'
type Selection = { id: string; label: string; type: 'text' | 'product' | 'outlet' | 'image' }

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

export default function AdminEditor({
  initialContent,
  initialProducts,
  initialOutlets,
}: {
  initialContent: SiteContent
  initialProducts: Product[]
  initialOutlets: PointOfSale[]
}) {
  const [content, setContent] = useState(initialContent)
  const [products, setProducts] = useState(initialProducts)
  const [outlets, setOutlets] = useState(initialOutlets)
  const [selected, setSelected] = useState<Selection>({ id: 'heroTitle', label: 'Titre principal', type: 'text' })
  const [saved, setSaved] = useState(true)
  const [menu, setMenu] = useState(false)
  const [pending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedProduct = selected.type === 'product' ? products.find((p) => p.id === selected.id) ?? null : null
  const selectedOutlet = selected.type === 'outlet' ? outlets.find((o) => o.id === selected.id) ?? null : null

  function updateText(key: TextFieldId, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function updateImage(key: ImageFieldId, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function updateSelectedProduct(key: keyof typeof productFieldLabels, value: string) {
    if (!selectedProduct) return
    setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, [key]: value } : p)))
    setSaved(false)
  }

  function updateSelectedOutlet(key: 'name' | 'city' | 'image' | 'imageFit', value: string) {
    if (!selectedOutlet) return
    setOutlets((prev) => prev.map((o) => (o.id === selectedOutlet.id ? { ...o, [key]: value } : o)))
    setSaved(false)
  }

  async function handleImageReplace(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const url = await uploadProductImage(formData)
    updateSelectedProduct('image', url)
  }

  async function handleOutletImageReplace(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const url = await uploadOutletImage(formData)
    updateSelectedOutlet('image', url)
  }

  async function handleContentImageReplace(key: ImageFieldId, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const url = await uploadContentImage(formData)
    updateImage(key, url)
  }

  function save() {
    startTransition(async () => {
      await updateContent({
        heroTitle: content.heroTitle,
        heroText: content.heroText,
        heroImage: content.heroImage,
        storyTitle: content.storyTitle,
        storyText: content.storyText,
        storyImage: content.storyImage,
        productsTitle: content.productsTitle,
        ctaTitle: content.ctaTitle,
        whatsappNumber: content.whatsappNumber,
        aboutHeroTitle: content.aboutHeroTitle,
        aboutHeroText: content.aboutHeroText,
        founderPhoto: content.founderPhoto,
        founderQuote: content.founderQuote,
        founderText: content.founderText,
        founderName: content.founderName,
        founderRole: content.founderRole,
        missionTitle: content.missionTitle,
        missionText1: content.missionText1,
        missionText2: content.missionText2,
        missionImage: content.missionImage,
        missionQuote: content.missionQuote,
        commitment1Title: content.commitment1Title,
        commitment1Text: content.commitment1Text,
        commitment2Title: content.commitment2Title,
        commitment2Text: content.commitment2Text,
        commitment3Title: content.commitment3Title,
        commitment3Text: content.commitment3Text,
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
      await Promise.all(
        outlets.map((outlet) =>
          updatePointOfSale(outlet.id, {
            name: outlet.name,
            city: outlet.city,
            image: outlet.image,
            imageFit: outlet.imageFit,
          })
        )
      )
      setSaved(true)
    })
  }

  function reset() {
    setContent(initialContent)
    setProducts(initialProducts)
    setOutlets(initialOutlets)
    setSaved(false)
  }

  const preview = useMemo(() => content, [content])

  return (
    <main className="admin-shell">
      <aside className={`admin-sidebar ${menu ? 'open' : ''}`}>
        <div className="admin-logo">
          <img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="admin-logo-img" />
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
                  <span className="mini-brand"><img src="/logo_biostore-removebg-preview.png" alt="Biostore" /></span>
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
                  <img
                    src={preview.heroImage}
                    alt="Aperçu hero"
                    onClick={(e) => { e.stopPropagation(); setSelected({ id: 'heroImage', label: 'Image du hero', type: 'image' }) }}
                  />
                </div>
                <div className="mini-strip">DU CHAMP À VOTRE TABLE　 •　 QUALITÉ LOCALE　 •　 LIVRAISON DISPONIBLE</div>
                <div className="mini-story editable" onClick={() => setSelected({ id: 'storyTitle', label: 'Titre histoire', type: 'text' })}>
                  <img
                    src={preview.storyImage}
                    alt="Aperçu histoire"
                    onClick={(e) => { e.stopPropagation(); setSelected({ id: 'storyImage', label: 'Image de l’histoire', type: 'image' }) }}
                  />
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
                <div className="mini-pos">
                  <div className="mini-section-heading"><span className="mini-eyebrow">— OÙ NOUS TROUVER</span><h3>Points de vente</h3></div>
                  <div className="mini-pos-grid">
                    {outlets.map((outlet) => (
                      <article className="mini-pos-item editable" key={outlet.id} onClick={() => setSelected({ id: outlet.id, label: outlet.name, type: 'outlet' })}>
                        <img src={outlet.image} alt={outlet.name} />
                        <strong>{outlet.name}</strong>
                        <Pencil size={13} />
                      </article>
                    ))}
                  </div>
                </div>
                <div className="mini-about-heading editable" onClick={() => setSelected({ id: 'about-hero', label: 'Page à propos — introduction', type: 'text' })}>
                  <span className="mini-eyebrow">— PAGE À PROPOS</span>
                  <h3>{preview.aboutHeroTitle}</h3>
                  <p>{preview.aboutHeroText}</p>
                </div>
                <div className="mini-founder editable" onClick={() => setSelected({ id: 'founderPhoto', label: 'Photo de la fondatrice', type: 'image' })}>
                  <img src={preview.founderPhoto} alt="Aperçu fondatrice" />
                  <div>
                    <span className="mini-eyebrow">— LE MOT DE LA FONDATRICE</span>
                    <p onClick={(e) => { e.stopPropagation(); setSelected({ id: 'founderQuote', label: 'Citation de la fondatrice', type: 'text' }) }}>“{preview.founderQuote}”</p>
                    <strong onClick={(e) => { e.stopPropagation(); setSelected({ id: 'founderName', label: 'Nom de la fondatrice', type: 'text' }) }}>{preview.founderName}</strong>
                  </div>
                  <Pencil size={13} />
                </div>
                <div className="mini-mission editable" onClick={() => setSelected({ id: 'missionImage', label: 'Image de la mission', type: 'image' })}>
                  <div>
                    <span className="mini-eyebrow">— NOTRE MISSION</span>
                    <h3 onClick={(e) => { e.stopPropagation(); setSelected({ id: 'missionTitle', label: 'Titre de la mission', type: 'text' }) }}>{preview.missionTitle}</h3>
                    <p onClick={(e) => { e.stopPropagation(); setSelected({ id: 'missionText1', label: 'Texte de la mission (1)', type: 'text' }) }}>{preview.missionText1}</p>
                  </div>
                  <img src={preview.missionImage} alt="Aperçu mission" />
                </div>
                <div className="mini-values">
                  <span className="editable" onClick={() => setSelected({ id: 'commitment1Title', label: 'Engagement 1', type: 'text' })}>✦<strong>{preview.commitment1Title}</strong></span>
                  <span className="editable" onClick={() => setSelected({ id: 'commitment2Title', label: 'Engagement 2', type: 'text' })}>◌<strong>{preview.commitment2Title}</strong></span>
                  <span className="editable" onClick={() => setSelected({ id: 'commitment3Title', label: 'Engagement 3', type: 'text' })}>✧<strong>{preview.commitment3Title}</strong></span>
                </div>
                <div className="mini-cta editable" onClick={() => setSelected({ id: 'ctaTitle', label: 'Appel à l’action', type: 'text' })}>
                  <div>
                    <span>— PARLONS DE VOS ENVIES</span>
                    <h3>{preview.ctaTitle}</h3>
                  </div>
                  <b>Écrire sur WhatsApp　→</b>
                </div>
                <div className="mini-footer">
                  <span className="mini-brand"><img src="/logo_biostore-removebg-preview.png" alt="Biostore" /></span>
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
                ) : selected.type === 'outlet' && selectedOutlet ? (
                  <>
                    <div className="field">
                      <label>Image / logo</label>
                      <div className="image-field">
                        <img src={selectedOutlet.image} alt="" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleOutletImageReplace(file)
                          }}
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon size={15} /> Remplacer
                        </button>
                      </div>
                    </div>
                    <div className="field">
                      <label>Nom de l’enseigne</label>
                      <input value={selectedOutlet.name} onChange={(e) => updateSelectedOutlet('name', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Ville</label>
                      <input value={selectedOutlet.city} onChange={(e) => updateSelectedOutlet('city', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Type d’image</label>
                      <select
                        className="select-field"
                        value={selectedOutlet.imageFit}
                        onChange={(e) => updateSelectedOutlet('imageFit', e.target.value)}
                      >
                        <option value="contain">Logo (fond couleur)</option>
                        <option value="cover">Photo (plein cadre)</option>
                      </select>
                    </div>
                  </>
                ) : selected.type === 'image' ? (
                  <>
                    <div className="field">
                      <label>
                        {selected.id === 'heroImage'
                          ? 'Image du hero'
                          : selected.id === 'storyImage'
                            ? 'Image de l’histoire'
                            : selected.id === 'founderPhoto'
                              ? 'Photo de la fondatrice'
                              : 'Image de la mission'}
                      </label>
                      <div className="image-field">
                        <img src={content[selected.id as ImageFieldId]} alt="" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleContentImageReplace(selected.id as ImageFieldId, file)
                          }}
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon size={15} /> Remplacer
                        </button>
                      </div>
                    </div>
                    {selected.id === 'heroImage' ? (
                      <>
                        <div className="field">
                          <label>Titre principal</label>
                          <input value={content.heroTitle} onChange={(e) => updateText('heroTitle', e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Texte du hero</label>
                          <textarea value={content.heroText} onChange={(e) => updateText('heroText', e.target.value)} rows={4} />
                        </div>
                      </>
                    ) : selected.id === 'storyImage' ? (
                      <>
                        <div className="field">
                          <label>Titre de l’histoire</label>
                          <input value={content.storyTitle} onChange={(e) => updateText('storyTitle', e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Texte de l’histoire</label>
                          <textarea value={content.storyText} onChange={(e) => updateText('storyText', e.target.value)} rows={4} />
                        </div>
                      </>
                    ) : selected.id === 'founderPhoto' ? (
                      <>
                        <div className="field">
                          <label>Texte de la fondatrice</label>
                          <textarea value={content.founderText} onChange={(e) => updateText('founderText', e.target.value)} rows={5} />
                        </div>
                        <div className="field">
                          <label>Fonction</label>
                          <input value={content.founderRole} onChange={(e) => updateText('founderRole', e.target.value)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="field">
                          <label>Texte de la mission (2)</label>
                          <textarea value={content.missionText2} onChange={(e) => updateText('missionText2', e.target.value)} rows={4} />
                        </div>
                        <div className="field">
                          <label>Citation encadrée</label>
                          <textarea value={content.missionQuote} onChange={(e) => updateText('missionQuote', e.target.value)} rows={3} />
                        </div>
                      </>
                    )}
                  </>
                ) : selected.id === 'about-hero' ? (
                  <>
                    <div className="field">
                      <label>Titre de la page à propos</label>
                      <input value={content.aboutHeroTitle} onChange={(e) => updateText('aboutHeroTitle', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Texte d’introduction</label>
                      <textarea value={content.aboutHeroText} onChange={(e) => updateText('aboutHeroText', e.target.value)} rows={5} />
                    </div>
                  </>
                ) : selected.id.startsWith('commitment') ? (
                  (() => {
                    const n = selected.id.charAt('commitment'.length)
                    const titleKey = `commitment${n}Title` as TextFieldId
                    const textKey = `commitment${n}Text` as TextFieldId
                    return (
                      <>
                        <div className="field">
                          <label>Titre de l’engagement</label>
                          <input value={content[titleKey]} onChange={(e) => updateText(titleKey, e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Texte de l’engagement</label>
                          <textarea value={content[textKey]} onChange={(e) => updateText(textKey, e.target.value)} rows={4} />
                        </div>
                      </>
                    )
                  })()
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
