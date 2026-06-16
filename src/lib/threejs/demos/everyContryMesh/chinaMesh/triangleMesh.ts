/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-24 14:03:12
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-24 17:09:57
 */
/**
 * 在线框模型周围区域添加点使得点阵把整个线框都包住
 */

import * as THREE from "three";
import { sendPointData } from "./dataJson";
import { pointInPolygon } from "./pointInPolygon";
import Delaunator from "delaunator";

export const createTriangleMesh = () => {
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

  const pointArr: number[][] = []; //处理点阵顶点坐标，用于生成几何体顶点坐标
  polygonPoints.forEach(function (elem) {
    // 这样添加是把所有的点添加进去了，实际业务中我们只需要框线内部的点，这里我们可以安装一个js库进行计算判断，是在框线内的才添加
    if (pointInPolygon(elem, sendPointData())) {
      //去掉这一步就是点阵
      pointArr.push(elem);
    }
  });

  //pointArr：框线内的点

  // 其实我们把在框线内的点渲染出来，只是一个示意，我们最终的目的是要把这些点连城三角形，最总让每个国家都是一个单独的模型
  const arrPoints: number[][] = [...sendPointData(), ...pointArr]; //框线及框线内部的做有点集合
  //目前的所有点只有x，y坐标，我们把他的z坐标默认为0添加进去
  const posArr: number[] = []; //处理polygonPointsArr，作为几何体顶点坐标
  arrPoints.map((item: number[]) => {
    posArr.push(item[0], item[1], 0);
  });

  //利用这些点找到三角形的索引，  三角剖分，.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
  const indexArr = Delaunator.from(arrPoints).triangles;
  // console.log("三角形的索引值", indexArr);

  //其实这里的 indexArr 数据是要经过处理的，因为框线外也会有三角形，我们的目标是三角形只能在框线内。
  //办法：取出轮廓里面的点，做三角形计算，如果点在框线外那就不要这个三角形，这里我们以取到中心为列。
  //创建一个数组保存处理后的三角形索引值
  const usefulIndexArr:number[]=[]
  for(let i=0;i<indexArr.length;i+=3){
    const p1=arrPoints[indexArr[i]]
    const p2=arrPoints[indexArr[i+1]]
    const p3=arrPoints[indexArr[i+2]]

    const core:number[]=[(p1[0]+p2[0]+p3[0])/3,(p1[1]+p2[1]+p3[1])/3]//重心
    //判断点是否在框线内
    if(pointInPolygon(core, sendPointData())){
      //保留复合条件三角形对应的索引：indexArr[i], indexArr[i+1],indexArr[i+2]
      usefulIndexArr.push(indexArr[i], indexArr[i+1],indexArr[i+2])//这种情况需要设置three.js材质背面可见THREE.BackSide才能看到球面国家Mesh
    }
  }

  // 创建几何体类型
  const pointGeo = new THREE.BufferGeometry();

  // 设置几何体顶点索引
  //.index:允许顶点在多个三角面片间可以重用。这样的顶点被称为"已索引的三角面片（indexed triangles)
  // pointGeo.index = new THREE.BufferAttribute(new Uint16Array(indexArr), 1);
  pointGeo.index = new THREE.BufferAttribute(new Uint16Array(usefulIndexArr), 1);

  pointGeo.attributes.position = new THREE.BufferAttribute(
    new Float32Array(posArr),
    3
  );

  const material = new THREE.MeshBasicMaterial({
    color: 0x004444,
    side: THREE.BackSide, //背面可见，默认正面可见   THREE.DoubleSide：双面可见
  }); //材质
  const mesh = new THREE.Mesh(pointGeo, material); // 三角模型
  mesh.position.z = -0.01;

  //渲染三角形线框
  const mesh2 = mesh.clone();
  mesh2.material = new THREE.MeshBasicMaterial({
    color: 0x009999,
    wireframe: true,
  });

  const group = new THREE.Group();
  group.add(mesh);
  group.add(mesh2);
  return group;
};

function minMax(arr: number[]) {
  arr.sort(compareNum);
  //为了保正点阵可以完全包住线框模型，所以取到的最小值要向下取整，最大值向上取整
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])];
}

function compareNum(num1: number, num2: number) {
  return num1 < num2 ? -1 : num1 > num2 ? 1 : 0;
}
