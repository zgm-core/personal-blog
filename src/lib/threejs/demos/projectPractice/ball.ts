import * as THREE from "three";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-07 09:40:36
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-20 14:38:50
 */

 
export const createEarth = (R:number) => {
  //创建纹理加载器/threejs/earth.png
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/threejs/earth.png");
  const geometry = new THREE.SphereGeometry(R, 60, 60);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    // opacity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
};
