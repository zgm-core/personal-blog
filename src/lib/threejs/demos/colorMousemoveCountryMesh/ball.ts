/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-26 15:51:55
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-29 09:50:54
 */
import * as THREE from "three";

export const createBall = (
  radius: number,
  widthSegments: number,
  heightSegments: number
) => {
  // console.log("创建球");

  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const material = new THREE.MeshLambertMaterial({
    color: 0x000909,
    transparent: true,
    opacity: 0.5,
  }); //0x000909黑色球体
  const sphere = new THREE.Mesh(geometry, material);

  return sphere;
};
