/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-27 09:55:05
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-08 17:13:20
 */
import { FC, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { addLight, camera, clearChild, controls, creatClock, initScene, listenWindowChange, myRender, render, scene, setControl, setCoordinateHelper, stopRender } from "../instance/scene";
import { chooseModelMesh } from "./chooseModelMesh";
import { loaderLine } from "./earth";
import { useCoord } from "./hooks/useCoord";

// 轻量 throttle 替代 lodash.throttle，减少依赖体积
function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let last = 0
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn(...args)
    }
  }) as T
}


/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-27 09:55:05
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-04 14:00:42
 */

const Index: FC = () => {
    const threeRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const { getBoundingBox } = useCoord()
    // 持有清理引用：保存事件处理函数以便组件销毁时解绑
    const cleanupRef = useRef<{
        clickHandler?: (...args: any[]) => void
    }>({})


    const mouseEvent=(group:any)=>{
        return  function(event:any){
            chooseModelMesh(event, group)
        }

    }

    // 组件销毁时彻底清理所有 demo25 添加的资源
    useEffect(() => {
        return () => {
            // 1. 停止渲染循环 & 隐藏全局 labelRenderer
            stopRender()

            // 2. 移除 click 事件
            if (cleanupRef.current.clickHandler) {
                window.removeEventListener("click", cleanupRef.current.clickHandler)
            }

            // 3. 从 scene 中移除所有 CSS2D 文字标签
            if (scene) {
                const css2dObjects: any[] = []
                scene.traverse((obj: any) => {
                    if (obj.isCSS2DObject) {
                        css2dObjects.push(obj)
                    }
                })
                css2dObjects.forEach((obj: any) => {
                    obj.removeFromParent?.() ?? scene.remove(obj)
                })
            }

            // 4. 移除容器内所有 DOM（canvas + CSS2DRenderer DOM）
            const container = document.querySelector(".container")
            if (container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }
            }
        }
    }, [])


    useEffect(() => {
        //红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        initScene([102.97777217804006, 25, 0.5], [0, 0, 0], 8, pathname);

        loaderLine().then(data => {
            scene.add(data)
            const handler = throttle(mouseEvent(data), 100)
            cleanupRef.current.clickHandler = handler
            window.addEventListener("click", handler)
            const { center } = getBoundingBox(data);
            //其实 controls.target的功效就是camera.lookAt功效，在他内部他是调用了camera.lookAt方法的。
            //如果你添加了轨道控制器那么改变相机的焦点就只能使用controls.target方法，如果没有添加轨道控制器
            //用camera.lookAt方法也可以改变相机焦点，只是模型不能被鼠标先转、或移动
            controls.target.set(center.x, center.y, 0);//改变的是相机看的目标位置
            // camera.lookAt(center.x,center.y,0)

            // 控制轨道旋转范围
            // controls.maxAzimuthAngle =  0//你能够水平旋转的角度上限
            // controls.minDistance = 1;//你能够将相机向内移动多少,设置相机距离模型的位置
            // controls.maxDistance = 16;//相机距离模型的距离
            // controls.minPolarAngle =  Math.PI*0.7//你能够垂直旋转的角度的下限
            // controls.maxPolarAngle =  Math.PI*0.8, // 相机垂直旋转角度的上限
            // controls.minAzimuthAngle=0//你能够水平旋转的角度下限

        })
        addLight()

        setCoordinateHelper(),
            creatClock(),
            setControl(),
            listenWindowChange(),
            clearChild(threeRef),
            myRender(pathname),
            threeRef?.current?.appendChild(render.domElement);//插入canvas
    }, [render])

    return (<div className="container" ref={threeRef}></div>)
}

export default Index;