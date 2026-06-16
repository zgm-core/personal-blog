/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-31 09:27:09
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-31 16:53:29
 */
 
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 解析数据
 */

import * as THREE from "three";
// import { buildCountryMesh } from "./countryMesh";
import R from "../instance/config";
import { groupMesh } from "./ballBessel";
import { createLine } from "../instance/lineMesh";

//创建文件加载器
const loader = new THREE.FileLoader();
//设置解析出来的数据格式
loader.setResponseType("json");

//创建一个组，装说有的mesh
const group = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/threejs/earth.png");

export const buildModel = () => {

  group.add(createLine(R.R*1.001))

  const geometry = new THREE.SphereGeometry(R.R, 40, 40);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);

 
  
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3( -10, 0, 0 ),
    new THREE.Vector3( -5, 15, 0 ),
    new THREE.Vector3( 20, 15, 0 ),
    new THREE.Vector3( 10, 0, 0 )
  );
  
  const points = curve.getPoints( 50 );
  const geometry1 = new THREE.BufferGeometry().setFromPoints( points );
  
  const material1 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  
  // Create the final object to add to the scene
  const curveObject = new THREE.Line( geometry1, material1 );


 
  group.add(sphere);
  group.add(curveObject);
  group.add(groupMesh)

  return group;
};
 
