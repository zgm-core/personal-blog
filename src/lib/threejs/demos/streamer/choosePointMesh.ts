/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-22 17:20:40
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-24 15:10:54
 */
// pedestalMesh
// 鼠标移动监听

import * as THREE from "three";
import { camera } from "../instance/scene";
import { pedestalMesh } from "./earth";

window.addEventListener("mousemove", choosePointMesh);
window.addEventListener("click", clickMesh);
let chooseMesh: any = null;
function choosePointMesh(e: any) {
  const X = e.clientX; //鼠标单击位置横坐标
  const Y = e.clientY; //鼠标单击位置纵坐标
  //屏幕坐标转WebGL标准设备坐标
  const x = (X / window.innerWidth) * 2 - 1; //WebGL标准设备横坐标
  const y = -(Y / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标

  //创建一个射线投射器`Raycaster`
  const raycaster = new THREE.Raycaster();

  const pointer = new THREE.Vector2(x, y); //把点击坐标转换为二维向量

  //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
  // 通过摄像机和鼠标位置更新射线
//   raycaster.setFromCamera(pointer, camera);

  //计算物体和射线的焦点,
  //返回.intersectObjects()参数中射线选中的网格模型对象
  //未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
  const intersects = raycaster.intersectObjects(pedestalMesh());

  if (intersects.length > 0) {
    chooseMesh = intersects[0].object;
  } else {
    chooseMesh = null;
  }
}
// 设置鼠标单击事件，如果单击选中某个热点Mesh，跳转到响应的链接
function clickMesh(e: any) {
  choosePointMesh(e); //鼠标单击进行拾取计算
  if (chooseMesh) {
    //判断单击是否拾取到热点Mesh
    // window.open(chooseMesh.herf); //新的窗口打开
    // window.location.href = chooseMesh.herf  //当前页打开
  }
}

export { choosePointMesh, chooseMesh };
