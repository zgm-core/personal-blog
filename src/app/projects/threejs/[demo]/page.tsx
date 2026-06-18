import ThreeDemoClient from './ThreeDemoClient'

const DEMO_IDS = [
  'demo1', 'demo2', 'demo3', 'demo4', 'demo5', 'demo6', 'demo7', 'demo8', 'demo9',
  'demo10', 'demo11', 'demo12', 'demo13', 'demo14', 'demo15', 'demo16', 'demo17',
  'demo18', 'demo19', 'demo20', 'demo21', 'demo22', 'demo23', 'demo24', 'demo25',
]

export const generateStaticParams = () => DEMO_IDS.map((id) => ({ demo: id }))

export default function ThreeDemoPage() {
  return <ThreeDemoClient />
}
