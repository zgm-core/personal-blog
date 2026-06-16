// import { lon2xyz } from "../smallCodeThree/math";
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 10.0
 * @Author: 冷水泡茶
 * @Date: 2023-102-29 105:210:42
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-11 17:44:27
 */

import * as THREE from "three";
import { border } from "./line";
import allPointArr from "../instance/lineData"
// 想要数据先加载JSON文件

export const drawShap = (R: number) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader();

  loader.setResponseType("json"); //读取文件后，文件里面的数据以json的形式返回来

  // 一个国家有一个或者多个轮廓线，把一个国家的所有轮廓线作为一个对象存入组里面。
  const mapGroup = new THREE.Group();

  // // 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染
  // const allPointArr: number[] = [];
  // // 数据加载是一个异步过程会在最后执行，可以直接执行加载计算出来的结果，不用每次都load加载
  // loader.load(
  //   "/src/pages/threeDemo/instance/world.json",
  //   (data: any) => {
  //     // 访问所有国家边界坐标数据：data.features
  //     data.features.forEach((country: any) => {
  //       // "Polygon"：国家country有一个封闭轮廓
  //       //"MultiPolygon"：国家country有多个封闭轮廓
  //       if (country.geometry.type === "Polygon") {
  //         // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
  //         country.geometry.coordinates = [country.geometry.coordinates];
  //       }

  //       // 把拿到的经纬度转换为三维坐标
  //       country.geometry.coordinates.forEach((polygon: any) => {
  //         const pointArr: number[] = []; //一个国家轮廓的所有经纬度坐标
  //         polygon[0].forEach((elem: number[]) => {
  //           // 经纬度转换
  //           const coord = lon2xyz(1, elem[0], elem[1]);
  //           // pointArr.push(coord.x, coord.y, coord.z);
  //           // 小数点位数太多了，保存数据的时候文件很大，不失真的情况下保留适当的小数就好。
  //           const n = 3;
  //           pointArr.push(
  //             parseFloat(coord.x.toFixed(n)),
  //             parseFloat(coord.y.toFixed(n)),
  //             parseFloat(coord.z.toFixed(n))
  //           );
  //         });

  //         // 把组成国家的每个点的坐标都备份一份，相当于把原来的数据扩大道原来的两倍
  //         // 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染
  //         allPointArr.push(pointArr[0], pointArr[1], pointArr[2]);
  //         // 循环赋值其他店
  //         for (let i = 3; i < pointArr.length; i += 3) {
  //           // 如果使用LineSegments连线，需要把顶点多复制一份
  //           allPointArr.push(
  //             pointArr[i],
  //             pointArr[i + 1],
  //             pointArr[i + 2],
  //             pointArr[i],
  //             pointArr[i + 1],
  //             pointArr[i + 2]
  //           );
  //         }

  //         // 最后把第一个点在备份一次，加上前面备份的就有两份了
  //         allPointArr.push(pointArr[0], pointArr[1], pointArr[2]);

  //         // 解析所有封闭轮廓边界坐标country.geometry.coordinates
  //         mapGroup.add(border(pointArr)); //国家边界轮廓插入组对象mapGroup
  //       });
  //       // console.log("傻子", country.geometry.coordinates);
  //     });
  //     // 打印数据到控制台，把他赋值到一个文件中去，这样就不用每次都去读取文件消耗内存资源了，要用时直接去文件里面拿到合成后的数据
  //     console.log(JSON.stringify(allPointArr));

  //     // 把所有国家创建成一个线模型
  //     const lineSegments = border(allPointArr);
  //     lineSegments.scale.set(R, R, R); //球面坐标对应半径是1，需要缩放R倍
  //     mapGroup.add(lineSegments); //一个LineSegments渲染所有国家边界坐标
  //   },
  //   function () {},
  //   function (err: any) {
  //     console.log("报错", err);
  //   }
  // );


      // 把所有国家创建成一个线模型
      const lineSegments = border(allPointArr);
      lineSegments.scale.set(R, R, R); //球面坐标对应半径是1，需要缩放R倍
      mapGroup.add(lineSegments); //一个LineSegments渲染所有国家边界坐标

  return mapGroup;
};
