/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2023-12-27 11:29:08
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2023-12-28 11:23:50
 */

import { FC, useEffect, useRef } from "react"

import { addLight, creatClock, initScene, listenWindowChange, myRender, render, setControl, setCoordinateHelper,clearChild } from "./three/scene"


const Index: FC = () => {
    const threeRef= useRef<HTMLDivElement>(null);



    useEffect(() => {

        initScene(),
        addLight()
        listenWindowChange(),
        setCoordinateHelper(),
        creatClock(),
        setControl(),
        listenWindowChange(),
        clearChild(threeRef),
        myRender(),
        threeRef?.current?.appendChild(render.domElement);//插入canvas
 
    }, [render])
    return (
        <div className="container" ref={threeRef}>
            <h1>999</h1>
        </div>
    )
}


export default Index






















 

