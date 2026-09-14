import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export const sessionCookieName = 'biostore-admin-session'
const sessionDuration = 60 * 60 * 8 // 8h

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function verifyCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHashBase64 = process.env.ADMIN_PASSWORD_HASH_BASE64
  if (!adminEmail || !adminPasswordHashBase64) throw new Error('Admin credentials are not configured')
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false
  const adminPasswordHash = Buffer.from(adminPasswordHashBase64, 'base64').toString('utf8')
  return bcrypt.compare(password, adminPasswordHash)
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${sessionDuration}s`)
    .sign(getSecret())

  const cookieStore = await cookies()
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionDuration,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(sessionCookieName)
}

export async function verifySessionToken(token: string) {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value
  if (!token) return null
  const valid = await verifySessionToken(token)
  return valid ? token : null
}
