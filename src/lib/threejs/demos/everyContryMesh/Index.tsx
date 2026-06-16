/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2023-12-27 11:29:08
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-24 16:28:49
 */

import { FC, useEffect, useRef } from "react"

import { addLight, creatClock, initScene, listenWindowChange, myRender, render, setControl, setCoordinateHelper, clearChild, scene, } from "../instance/scene"
import { makeUpMesh } from "./earth";


const Index: FC = () => {
    const threeRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        initScene([0,10, 20],[0, 10, 0],10);
        scene.add(makeUpMesh());
        addLight()
        listenWindowChange()
        setCoordinateHelper()
        creatClock()
        setControl()
        listenWindowChange()
        clearChild(threeRef)
        myRender()
        threeRef?.current?.appendChild(render.domElement);//插入canvas

    }, [render])
    return (
        <div className="container" ref={threeRef}></div>
    )
}


export default Index
























