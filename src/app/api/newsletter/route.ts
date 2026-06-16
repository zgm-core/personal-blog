import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { NextRequest } from 'next/server'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: siteMetadata.newsletter.provider,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = handler as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POST = handler as any
