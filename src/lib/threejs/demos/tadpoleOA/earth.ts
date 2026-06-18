/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-31 09:27:09
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-19 10:03:20
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 解析数据
 */

import * as THREE from "three";
import R from "../instance/config";

//创建文件加载器
const loader = new THREE.FileLoader();
//设置解析出来的数据格式
loader.setResponseType("json");

//创建一个组，装说有的mesh
const group = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/threejs/earth.png");
//开始取点画出OA线
let index: number = 20; //取点的索引位置
let num: number = 10; //从线上获取到的点
let points: any[] = [];
let point2: any[] = [];

const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(100, 0, -100),
  new THREE.Vector3(0, 80, 0),
  new THREE.Vector3(-100, 0, 100),
]);

let geometry2 = new THREE.BufferGeometry();

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

  points = curve.getPoints(200);
  const geometry1 = new THREE.BufferGeometry().setFromPoints(points);

  const material1 = new THREE.LineBasicMaterial({ color: 0x006666 });
  const curveObject = new THREE.Line(geometry1, material1);
  group.add(curveObject);

  point2 = points.slice(index, num + index); //从组成曲线的点中获取到一断

   const curve1 = new THREE.CatmullRomCurve3(point2);
        const newPoints2 = curve1.getSpacedPoints(100);//获取更多的点数
        // var geometry2 = new THREE.BufferGeometry();
        geometry2.setFromPoints(newPoints2);
        // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
        const percentArr = []; //attributes.percent的数据
        for (let i = 0; i < newPoints2.length; i++) {
            percentArr.push(i / newPoints2.length);
        }
        const percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1);
        geometry2.attributes.percent = percentAttribue;
        // 点模型渲染几何体每个顶点
        const PointsMaterial = new THREE.PointsMaterial({
            color: 0xffff00,
            size: 5.0, //点大小
        });
        const flyPoints = new THREE.Points(geometry2, PointsMaterial);
        group.add(flyPoints);
        // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
        PointsMaterial.onBeforeCompile = function (shader:any) {
            // 顶点着色器中声明一个attribute变量:百分比
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                [
                    'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
                    'void main() {',
                ].join('\n') // .join()把数组元素合成字符串
            );
            // 调整点渲染大小计算方式
            shader.vertexShader = shader.vertexShader.replace(
                'gl_PointSize = size;',
                [
                    'gl_PointSize = percent * size;',
                ].join('\n') // .join()把数组元素合成字符串
            );
        };


  /**
   *  如上代码已经可以实现在曲线上画出一断不同颜色的线了，然后在render循环渲染的时候不停更换上面的点就可以实现OA流线，只是线的粗细和原来的
   *  曲线感觉一样粗，不太美观，所以采用颜色差值的手段，把那段流动的线颜色标注成一端亮一端暗。
   */

  return group;
};

function oaMoveKD() {

  if (point2.length && points.length) {
    if (index > points.length - num) index = 10;
    index += 1;
    point2 = points.slice(index, index + num); //从曲线上获取一段
    // 至少需要2个点才能构建曲线
    if (point2.length < 2) return;
    //点太少停下来放大看会有间隙，我们可以取很多个点画点这样就点挨着点就不容易看出来了
    //思路：利用point2中的点生成一条曲线，再从曲线上去除n个点，去画，这样就可以达到目的了
    const curve = new THREE.CatmullRomCurve3(point2);
    const newPoints2 = curve.getSpacedPoints(100);//获取更多的点数
    geometry2.setFromPoints(newPoints2);
  }
}

export { oaMoveKD };
