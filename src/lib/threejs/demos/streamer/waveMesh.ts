import { lon2xyz } from "../smallCodeThree/math";
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-22 11:48:58
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-22 14:01:42
 */

import * as THREE from "three";

export const createWaveMesh = (R: number, lon: number, lat: number) => {
  // 创建纹理加载
  const loader = new THREE.TextureLoader();

  // 创建纹理图片
  const texture = loader.load("/threejs/gq.png");

  // 创建一个缓冲几何体
  const plane = new THREE.PlaneGeometry(1, 1);
  //定义几何体材质
  const material = new THREE.MeshBasicMaterial({
    color: 0x44ffaa,
    map: texture,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
    opacity: 1.0,
    side: THREE.DoubleSide, //双面可见
    depthWrite: false, //禁止写入深度缓冲区数据
  });

  // 计算出球上坐标
  const coord = lon2xyz(R * 1.001, lon, lat);

  const size = R * 0.12; //矩形平面Mesh的尺寸
  const mesh = Object.assign(new THREE.Mesh(plane, material), {
    size,                               // 自定义属性：mesh静态大小
    _s: Math.random() * 1.0 + 1.0,     // 自定义属性：光圈放大倍数 1~2倍
  });
  mesh.scale.set(size, size, size); //设置mesh大小
//   mesh.scale.set(mesh.size * mesh._s, mesh.size * mesh._s, mesh.size * mesh._s);
  // 设置几何模型在球面上的位置
  mesh.position.set(coord.x, coord.y, coord.z);

  // 设置几何体和球面相切
  const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize(); //计算出点到圆心的方向向量

  // 计算出单位向量，默认是z坐标
  const meshNormal = new THREE.Vector3(0, 0, 1);

  // 计算出方向向量和法线向量之间的夹角，让几何体和球面相切
  // 四元数属性.quaternion表示mesh的角度状态
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return mesh;
};
