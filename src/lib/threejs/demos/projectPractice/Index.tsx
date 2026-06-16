/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-06 15:01:55
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-19 17:44:37
 */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * 全球国家人口密度渲染
 */

import { FC, useEffect, useRef } from "react"
 
import { addLight, clearChild, creatClock, initScene, listenWindowChange, myRender, render, scene, setControl, setCoordinateHelper } from "../instance/scene"
import {  createModel } from "./earth"

const  Index:FC=()=>{
    const threeRef=useRef<HTMLDivElement>(null)

    useEffect(()=>{
        initScene([200, 300, 200],[0, 0, 0],150);
        scene.add(createModel());
        addLight()
        listenWindowChange()
        setCoordinateHelper()
        creatClock()
        setControl()
        listenWindowChange()
        clearChild(threeRef)
        myRender()
        threeRef?.current?.appendChild(render.domElement);//插入canvas
    },[render])

    return (<div className="container" ref={threeRef}></div>)
}

export default Index