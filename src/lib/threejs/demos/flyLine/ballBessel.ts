/* eslint-disable @typescript-eslint/no-explicit-any */
import { lon2xyz } from "../smallCodeThree/math";

/**
 * 晓得球面上的两个点，用贝塞尔曲线连接他们
 */

import * as THREE from "three";
import R from "../instance/config";
// 创建一个组装所有的mesh
const groupMesh = new THREE.Group();

//创建三个点（原点：008000绿色，球面上的两个点：FF8000黄色（洛阳经纬度112.45,34.62），红色：FF0000（罗马经纬度12.6, 41.9））
const colorArr: number[] = [0x008000, 0xff8000, 0xff0000];
//三个坐标在球上的位置坐标转换

const LY = lon2xyz(R.R, 112.45, 34.62);
const LM = lon2xyz(R.R, 12.6, 41.9);

const startPoint = new THREE.Vector3(LY.x, LY.y, LY.z); //开始点
//   .normalize()
//   .multiplyScalar(R.R + 5); //单位向量*R.R+2.5 倍数
const endPoint = new THREE.Vector3(LM.x, LM.y, LM.z);
//   .normalize()
//   .multiplyScalar(R.R + 5);
const O = new THREE.Vector3(0, 0, 0); //原点
const positionArr = [O, startPoint, endPoint];

for (let i = 0; i < colorArr.length; i++) {
  groupMesh.add(createBall(colorArr[i], i));
}

/**
 * 目标创建贝塞尔曲线，只知道端点，我们要计算找出两个控制点
 * 假设O2是A点，O2是B点，原点是O1，由点AOB构成一个三角平面
 * 画出OA,OB的辅助坐标轴
 * 计算出AOB平面上的A、B两点对应球面上的切线段
 * 然后在A、B切线段相交于P点，（我们用篮球表示）
 * 在切线PA,PB上找出两个点，用来控制贝塞尔曲线
 */

const startDir = startPoint.clone().normalize(); //OA单位向量
const endDir = endPoint.clone().normalize(); //OB单位向量
//  画出OA、OB的辅助坐标
groupMesh.add(drawArray(startDir, O));
groupMesh.add(drawArray(endDir, O));

//利用叉乘算法API计算出AOB平面的法线 P
const normal = startDir.clone().cross(endDir.clone()).normalize(); //将该向量设置为它本身与传入的v的叉积
groupMesh.add(drawArray(normal, O, R.R / 2, 0xff0000));

//切线计算,假设AOB平面的法线末端是Q点，那么AOQ平面的法线就是A点在球面上的切线
const tangentA = normal.clone().cross(startDir).normalize(); //AOQ平面法线的单位向量
const tangentB = normal.clone().cross(endDir).normalize(); //BOQ平面法线的单位向量
tangentB.negate(); //向量tangentB取反

// 标注切线
// groupMesh.add(drawArray(tangentA, startPoint, 92, 0xff0000));//这里92是手动改的，不够精确。下面AP的长度才是精确值
// groupMesh.add(drawArray(tangentB, endPoint, 92, 0xff0000));
/**
 * 其实切线(红线)交叉点P，和AOB点构成四边形，其中ZOP和BOP都是直角三角形
 *  要算出切线的长度用正切就可以算出来，角AOP=∂，tan∂=AP/OA,∂的值
 * 我们可以算出来，那么AP就用一个反切arctan∂就算出来了
 */

// const angle=Math.acos()
//点乘.dot()几何含义:你只需要记住a.dot(b)的几何含义是向量a在向量b上投影长度与向量b相乘，或者说向量a长度 * 向量b长度 * cos(ab夹角)。
//假设两个向量的夹角是θ，两个向量的单位向量进行点乘a.dot(b)，返回的结果就是夹角θ的余弦值cos(θ)
//反余弦计算向量夹角弧度

//--------测试代码--------------------------------
// const a = new THREE.Vector3(10, 10, 0);
// const b = new THREE.Vector3(20, 0, 0);
//向量a与向量b点乘，返回结果是一个数字
// const dot = a.dot(b);
// console.log('点乘结果',dot);//200
//--------测试代码--------------------------------

//计算角AOB的弧度值。轨迹线起始点和球心构成的夹角(弧度值)
// cosθ = startDir.dot(endDir);//把cosθ的值拿来进行反余弦求职，就可以得出θ是多少度
const angle = Math.acos(Math.max(-1, Math.min(1, startDir.clone().dot(endDir.clone()))));
//计算A长度,tanθ=AP/OA(R)===>AP=R*tanθ
const AP = Math.tan(angle / 2) * R.R; //angle/2原理：OA==OB ,三角形AOB是等边三角形，又因为AP、BQ垂直于OA、OB所以AP、BQ长度相等，所以一般夹角是angle/2
// 标注切线
groupMesh.add(drawArray(tangentA, startPoint, AP, 0xff0000));
groupMesh.add(drawArray(tangentB, endPoint, AP, 0xff0000));

//把Q点也在空间里面用小球画出来（蓝色）。add:将传入的向量v和这个向量相加。相当于是向量OA+向量AP，等于向量OQ。O是原点，那么OQ就是Q点坐标
const C = startPoint.clone().add(tangentA.clone().multiplyScalar(AP)); //tangentA:是垂直于AOP平面（A点）的单位向量,他扩大AP倍就是Q点坐标
//添加小球
positionArr.push(C);
groupMesh.add(createBall(0x0000ff, 3));

//在切线AQ和BQ上各自选择一点来控制贝塞尔曲线
const p2 = startPoint.clone().add(tangentA.clone().multiplyScalar(AP * 0.9));
const p3 = endPoint.clone().add(tangentB.clone().multiplyScalar(AP * 0.9));

//创建贝塞尔曲线
groupMesh.add(createBezierCurve(startPoint, p2, p3, endPoint));

//箭头辅助线
function drawArray(
  end: any,
  start: any,
  length: number = R.R + 5,
  color: number = 0xffff00
) {
  const arrowHelper = new THREE.ArrowHelper(end, start, length, color); //ArrowHelper(结束点，开始点，长度，颜色)
  return arrowHelper;
}

function createBall(color: number, i: number) {
  const geometry = new THREE.SphereGeometry(5, 60, 60);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(positionArr[i]);

  return sphere;
}

function createBezierCurve(startPoint: any, p2: any, p3: any, endPoint: any) {
  const curve = new THREE.CubicBezierCurve3(startPoint, p2, p3, endPoint);
  const points = curve.getPoints(50);//曲线上返回一定数量点
  const geometry = new THREE.BufferGeometry().setFromPoints(points);//设置几何体顶点数据

  const material = new THREE.LineBasicMaterial({
     color: 0x00ffff,//线条颜色
     
    });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);

  return curveObject;
}

export { groupMesh };
