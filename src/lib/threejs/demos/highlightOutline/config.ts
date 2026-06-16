/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 10.0
 * @Author: 冷水泡茶
 * @Date: 2023-102-29 105:210:42
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-10 11:35:04
 */

import * as THREE from "three";
import { border } from "./line";
import { shapeMesh } from "./shap";
// import { WireBorder } from "../instance/createGeo";

// 想要数据先加载JSON文件

export const drawShap = () => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader();

  loader.setResponseType("json"); //读取文件后，文件里面的数据以json的形式返回来

  // 一个国家有一个或者多个轮廓线，把一个国家的所有轮廓线作为一个对象存入组里面。
  const mapGroup = new THREE.Group();
  const lineGroup = new THREE.Group(); //轮廓Mesh组
  lineGroup.position.z += 1;//适当偏移解决深度冲突，使得轮廓线显示的更明显
  mapGroup.add(lineGroup);
  // 数据加载是一个异步过程会在最后执行
  loader.load(
    "/threejs/instance/world.json",
    (data: any) => {
      // 访问所有国家边界坐标数据：data.features
      data.features.forEach((country: any) => {
        // "Polygon"：国家country有一个封闭轮廓
        //"MultiPolygon"：国家country有多个封闭轮廓
        if (country.geometry.type === "Polygon") {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          country.geometry.coordinates = [country.geometry.coordinates];
        }
        // 解析所有封闭轮廓边界坐标country.geometry.coordinates
        lineGroup.add(border(country.geometry.coordinates)); //国家边界轮廓插入组对象mapGroup
        mapGroup.add(shapeMesh(country.geometry.coordinates)); //国家轮廓Mesh插入组对象mapGroup
      });
    },
    function () {},
    function (err: any) {
      console.log("报错", err);
    }
  );

  return mapGroup;
};
