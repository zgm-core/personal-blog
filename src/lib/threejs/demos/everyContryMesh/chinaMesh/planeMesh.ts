/**
 * 平面缓冲几何体（PlaneGeometry）
 */

import * as THREE from "three";
import { sendPointData } from "./dataJson";
const meshGroup=new THREE.Group()
export const createOutline = () => {
  const pointArr: number[] = []; //定义一个点数组把经纬度坐标转换成x,y,z坐标放在数组里面，
  sendPointData().forEach((elm: number[]) => {
    pointArr.push(elm[0], elm[1], 0);
  });

  //创建一个点围成的几何矩形
  const geometry = new THREE.BufferGeometry();
  //类型数组创建顶点数据,创建顶点数据
  const vector3 = new Float32Array(pointArr);
  //3个为一组，表示一个顶点的xyz坐标
  geometry.setAttribute("position", new THREE.BufferAttribute(vector3, 3));
  //创建组成轮廓的材质
  const material = new THREE.LineBasicMaterial({ color: 0xcccc00 });//基本材质
  //创建线框模型,LineLoop:线能自动收尾相接
  const lineMesh = new THREE.LineLoop(geometry, material);
  //放进组里面
  meshGroup.add(lineMesh)

  //定义点材质
  const materialPoint = new THREE.PointsMaterial( { color: 0xffff00,size:5 } );
  //创建点模型
  const pointMesh=new THREE.Points(geometry,materialPoint)
  meshGroup.add(pointMesh)

  

  return meshGroup
};
