/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-31 09:27:09
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-04 17:37:47
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 解析数据
 */

import * as THREE from "three";
// import { buildCountryMesh } from "./countryMesh";
import R from "../instance/config";
import { arcXOY } from "../instance/arcLine";
import { createBallArc } from "../instance/ballBessel";
import { helpView } from "../instance/help";
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
  group.add(createLine(R.R * 1.001));

  const geometry = new THREE.SphereGeometry(R.R, 40, 40);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);

  group.add(sphere);
  group.add(createBallArc());
  /**
   * 批量绘制多条线
   */

  const num = 10; //批量绘制多组
  /*所有飞线弧线顶部距离地球球面的距离和夹角大小成正比，(飞线起点-球心-飞线结束点构成的夹角)
 夹角均匀变化，飞线之间的间距自然均匀变化*/
  for (let i = 1; i < num; i++) {
    const startAngle = (Math.PI / 2 / num) * i; //圆弧起点和坐标原点构成的角度
    const x = R.R * Math.cos(startAngle); //飞线圆弧起点横坐标
    const y = R.R * Math.sin(startAngle); //飞线圆弧起点纵坐标
    // 飞线圆弧起点坐标startPoint、结束点坐标endPoint
    const startPoint = new THREE.Vector3(x, y, 0);
    const endPoint = new THREE.Vector3(-x, y, 0);

    // 调用arcXOY函数绘制一条圆弧飞线轨迹，你可以通过修改上面的角度startAngle查看不同起点、结束点对应飞线效果
    const arcline = arcXOY(startPoint, endPoint);

    group.add(arcline);
 
    /*为了方便你观察和学习，下面通过球和箭头对一些几何数据进行标注
   arcline.center属性表示飞线圆弧的圆心
   arcline.topCoord属性表示飞线圆弧中间也就是顶部坐标*/
   group.add(helpView(startPoint, endPoint, arcline.center, arcline.topCoord));
  }

  return group;
};
