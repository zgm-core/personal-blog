import { lon2xyz } from "../smallCodeThree/math";
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-11 17:59:53
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-12 09:34:42
 */

import * as THREE from "three";
import R from "../instance/config";
// 读取点文件数据，返回点模型
export const createPoint = () => {
  // 创建文件加载器
  const loader = new THREE.FileLoader();
  //   设置加载到的数据类型
  loader.setResponseType("json");
  //   加载文件
  const vertices: number[] = [];
  const pointGroup = new THREE.Group();
  loader.load("/threejs/airportGeo/airports.json", (data: any) => {
    // console.log(data);

    // 把拿到的经纬度坐标转换成球面坐标
    data.forEach((elm: any) => {
      const lon = elm.longitude_deg; //经度
      const lat = elm.latitude_deg; //纬度
      try {
        if (lon && lat) {
          //   把经纬度转换成球面坐标
          const cord = lon2xyz(R.R * 1.001, lon, lat);
          //   把所有的坐标都添加进数组里面
          vertices.push(cord.x, cord.y, cord.z);
          //   利用球面坐标创建点模型
        }
      } catch (error: any) {
        throw new Error(`捕获到的错误是：${error}`);
      }
    });

    const meshPoint = createBallPoint(vertices);
    pointGroup.add(meshPoint);
  });

  return pointGroup;
};

function createBallPoint(vertices: number[]) {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const material = new THREE.PointsMaterial({ color: 0xffff00, size: 1.5 });

  const points = new THREE.Points(geometry, material);

  return points;
}
