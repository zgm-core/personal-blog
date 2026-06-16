import { lon2xyz } from "../smallCodeThree/math";
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-11 17:59:53
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-12 10:32:26
 */

//
import * as THREE from "three";
import R from "../instance/config";
// 读取点文件数据，返回点模型
/**
 * 功能：点多的地方点的亮度高，点少的地方点的亮度暗一些。
 * @returns 返回点模型
 */
export const createPoint = () => {
  // 创建文件加载器
  const loader = new THREE.FileLoader();
  //   设置加载到的数据类型
  loader.setResponseType("json");
  //   加载文件
  const pointGroup = new THREE.Group();
  loader.load(
    "/threejs/pointLuminance/airports.json",
    (data: any) => {
      // console.log(data);
      const points = data.points; // 拿到所有点数据
      const numArr = data.num; // 拿到一个点他的周围有多少个点
      const numMax = numArr.slice().sort(compareNum)[numArr.length - 1];//数组复制并排序，然后获得最大值
      const verticesArr: number[] = []; //所有顶点数据，三个元素为一组
      const colorArr = []; //所有顶点颜色数据，三个元素为一组
      const color1 = new THREE.Color(0x4F9EB9); //周边点最少点对应顶点颜色
      const color2 = new THREE.Color(0x26D5D9); //周边点最多点对应顶点颜色
      // 把拿到的经纬度坐标转换成球面坐标

      for (let i = 0; i < points.length; i += 2) {
        // 每两个长度为一组经纬度，
        const lon = points[i]; //经度
        const lat = points[i + 1]; //纬度

        try {
          if (lon && lat) {
            //   把经纬度转换成球面坐标
            const cord = lon2xyz(R.R * 1.001, lon, lat);
            //   把所有的坐标都添加进数组里面
            verticesArr.push(cord.x, cord.y, cord.z);
            // 颜色插值计算
            let percent = (numArr[i / 2] / numMax) * 100;
            if (percent > 1.0) percent = 1.0;
            const color = color1.clone().lerp(color2.clone(), percent);
            colorArr.push(color.r, color.g, color.b);
          }
        } catch (error: any) {
          throw new Error(`捕获到的错误是：${error}`);
        }
      }

      const meshPoint = createBallPoint(verticesArr);
      pointGroup.add(meshPoint);
    }
  );

  return pointGroup;
};

function createBallPoint(vertices: number[]) {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const material = new THREE.PointsMaterial({  vertexColors: true, size: 0.5 });

  const points = new THREE.Points(geometry, material);

  return points;
}

// 数组排序规则
function compareNum(num1:number, num2:number) {
  if (num1 < num2) {
    return -1;
  } else if (num1 > num2) {
    return 1;
  } else {
    return 0;
  }
}

