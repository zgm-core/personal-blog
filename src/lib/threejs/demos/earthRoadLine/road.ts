import { lon2xyz } from "../smallCodeThree/math";
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-11 17:59:53
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-12 11:30:46
 */

//
import * as THREE from "three";
import R from "../instance/config";
// 读取点文件数据，返回点模型
/**
 * 功能：点多的地方点的亮度高，点少的地方点的亮度暗一些。
 * @returns 返回点模型
 */
export const createLine = () => {
  // 创建文件加载器
  const loader = new THREE.FileLoader();
  //   设置加载到的数据类型
  loader.setResponseType("json");
  //   加载文件
  const lineGroup = new THREE.Group();
  const allLineData: number[] = [];
  loader.load("/threejs/earthRoadLine/road.json", (data: any) => {
    // console.log("data", data["features"]);

    data["features"].forEach((obj: any) => {
      // 统一格式
      if (obj["geometry"]["type"] == "LineString") {
        obj["geometry"]["coordinates"] = [obj["geometry"]["coordinates"]];
      }

      obj["geometry"]["coordinates"].forEach((arr: any) => {
        const pointArr: number[] = [];
        // 把平面坐标转换成球面坐标
        arr.forEach((elm: number[]) => {
          const cord = lon2xyz(R.R * 1.001, elm[0], elm[1]);
          pointArr.push(cord.x, cord.y, cord.z);
        });

        // 处理顶点数据适合LineSegments连续渲染所有独立不相连轨迹线
        allLineData.push(pointArr[0], pointArr[1], pointArr[2]);

        for (let i = 3; i < pointArr.length - 3; i += 3) {
          // 如果使用LineSegments连线，需要把顶点多复制一份
          allLineData.push(
            pointArr[i],
            pointArr[i + 1],
            pointArr[i + 2],
            pointArr[i],
            pointArr[i + 1],
            pointArr[i + 2]
          );
        }

        const index = pointArr.length - 3;
        // 获取后三个数据
        allLineData.push(
          pointArr[index],
          pointArr[index + 1],
          pointArr[index + 2]
        );
      });
    });

    lineGroup.add(createRoadLine(allLineData));
  
  });

  return lineGroup;
};

function createRoadLine(allLineData: number[]) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(allLineData);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0xffff00,
  });

  const mesh=new THREE.LineSegments(geometry,material)

  return mesh
}

 
