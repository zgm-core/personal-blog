/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2023-12-27 11:29:08
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-10 14:28:16
 */

import { FC, useEffect, useRef } from "react"

import { addLight, creatClock, initScene, listenWindowChange, myRender, render, setControl, setCoordinateHelper, clearChild, scene } from "../instance/scene"
import { drawShap } from "./config";


const Index: FC = () => {
    const threeRef = useRef<HTMLDivElement>(null);

    //把three.js绘制出来的图形 转换成图片下载下来
    const saveFile = () => {
        // 创建一个超链接元素，用来下载保存数据的文件
        const link = document.createElement('a');
        // 通过超链接herf属性，设置要保存到文件中的数据
        const canvas = render.domElement;//获取canvas对象
        link.href = canvas.toDataURL("image/png");
        link.download = 'earth.png'; //下载文件名
        link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
    }

    // 创建一个下载按钮
    const createBtn = () => {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top = '0px'
        button.style.left = '0px'
        button.style.width = '60px'
        button.style.height = '20px'
        button.style.fontSize = '16px'
        button.style.padding = "0";
        button.innerHTML = '下载';
        button.onclick = saveFile;
        document.body.appendChild(button);
    }

    useEffect(() => {
        createBtn()
    }, [])

    useEffect(() => {

        initScene();
        scene.add(drawShap());
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
























