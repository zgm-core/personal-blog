import { genPageMetadata } from '@/app/seo'
import ProjectList from './ProjectList'

export const metadata = genPageMetadata({ title: '项目' })

export default function Projects() {
  return (
    <div className="py-6">
      <h1 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 animate-fade-in-up">
        项目
      </h1>
      <p className="mb-6 text-xs text-gray-400 dark:text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
        展示我的项目作品
      </p>
      <ProjectList />
    </div>
  )
}
