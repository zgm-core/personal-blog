/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-31 09:27:09
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-06 11:19:39
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 解析数据
 */

import * as THREE from "three";
import R from "../instance/config";
import { flyArc } from "../instance/drawLine";


//创建文件加载器
const loader = new THREE.FileLoader();
//设置解析出来的数据格式
loader.setResponseType("json");

//创建一个组，装说有的mesh
const group = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/threejs/earth.png");

export const buildModel = () => {
  // group.add(createLine(R.R * 1.001));

  const geometry = new THREE.SphereGeometry(R.R, 40, 40);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
 
 const arr= geometry.attributes.position.array
 let vertices=[]//组成球的所有顶点
 for (let i = 0; i < arr.length; i+=3) {
  vertices.push(new THREE.Vector3(arr[i],arr[i+1],arr[i+2]))
 }
//随机找两个点作为起始点和中点
 const startSphere=vertices[10]//飞线起点
 const endSphere=vertices[700]//飞线结束点
 //利用flyArc函数画出球面上任意两点之间的弧线


 

 const flyLine=flyArc(startSphere,endSphere)
 
  group.add(flyLine);
  group.add(sphere);
  // group.add(createBallArc());

   //利用循环画出很多飞线，起始点都为vertices[10]
 //结束点随机找
 for (let i = 0; i < 20; i++) {
  const endSphere =  vertices[Math.floor(vertices.length * Math.random())]
   
  const flyLine=flyArc(startSphere,endSphere)
  
  group.add(flyLine);
  }
 
  return group;
};
