'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const demoNames: Record<string, string> = {
  demo1: '最小代码片段',
  demo2: '国家边界',
  demo3: '线框',
  demo4: '多线框',
  demo5: '世界国家轮廓',
  demo6: '凸显轮廓线',
  demo7: '全球边界线',
  demo8: '全球机场点',
  demo9: '点的亮度',
  demo10: '球面路模型',
  demo11: '国家路线',
  demo12: '球面标注',
  demo13: '球面光柱',
  demo14: '每个国家Mesh',
  demo15: '全球国家Mesh',
  demo16: '彩色国家Mesh',
  demo17: '人口密度',
  demo18: '贝塞尔曲线',
  demo19: '圆弧线',
  demo20: '3D飞线',
  demo21: 'OA线',
  demo22: 'OA飞线',
  demo23: '蝌蚪状OA飞线',
  demo24: '项目实战',
  demo25: '官方Demo',
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentDemo = pathname.split('/').pop() || ''
  // 列表页不用全屏布局，Demo 详情页才用
  const isListPage = pathname.replace(/\/$/, '') === '/projects/threejs'

  if (isListPage) {
    // 列表页：正常文档流，允许滚动
    return <>{children}</>
  }

  return (
    <>
      {/* Full-bleed wrapper: breaks out of parent max-w constraint */}
      <div className="absolute inset-x-0 top-0 bottom-10 flex flex-col" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        {/* 顶部导航栏 */}
        <div className="flex-shrink-0 border-b border-gray-200/60 bg-white/80 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-950/80">
          <div className="flex items-center justify-between px-4 h-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <Link
                href="/projects/threejs"
                className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                ← 返回列表
              </Link>
              {currentDemo && currentDemo !== 'threejs' && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  / {demoNames[currentDemo] || currentDemo}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              Three.js 地球可视化
            </span>
          </div>
        </div>

        {/* Demo 内容区 - 全宽无限制，填满剩余空间 */}
        <div className="flex-1 relative overflow-hidden bg-[#001111]">
          {children}
        </div>
      </div>
    </>
  )
}
