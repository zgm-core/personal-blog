/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-31 09:27:09
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-06 14:59:02
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

  group.add(sphere);
  // const arr= geometry.attributes.position.array
  //  let vertices=[]//组成球的所有顶点
  //  for (let i = 0; i < arr.length; i+=3) {
  //   vertices.push(new THREE.Vector3(arr[i],arr[i+1],arr[i+2]))
  //  }
  //随机找两个点作为起始点和中点
  //  const startSphere=vertices[10]//飞线起点
  //  const endSphere=vertices[700]//飞线结束点
  //利用flyArc函数画出球面上任意两点之间的弧线

  //  const flyLine=flyArc(startSphere,endSphere)

  //   group.add(flyLine);

  // group.add(createBallArc());

  //利用循环画出很多飞线，起始点都为vertices[10]
  //结束点随机找
  //  for (let i = 0; i < 20; i++) {
  //   const endSphere =  vertices[Math.floor(vertices.length * Math.random())]

  //   const flyLine=flyArc(startSphere,endSphere)

  //   group.add(flyLine);
  //   }

  /**
   * 画出OA线
   * API:CatmullRomCurve3:从一系列的点创建一条平滑的三维样条曲线。
   */

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(100, 0, -100),
    new THREE.Vector3(0, 80, 0),
    new THREE.Vector3(-100, 0, 100),
  ]);

  const points = curve.getPoints(100);
  const geometry1 = new THREE.BufferGeometry().setFromPoints(points);

  const material1 = new THREE.LineBasicMaterial({ color: 0x006666 });
  const curveObject = new THREE.Line(geometry1, material1);
  group.add(curveObject);
  //开始取点画出OA线
  let index: number = 10; //取点的索引位置
  let num: number = 10; //从线上获取到的点
  let point2 = points.slice(index, num + index); //从组成曲线的点中获取到一断

  //利用这一段的点再生成一条曲线
  const geometry2 = new THREE.BufferGeometry().setFromPoints(point2);
  // const material2 = new THREE.LineBasicMaterial({color: 0x006666,	linewidth: 200, });
  // const curveObject2 = new THREE.Line(geometry2, material2);
  // group.add(curveObject2);

  //批量计算所有顶点颜色数据
  const posNum: number = point2.length - 2; //分界点"0x006666"色，两端和轨迹线一个颜色"0xffff00"
  const colorArr = [];
  // 创建两个颜色
  const color1 = new THREE.Color(0x006666); //曲线线颜色，
  const color2 = new THREE.Color(0xffff00); //流动线颜色，
  for (let i = 0; i < point2.length; i++) {
    //定义一个颜色保存,飞线段里面颜色设置为"0x00FF80"色，两侧设置为"0xFF8040"，也就是说中间某个位置向两侧颜色渐变
    let color: any;
    if (i < posNum) {
      color = color1.clone().lerp(color2, i / posNum);
    } else {
      color = color2
        .clone()
        .lerp(color1, (i - posNum) / (point2.length - posNum));
    }

    //设置他们（点）的颜色差值
    colorArr.push(color.r, color.g, color.b);
  }

  // 设置几何体顶点颜色数据
  geometry2.attributes.color = new THREE.BufferAttribute(
    new Float32Array(colorArr),
    3
  );

  //定义飞线材质
  const material2 = new THREE.LineBasicMaterial({
    vertexColors: true, //使用点颜色渲染
  });
  const curveObject2 = new THREE.Line(geometry2, material2);
  group.add(curveObject2);

  /**
   *  如上代码已经可以实现在曲线上画出一断不同颜色的线了，然后在render循环渲染的时候不停更换上面的点就可以实现OA流线，只是线的粗细和原来的
   *  曲线感觉一样粗，不太美观，所以采用颜色差值的手段，把那段流动的线颜色标注成一端亮一端暗。
   */

  return group;
};
