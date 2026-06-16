/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-20 13:55:21
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-20 14:03:26
 */
import { lon2xyz } from "../smallCodeThree/math";
import * as THREE from "three";

//平面缓冲几何体（PlaneGeometry）,一个用于生成平面几何体的类。
const geometry = new THREE.PlaneGeometry(1, 1);

//创建纹理加载器
const loader = new THREE.TextureLoader();
const texture = loader.load("/threejs/BZGQ.png");
//创建材质
const material = new THREE.MeshBasicMaterial({
  color:0x22ffcc,
  map: texture,
  side: THREE.DoubleSide,
  transparent: true, //使用背景透明的png贴图，注意开启透明计算
  opacity:1.0,
  depthWrite:false,//禁止写入深度缓冲区数据
});

//创建模型
const mesh = new THREE.Mesh(geometry, material);

/**
 *
 * @param R 球面半径
 * @param lon 经度
 * @param lat 纬度
 * @returns 返回一个光圈模型
 */
export const createWaveMesh = (R: number, lon: number, lat: number) => {
  //克隆平面模型并设置位置
  const mesh1 = mesh.clone();
  const coord = lon2xyz(R * 1.001, lon, lat);
  mesh1.scale.set(R * 0.16, R * 0.16, R * 0.16);
  mesh1.position.set(coord.x, coord.y, coord.z);
  mesh1.size = R * 0.16;//自顶一个属性，表示mesh静态大小
  mesh1._s = Math.random()*1.0 + 1.0;//自定义属性._s表示mesh在原始大小基础上放大倍数  光圈在原来mesh.size基础上1~2倍之间变化
  // mesh姿态设置
  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();
  // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
  const meshNormal = new THREE.Vector3(0, 0, 1);
  // 四元数属性.quaternion表示mesh的角度状态
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  mesh1.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return mesh1;
};
