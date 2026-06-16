import { lon2xyz } from "../smallCodeThree/math";
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-12 14:00:32
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-12 17:44:34
 */

import * as THREE from "three";

/**
 * 在地球上标记一个点，这个点要合球面相贴
 * @returns 返回个贴图模型
 */
export const createPointTexture = (R: number, lon: number, lat: number) => {
  // 给个纹理贴图
  // 加载图片给球体一个纹理贴图
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/threejs/texture.png");
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    map: texture,
    transparent: true, //一定要png图片才可设置此属性
  });
  const plane = new THREE.Mesh(geometry, material);

  // 转换平面坐标为球面坐标
  const coord = lon2xyz(R * 1.001, lon, lat);
  //   这是贴图在球面上的位置
  plane.position.set(coord.x, coord.y, coord.z);

  // 设置了位置后可以看到，贴图标注在球面上了，但是他不是贴在球面上的二是插在球面上的。
  // 如果需要贴在球面上，就需要算出点到球心的向量，然后再算出他的法向量，这样就可以贴在球面上了。

  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量) .normalize ():将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度变短
  const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();
  //mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0,1)
  const meshNormal = new THREE.Vector3(0, 0, 1);

  // 四元数属性.quaternion表示mesh的角度状态
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  plane.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return plane;
};
