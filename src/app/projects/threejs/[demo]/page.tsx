'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const DemoLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="mt-4 text-xs font-medium tracking-wide text-cyan-300/60">Loading Demo...</p>
    </div>
  </div>
)

const DemoComponents: Record<string, React.ComponentType> = {
  demo1:  dynamic(() => import('@/lib/threejs/demos/smallCodeThree/index'), { ssr: false, loading: DemoLoader }),
  demo2:  dynamic(() => import('@/lib/threejs/demos/countryBorder/Index'), { ssr: false, loading: DemoLoader }),
  demo3:  dynamic(() => import('@/lib/threejs/demos/wireframe/Index'), { ssr: false, loading: DemoLoader }),
  demo4:  dynamic(() => import('@/lib/threejs/demos/wireframemore/Index'), { ssr: false, loading: DemoLoader }),
  demo5:  dynamic(() => import('@/lib/threejs/demos/contryBorder/Index'), { ssr: false, loading: DemoLoader }),
  demo6:  dynamic(() => import('@/lib/threejs/demos/highlightOutline/Index'), { ssr: false, loading: DemoLoader }),
  demo7:  dynamic(() => import('@/lib/threejs/demos/geoContry/Index'), { ssr: false, loading: DemoLoader }),
  demo8:  dynamic(() => import('@/lib/threejs/demos/airportGeo/Index'), { ssr: false, loading: DemoLoader }),
  demo9:  dynamic(() => import('@/lib/threejs/demos/pointLuminance/Index'), { ssr: false, loading: DemoLoader }),
  demo10: dynamic(() => import('@/lib/threejs/demos/earthRoadLine/Index'), { ssr: false, loading: DemoLoader }),
  demo11: dynamic(() => import('@/lib/threejs/demos/earthRoadLine/Index'), { ssr: false, loading: DemoLoader }),
  demo12: dynamic(() => import('@/lib/threejs/demos/earthPunctuation/Index'), { ssr: false, loading: DemoLoader }),
  demo13: dynamic(() => import('@/lib/threejs/demos/streamer/Index'), { ssr: false, loading: DemoLoader }),
  demo14: dynamic(() => import('@/lib/threejs/demos/everyContryMesh/Index'), { ssr: false, loading: DemoLoader }),
  demo15: dynamic(() => import('@/lib/threejs/demos/globalCountry/Index'), { ssr: false, loading: DemoLoader }),
  demo16: dynamic(() => import('@/lib/threejs/demos/colorMousemoveCountryMesh/Index'), { ssr: false, loading: DemoLoader }),
  demo17: dynamic(() => import('@/lib/threejs/demos/densityPopulation/Index'), { ssr: false, loading: DemoLoader }),
  demo18: dynamic(() => import('@/lib/threejs/demos/flyLine/Index'), { ssr: false, loading: DemoLoader }),
  demo19: dynamic(() => import('@/lib/threejs/demos/ballArcCurve/Index'), { ssr: false, loading: DemoLoader }),
  demo20: dynamic(() => import('@/lib/threejs/demos/3DFly/Index'), { ssr: false, loading: DemoLoader }),
  demo21: dynamic(() => import('@/lib/threejs/demos/3DOA/Index'), { ssr: false, loading: DemoLoader }),
  demo22: dynamic(() => import('@/lib/threejs/demos/3DOAMove/Index'), { ssr: false, loading: DemoLoader }),
  demo23: dynamic(() => import('@/lib/threejs/demos/tadpoleOA/Index'), { ssr: false, loading: DemoLoader }),
  demo24: dynamic(() => import('@/lib/threejs/demos/projectPractice/Index'), { ssr: false, loading: DemoLoader }),
  demo25: dynamic(() => import('@/lib/threejs/demos/webglPostprocessing/Index'), { ssr: false, loading: DemoLoader }),
}

function DemoError({ demoId }: { demoId: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#001111]">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-sm text-red-300/80">Demo "{demoId}" 加载失败</p>
        <p className="mt-2 text-xs text-gray-400">请检查该 Demo 是否存在于项目中</p>
      </div>
    </div>
  )
}

export default function ThreeDemoPage() {
  const params = useParams()
  const demoId = params.demo as string

  const DemoComponent = DemoComponents[demoId]

  // 离开 demo 页面时停止渲染循环并隐藏 CSS2D 标签
  useEffect(() => {
    return () => {
      import('@/lib/threejs/demos/instance/scene').then(({ stopRender }) => {
        stopRender()
      })
    }
  }, [])

  if (!DemoComponent) {
    return <DemoError demoId={demoId} />
  }

  return (
    <div className="absolute inset-0">
      <DemoComponent />
    </div>
  )
}
