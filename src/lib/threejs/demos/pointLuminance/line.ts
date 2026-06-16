/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-10 16:19:14
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-11 17:47:15
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";

//画出国家线的时候可以不用每次都去循环加载文件，可以用计算好的数据，这样内存可以得到有效释放

export const border = (pointsArrs: number[]) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([...pointsArrs]);
  const attribute = new THREE.BufferAttribute(vertices, 3); //itemSize = 3 因为每个顶点都是一个三元组。
  geometry.setAttribute("position", attribute);
  const material = new THREE.LineBasicMaterial({ color: 0x00aaaa });
  // const line = new THREE.LineLoop(geometry, material);
  const line=new THREE.LineSegments(geometry, material);//间隔绘制直线
  return line;
};
