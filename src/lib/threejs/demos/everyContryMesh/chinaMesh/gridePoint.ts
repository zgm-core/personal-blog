/**
 * 在线框模型周围区域添加点使得点阵把整个线框都包住
 */

import * as THREE from "three";
import { sendPointData } from "./dataJson";
import { pointInPolygon } from "./pointInPolygon";

export const createPointMesh = () => {
    
  // 拿到所有的经纬度数据，然后把经纬度各自分开，写个方法把经度和纬度的最小最大值计算出来，从而得到能包住线框模型的矩阵左右坐标
  const lonArr: number[] = []; //装经度
  const latArr: number[] = []; //装纬度
  sendPointData().forEach((item: number[]) => {
    lonArr.push(item[0]);
    latArr.push(item[1]);
  });

  // 写个方法取出经度纬度中的最小最大值
  const [lonMin, lonMax] = minMax(lonArr); //经度方向填充多少行的顶点
  const [latMin, latMax] = minMax(latArr); //纬度方向填充多少列的顶点

  // 定义包住框线模型的点阵间距,polygon轮廓内填充顶点的经纬度间隔距离
  const gap: number = 1;
  // 计算组成点阵的行数，列数
  const rows: number = Math.ceil((lonMax - lonMin) / gap); //经度方向填充多少行的顶点
  const coluns: number = Math.ceil((latMax - latMin) / gap); //纬度方向填充多少行的顶点

  //定义组成矩阵网格的所有坐标点
  const polygonPoints: number[][] = [];
  for (let i = 0; i < rows + 1; i++) {
    for (let j = 0; j < coluns + 1; j++) {
      //两层for循环在矩形范围内批量生成等间距的网格顶点数据
      polygonPoints.push([lonMin + i * gap, latMin + j * gap]);
    }
  }

  const pointArr:number[] = [];//处理点阵顶点坐标，用于生成几何体顶点坐标
  polygonPoints.forEach(function (elem) {
    // 这样添加是把所有的点添加进去了，实际业务中我们只需要框线内部的点，这里我们可以安装一个js库进行计算判断，是在框线内的才添加
    if(pointInPolygon(elem,sendPointData())){//去掉这一步就是点阵
        pointArr.push(elem[0], elem[1], 0)
    }
  })

  //生成点阵
  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(pointArr)  , 3)
  );
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 3,
  }); //点材质
  const pointsMesh = new THREE.Points(pointGeo, pointsMaterial); // 点模型

  return pointsMesh;
};

function minMax(arr: number[]) {
  arr.sort(compareNum);
  //为了保正点阵可以完全包住线框模型，所以取到的最小值要向下取整，最大值向上取整
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])];
}

function compareNum(num1: number, num2: number) {
  return num1 < num2 ? -1 : num1 > num2 ? 1 : 0;
}
