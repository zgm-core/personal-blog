import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 transition-all duration-200 hover:scale-105 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 hover:shadow-sm dark:bg-gray-800 dark:text-gray-400 dark:hover:border-primary-800 dark:hover:bg-primary-950/40 dark:hover:text-primary-400"
    >
      <span className="mr-1 text-[10px] opacity-50">#</span>
      {text}
    </Link>
  )
}

export default Tag
