/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-25 17:29:19
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-26 11:46:05
 */

import * as THREE from "three";
import { camera } from "../instance/scene";
import { createDiv } from "./tag";
const label=createDiv()
//鼠标单击射线拾取meshArr中的某个国家Mesh
let chooseMesh: any;
export const chooseCountry = (event: any,group:any) => {
    // console.log("参数在哪里",event);
   
//  group.add(label)
 

  //如果上次选中了国家mesh,把他恢复成以前的颜色
  if (chooseMesh) {
    // 把上次选中的mesh设置为原来的颜色
    chooseMesh.material.color.set(0x002222);
    // console.log("999",label);
    label.element.style.visibility='hidden'

    
  }

  //获取鼠标点击点的屏幕坐标
  const X = event.clientX; //X坐标
  const Y = event.clientY; //Y坐标
  
  //把屏幕坐标转化成WebGL设备坐标
  const x = (X / window.innerWidth) * 2 - 1; //WebGL标准设备横坐标
  const y = -(Y / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标

  //创建一个射线投射器`Raycaster`
  const raycaster = new THREE.Raycaster();

  //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  //返回.intersectObjects()参数中射线选中的网格模型对象
  // 未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
  const intersects = raycaster.intersectObjects(group.meshArr);
  // console.log("射线器返回的对象", intersects);
  // console.log("射线投射器返回的对象 点point", intersects[0].point);
  // console.log("射线投射器的对象 几何体",intersects[0].object.geometry.vertices)
  // intersects.length大于0说明，说明选中了模型
  if (intersects.length > 0) {
    chooseMesh = intersects[0].object;
    chooseMesh.material.color.set(0x00cccc);//选中改变颜色
    // console.log("66",intersects[0]['point']);
    label.position.copy(intersects[0]['point'])
    label.element.innerHTML=chooseMesh.name
    label.element.style.visibility = 'visible';
    // console.log("label", label.element.innerHTML);
  }

  return label
};


