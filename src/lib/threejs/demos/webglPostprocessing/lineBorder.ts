/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-27 10:17:49
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-01 11:15:28
 */

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
//创建模型加载器
const loader=new GLTFLoader()

export const loadGift=()=>{
loader.load("/threejs/models/PrimaryIonDrive.glb",(gift:any)=>{
    // console.log("看看这是啥",gift);
    const model=gift.scene;

    return model;
})
}