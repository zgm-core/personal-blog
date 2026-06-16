import Link from 'next/link'

// ====== 数据定义 ======

interface DemoItem {
  id: string
  title: string
  desc: string
  color: string // 缩略图背景色
}

const demos: DemoItem[] = [
  { id: 'demo1',  title: 'Three.js 最小代码片段',       desc: '搭建 Three.js 场景的最基本元素：场景、相机、渲染器、几何体和动画循环。', color: '#1a1a2e' },
  { id: 'demo2',  title: '国家边界',                    desc: '加载 GeoJSON 数据，在地球模型上绘制国家边界线。', color: '#16213e' },
  { id: 'demo3',  title: '线框效果',                    desc: 'WireframeGeometry 实现地球模型的线框渲染效果。', color: '#0f3460' },
  { id: 'demo4',  title: '多线框效果',                  desc: '多层不同密度和颜色的线框叠加，增强科技氛围。', color: '#1b2838' },
  { id: 'demo5',  title: '世界国家轮廓',                desc: '完整的世界地图 3D 可视化，绘制全球所有国家轮廓线。', color: '#0d1b2a' },
  { id: 'demo6',  title: '凸显世界国家轮廓线',          desc: '高亮材质让轮廓线更醒目，增强地理边界可读性。', color: '#1b2631' },
  { id: 'demo7',  title: '全球国家边界线',              desc: '基于真实地理坐标精确绘制每个国家的边界线。', color: '#152238' },
  { id: 'demo8',  title: '全球机场点',                  desc: '在全球 3D 地球上标注主要机场位置，实现航空数据可视化。', color: '#0c1929' },
  { id: 'demo9',  title: '点的亮度控制',                desc: '自定义 ShaderMaterial 控制球面上点的亮度渐变。', color: '#111d33' },
  { id: 'demo10', title: '球面路的线模型',              desc: '在球面上绘制贴合的道路线，使用贝塞尔曲线贴合球面弧度。', color: '#132238' },
  { id: 'demo11', title: '国家路线',                    desc: '在 3D 地球上绘制国家之间的连接路线。', color: '#0f1c2e' },
  { id: 'demo12', title: '在球面上标注',                desc: '在地球球面上添加文字标注和图标标记。', color: '#172a45' },
  { id: 'demo13', title: '在球面标光柱',                desc: '添加从地面向上延伸的光柱效果，突出标记特定位置。', color: '#1a2f47' },
  { id: 'demo14', title: '每个国家独立 Mesh',           desc: '每个国家创建为独立的 3D Mesh，支持点击和高亮交互。', color: '#14293d' },
  { id: 'demo15', title: '全球国家 Mesh',               desc: '全球所有国家作为 Mesh 对象统一渲染到球面。', color: '#0e1f35' },
  { id: 'demo16', title: '不同颜色的国家 Mesh',         desc: '鼠标移动动态改变国家颜色，实现交互式数据地图。', color: '#182c44' },
  { id: 'demo17', title: '全球国家人口密度',            desc: 'Choropleth 地图——人口密度数据的 3D 热力图可视化。', color: '#122640' },
  { id: 'demo18', title: '贝塞尔曲线',                  desc: '使用 CubicBezierCurve3 创建平滑的 3D 贝塞尔曲线路径。', color: '#192f48' },
  { id: 'demo19', title: '圆弧线',                      desc: '在 3D 球面上使用圆弧曲线连接两点。', color: '#10223a' },
  { id: 'demo20', title: '3D 飞线效果',                 desc: '贝塞尔曲线 + 流动动画实现动态飞线效果。', color: '#1b3049' },
  { id: 'demo21', title: 'OA 线效果',                   desc: 'Origin-Angle 方式绘制飞线，起点垂直于球面飞出。', color: '#11284a' },
  { id: 'demo22', title: 'OA 飞线动画',                desc: 'OA 线路径上添加流动光点动画。', color: '#153056' },
  { id: 'demo23', title: '蝌蚪状 OA 飞线',             desc: '蝌蚪状拖尾效果——头部亮点，尾部渐变消失。', color: '#0f2647' },
  { id: 'demo24', title: '项目实战综合案例',            desc: '整合所有技术的完整数据大屏——边界、飞线、光柱、标注。', color: '#0a192f' },
  { id: 'demo25', title: '官方 Demo（后处理）',         desc: 'Bloom、景深、SSAO 等后期特效的综合示例。', color: '#12182b' },
]

// ====== 单个卡片 ======
function DemoCard({ demo }: { demo: DemoItem }) {
  return (
    <Link href={`/projects/threejs/${demo.id}`} className="group block overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/80">
      {/* 缩略图 — 模拟浏览器窗口 */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div style={{ background: `linear-gradient(135deg, ${demo.color} 0%, #000 100%)` }} className="absolute inset-0">
          {/* 浏览器顶栏缩略版 */}
          <div className="flex items-center gap-1.5 px-2 pt-1.5 pb-1 opacity-60">
            <div className="flex gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-red-400/80" /><span className="h-1.5 w-1.5 rounded-full bg-yellow-400/80" /><span className="h-1.5 w-1.5 rounded-full bg-green-400/80" /></div>
          </div>
          {/* 地球示意 */}
          <div className="flex h-[calc(100%-22px)] items-center justify-center">
            <div className="relative h-[55%] w-[55%] rounded-full border border-white/[0.08] shadow-[inset_0_0_20px_rgba(255,255,255,0.04)]">
              {[...Array(5)].map((_, i) => (
                <div key={`h-${i}`} className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.06]" style={{ transform: `translateX(-50%) rotate(${(i + 1) * 18}deg)` }} />
              ))}
              {[...Array(3)].map((_, i) => (
                <div key={`v-${i}`} className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/[0.06]" style={{ transform: `translateY(-50%) translateY(${(i - 1) * 25}%)` }} />
              ))}
            </div>
          </div>
        </div>

        {/* hover 覆盖层 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-lg ring-1 ring-black/5">
            <svg className="h-4.5 w-4.5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
          </div>
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-3.5">
        <h3 className="mb-1 line-clamp-1 text-[13px] font-semibold leading-snug text-gray-900 dark:text-gray-100">{demo.title}</h3>
        <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-400 dark:text-gray-500">{demo.desc}</p>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400">
          查看 Demo
          <svg className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </span>
      </div>
    </Link>
  )
}

// ====== 页面主组件 ======
export default function ThreejsListPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        🗺️ Three.js 地球可视化
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        共 25 个 Three.js 交互式 Demo，涵盖地球可视化、飞线效果、数据映射等技术
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {demos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>
    </div>
  )
}
