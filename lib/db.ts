import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Neon's connection sometimes has brief cold-start / network hiccups where the
// TCP handshake succeeds but the Postgres handshake times out (P1001, P1017).
// Retrying once or twice with a short delay smooths those over instead of
// surfacing a 500 to the user.
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const code = (error as { code?: string })?.code
    const message = error instanceof Error ? error.message : ''
    const isConnectionIssue = code === 'P1001' || code === 'P1017' || message.includes("Can't reach database server")
    if (retries > 0 && isConnectionIssue) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      return withRetry(fn, retries - 1, delayMs * 2)
    }
    throw error
  }
}
