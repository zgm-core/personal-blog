/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-09 16:41:05
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-07 11:17:02
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";

export const border = (pointsArrs: number[]) => {
  // 一个国家的轮廓线作为一个对象
  const group = new THREE.Group();

  // 把给的只有经度纬度的坐标转换成有xyz轴的数据
  pointsArrs.forEach((polygon: any) => {
    const pointArr:number[] = []; //创建一个数组保存xyz坐标
    polygon[0].forEach((element: number[]) => {
      pointArr.push(element[0], element[1], 0); //默认z坐标为0，
    });

    // 利用坐标点集合生成线框
    const meshLine = createBufferGeometry(pointArr);

    // 一个国家的线框模型作为一个对象存起来 
    group.add(meshLine);
  });

  return group;
};

/**
 *
 * @param pointArr BufferGeometry:是面片、线或点几何体的有效表述
 */
function createBufferGeometry(pointArr: number[]) {
  //创建一个Buffer类型几何体对象
  const geometry = new THREE.BufferGeometry();

  //类型数组创建顶点数据
  const vertices = new Float32Array(pointArr); //类型数组创建顶点数据

  // 创建属性缓冲区对象
  const attribute = new THREE.BufferAttribute(vertices, 3);

  //   设置几何体attributes属性的位置属性
  geometry.setAttribute("position", attribute);

  // 创建线的材质
  const material = new THREE.LineBasicMaterial({ color: 0x00cccc });

  // 创建线模型
  const line = new THREE.LineLoop(geometry, material); //LineLoop首尾相接

  return line;
}
