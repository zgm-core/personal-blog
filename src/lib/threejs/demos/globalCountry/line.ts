/* eslint-disable @typescript-eslint/no-explicit-any */
import { lon2xyz } from "../smallCodeThree/math";
import * as THREE from "three";

export const borderLine = (R: number, polygonArr: number[][][]) => {
  const group = new THREE.Group();
  //循环数组，把经纬度转换成球面坐标，创建线模型
  polygonArr.forEach((polygon: number[][]) => {
    const pointArr: number[] = []; //边界线顶点坐标
    polygon[0].forEach((ele: any) => {
      const pos = lon2xyz(R, ele[0], ele[1]);
      pointArr.push(pos.x, pos.y, pos.z);
    });

    //利用球面坐标点生成国家边界线
    group.add(creatLineMesh(pointArr));
  });

  return group;
};

function creatLineMesh(pointArr: number[]) {
  //创建几何模型
  const geometry = new THREE.BufferGeometry();
  //设置点的位置属性
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(pointArr), 3)
  ); //每三个点组成一个球面坐标点
  //定义线模型材质
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00aaaa,
  });
  //创建线模型
  const lineMesh = new THREE.LineLoop(geometry, lineMaterial);
  return lineMesh;
}
