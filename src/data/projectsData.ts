export interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  tags?: string[]
  stats?: string
  /** 真实网页预览 URL，卡片上方会显示 iframe 缩小的真实页面 */
  previewUrl?: string
}

const projectsData: Project[] = [
  {
    title: 'Three.js 地球可视化',
    description: '25 个交互式 Demo，涵盖地球可视化、飞线效果、国家 Mesh、数据映射、后处理特效等。',
    imgSrc: '/static/images/logo1.png',
    href: '/projects/threejs',
    previewUrl: '/embed/projects/threejs',
    tags: ['Three.js', 'React', 'WebGL', 'TypeScript'],
    stats: '25 个 Demo',
  },
  {
    title: '墨痕个人博客',
    description: '基于 Next.js 15 + Contentlayer2 + Tailwind CSS 构建的现代化个人技术博客。',
    imgSrc: '/static/images/logo1.png',
    href: 'https://github.com/zgm-core/personal-blog',
    previewUrl: '/',
    tags: ['Next.js', 'MDX', 'Tailwind', 'Contentlayer'],
    stats: '⭐ Open Source',
  },
]

export default projectsData
