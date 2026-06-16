/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-03-04 10:30:28
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-04 14:55:27
 */

import * as THREE from "three";

const loader=new THREE.TextureLoader()

 // 初始化原点
export const initCirclePoint = (scene:any, width:number,center:number[]) => {
  let plane = new THREE.PlaneGeometry(width, width);
  let material = new THREE.MeshPhongMaterial({
    color: 0x00ffff,
    map: loader.load("/threejs/map/wg.png"),
    transparent: true,
    opacity: 1,
    depthTest: false,
  });
  let mesh = new THREE.Mesh(plane, material);
  mesh.position.set(...center, -0.31);
  mesh.position.z=-0.35
  // let mesh2 = mesh.clone()
  // mesh2.position.set(...centerXY, bottomZ - 0.001)
  scene.add(mesh);
};