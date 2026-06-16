/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-12 11:02:02
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-22 17:19:14
 */
// 创建一个球

import * as THREE from "three";
import R from "../instance/config";
import { drawShap } from "./config";
import { createSprite } from "./Sprite";
import { createPointTexture } from "./pointMesh";
import { createMesh } from "./hotNews";
import { createLightPillar } from "./lightPillar";

const { group, apertureMesh,chooseMesh } = createMesh();
//  创建一个贴图的球
const ball = createSphereMesh(R.R);
const earthGroup = new THREE.Group();

export const createBall = () => {

  const lineBorder = drawShap(R.R * 1.001);
  earthGroup.add(ball);
  earthGroup.add(lineBorder);
  earthGroup.add(createPointTexture(R.R, 113.4668, 33.8818));
  earthGroup.add(group);
  //   添加精灵模型
  earthGroup.add(createSprite(R.R));

  // 添加光柱
  earthGroup.add(createLightPillar(R.R, 0, 0, 0x44ffaa, R.R * 0.6));

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

export const sendData = () => {
  return apertureMesh;
};


export const rotateMesh = () => {
  return earthGroup;
};

export const pedestalMesh = () => {
  return chooseMesh;
};