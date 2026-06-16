import * as THREE from "three";
import { lon2xyz } from "../instance/math";

export const createLightPillar = (R: number, lon: number, lat: number,color=0x44ffaa,height:number) => {
  // 创建一个纹理加载器
  const loader = new THREE.TextureLoader();

  //   加载纹理
  const texture = loader.load("/threejs/gz.png");

  //   创建平面缓冲几何体 
//   const geometry = new THREE.PlaneGeometry(R*0.05, R * 0.3);
  const geometry = new THREE.PlaneGeometry(R*0.05, height);

  //   旋转几何体
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 0, height/ 2);

  // 规定几何体的材质并贴上纹理
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color:color?color:0x44ffaa,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
    side: THREE.DoubleSide,
    depthWrite: false, //是否对深度缓冲区有任何的影响
  });
  //创建几何模型
  const plane = new THREE.Mesh(geometry, material);

  //   创建一个组
  const group = new THREE.Group();

  //   把模型添加进一个组里面,两个光柱交叉叠加
  group.add(plane, plane.clone().rotateZ(Math.PI / 2));

  //   计算球面经纬度
  const coord = lon2xyz(R, lon, lat); //SphereCoord球面坐标
  group.position.set(coord.x, coord.y, coord.z);

  // mesh姿态设置
  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize(); //方向向量

  // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
  const meshNormal = new THREE.Vector3(0, 0, 1); //法线向量

  // 四元数属性.quaternion表示mesh的角度状态
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  group.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return group;
};
