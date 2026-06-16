/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-12 17:34:28
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-12 17:43:02
 */

import * as THREE from "three";
import R from "../instance/config";
import newsData from "../instance/HotNewsData";
import { createPointTexture } from "./pointMesh";

export const createMesh = () => {
  const group = new THREE.Group();
  newsData.forEach((v: any) => {
    const mesh = createPointTexture(R.R * 1.001, v.E, v.N);
    group.add(mesh);
  });

  return group;
};
