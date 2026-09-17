import { prisma, withRetry } from '@/lib/db'
import AdminEditor from '@/components/admin/admin-editor'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [content, products, outlets] = await withRetry(() =>
    Promise.all([
      prisma.siteContent.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.product.findMany({ orderBy: { position: 'asc' } }),
      prisma.pointOfSale.findMany({ orderBy: { position: 'asc' } }),
    ])
  )

  return <AdminEditor initialContent={content} initialProducts={products} initialOutlets={outlets} />
}
