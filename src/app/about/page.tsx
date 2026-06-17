import { Authors, allAuthors } from 'contentlayer/generated'
import MdxRenderer from '@/components/MdxRenderer'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from '@/utils/contentlayer'
import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({ title: '关于' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author) as Omit<Authors, '_id' | '_raw' | 'body'>

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MdxRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
