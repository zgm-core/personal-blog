/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-12 11:02:02
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-12 11:29:53
 */
// 创建一个球

import * as THREE from "three";
import R from "../instance/config";
import { drawShap } from "./config";
import { createSprite } from "./Sprite";
import { createLine } from "./road";
export const createBall = () => {
  const earthGroup = new THREE.Group();
  //  创建一个贴图的球
  const ball = createSphereMesh(R.R);
  const lineBorder = drawShap(R.R * 1.001);
  earthGroup.add(ball);
  earthGroup.add(lineBorder);
  earthGroup.add(createLine())
  //   添加精灵模型
  earthGroup.add(createSprite(R.R));

  
  return earthGroup;
};

// 创建球
function createSphereMesh(R: number) {
  // 加载图片给球体一个纹理贴图
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/threejs/earth.png");
  // 创建一个球体
  const geometry = new THREE.SphereGeometry(R, 64, 32);
  // 球体材质
  const material = new THREE.MeshLambertMaterial({
    //  color: 0xfffff ,
    map: texture,
  });

  //   创建一个模型、
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
