'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/db'
import { createSession, destroySession, verifyCredentials } from '@/lib/auth'

export type LoginState = { error?: string }

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { error: 'Entrez votre email et votre mot de passe.' }

  const valid = await verifyCredentials(email, password)
  if (!valid) return { error: 'Identifiants incorrects.' }

  await createSession(email)
  redirect('/admin')
}

export async function logout() {
  await destroySession()
  redirect('/admin/login')
}

const contentFields = [
  'heroEyebrow',
  'heroTitle',
  'heroText',
  'heroImage',
  'storyTitle',
  'storyText',
  'storyImage',
  'productsTitle',
  'ctaTitle',
  'whatsappNumber',
  'aboutHeroTitle',
  'aboutHeroText',
  'founderPhoto',
  'founderQuote',
  'founderText',
  'founderName',
  'founderRole',
  'missionTitle',
  'missionText1',
  'missionText2',
  'missionImage',
  'missionQuote',
  'commitment1Title',
  'commitment1Text',
  'commitment2Title',
  'commitment2Text',
  'commitment3Title',
  'commitment3Text',
  'benefitsTitle',
  'benefitsText',
  'benefitsImage',
  'benefitsCaption',
] as const

export async function updateContent(data: Partial<Record<(typeof contentFields)[number], string>>) {
  const update = Object.fromEntries(
    Object.entries(data).filter(([key]) => contentFields.includes(key as (typeof contentFields)[number]))
  )
  await prisma.siteContent.update({ where: { id: 1 }, data: update })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/catalogue')
}

type ProductInput = {
  name: string
  category: string
  description: string
  price: string
  format: string
  image: string
  ingredients: string
  conservation: string
}

export async function createProduct(data: ProductInput) {
  const last = await prisma.product.findFirst({ orderBy: { position: 'desc' } })
  const product = await prisma.product.create({ data: { ...data, position: (last?.position ?? -1) + 1 } })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/catalogue')
  return product
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  await prisma.product.update({ where: { id }, data })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/catalogue')
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/catalogue')
}

export async function uploadProductImage(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('Aucun fichier reçu')
  const blob = await put(`products/${Date.now()}-${file.name}`, file, { access: 'public' })
  return blob.url
}

type PointOfSaleInput = { name: string; city: string; image: string; imageFit: string }

export async function createPointOfSale(data: PointOfSaleInput) {
  const last = await prisma.pointOfSale.findFirst({ orderBy: { position: 'desc' } })
  const outlet = await prisma.pointOfSale.create({ data: { ...data, position: (last?.position ?? -1) + 1 } })
  revalidatePath('/')
  revalidatePath('/admin')
  return outlet
}

export async function updatePointOfSale(id: string, data: Partial<PointOfSaleInput>) {
  await prisma.pointOfSale.update({ where: { id }, data })
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deletePointOfSale(id: string) {
  await prisma.pointOfSale.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function uploadOutletImage(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('Aucun fichier reçu')
  const blob = await put(`points-of-sale/${Date.now()}-${file.name}`, file, { access: 'public' })
  return blob.url
}

export async function uploadContentImage(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('Aucun fichier reçu')
  const blob = await put(`content/${Date.now()}-${file.name}`, file, { access: 'public' })
  return blob.url
}

export async function addHeroImage(image: string) {
  const last = await prisma.heroImage.findFirst({ orderBy: { position: 'desc' } })
  const heroImage = await prisma.heroImage.create({ data: { image, position: (last?.position ?? -1) + 1 } })
  revalidatePath('/')
  revalidatePath('/admin')
  return heroImage
}

export async function updateHeroImage(id: string, image: string) {
  const heroImage = await prisma.heroImage.update({ where: { id }, data: { image } })
  revalidatePath('/')
  revalidatePath('/admin')
  return heroImage
}

export async function deleteHeroImage(id: string) {
  await prisma.heroImage.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}
