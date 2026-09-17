'use client'

import { useActionState } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { login, type LoginState } from '../actions'

const initialState: LoginState = {}

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <main className="login-page">
      <div className="login-visual">
        <div className="login-brand">
          <img src="/logo_biostore-removebg-preview.png" alt="Biostore" className="brand-logo" />
        </div>
        <div>
          <span className="eyebrow light"><span className="eyebrow-line" /> Espace d’administration</span>
          <h1>Votre marque,<br /><em>avec intention.</em></h1>
          <p>Gérez chaque détail de votre présence digitale depuis un espace simple, élégant et pensé pour Biostore.</p>
        </div>
        <span className="login-note">Le naturel, avec intention.</span>
      </div>
      <div className="login-panel">
        <div className="login-card">
          <div className="login-icon"><LockKeyhole size={21} /></div>
          <span className="eyebrow">Bienvenue</span>
          <h2>Connexion à votre espace</h2>
          <p className="login-subtitle">Accédez à votre studio de contenu Biostore.</p>
          <form action={formAction}>
            <label>
              Email professionnel
              <div className="input-wrap">
                <Mail size={17} />
                <input type="email" name="email" required autoComplete="username" />
              </div>
            </label>
            <label>
              Mot de passe
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input type="password" name="password" required autoComplete="current-password" placeholder="••••••••" />
              </div>
            </label>
            {state?.error && <p className="form-error">{state.error}</p>}
            <button className="button button-primary login-submit" type="submit" disabled={pending}>
              {pending ? 'Connexion…' : 'Ouvrir le studio'} <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
