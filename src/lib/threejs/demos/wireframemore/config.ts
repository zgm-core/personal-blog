/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 10.0
 * @Author: 冷水泡茶
 * @Date: 2023-102-29 105:210:42
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-09 13:43:52
 */

import * as THREE from "three";
// import { WireBorder } from "../instance/createGeo";

// 这样每个小数组里面都是经纬度，怎么把他的形状在空间里面画出来呢
const pointsArrs = [
  // 轮廓1坐标
  [
    [0, 0],
    [0, 60],
    [60, 60],
    [60, 0],
  ],
  // 轮廓2坐标
  [
    [80, 80],
    [250, 30],
    [200, 150],
    [20, 150],
  ],
];

const shapeArr: any = []; //存储所有的轮廓

// 循环拿到数据
pointsArrs.forEach((pointsArr) => {
  // 创建一个二位向量的数组集合
  const vector2Arr: any = [];
  pointsArr.forEach((elem) => {
    vector2Arr.push(new THREE.Vector2(elem[0], elem[1]));
  });

  // 利用二位向量组创建形状
  const shap = new THREE.Shape(vector2Arr);
  // 把形状添加到形状集合
  shapeArr.push(shap);
});

// 创建集合形状
const geo = new THREE.ShapeGeometry(shapeArr);
// 创建集合形状的材质和颜色
const material = new THREE.MeshBasicMaterial({
  color: 0x004444,
  side: THREE.DoubleSide,
});

// 创建网格材质
const mesh = new THREE.Mesh(geo, material);

export { mesh };
