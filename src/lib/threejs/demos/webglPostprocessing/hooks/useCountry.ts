/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-29 09:49:10
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-08 15:20:32
 */

import { deepMerge } from "../../instance/toolFn";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
export const useCountryLine = () => {
  /**
   * 创建国家平面边线
   * @param {*} data 数据
   * @param {*} materialOptions 材质参数
   * @returns
   */
  const createCountryFlatLine = (
    data: [],
    materialOptions = {},
    lineType = "LineLoop"
  ) => {
    let materialOpt = {
      color: 0x00ffff,
    };

    //对材质的处理
    materialOpt = deepMerge(materialOpt, materialOptions);
    //创建材质
    let material = new THREE.LineBasicMaterial(materialOpt);
    //判断传过来的线类型
    if (lineType == "Line2") material = new LineMaterial(materialOpt);

    //循环数据，创建线模型
    const group = new THREE.Group();
 

    data.forEach((item: any) => {
      // console.log("看看说什么",item);
      item["geometry"]["coordinates"][0].forEach((elm: any) => {
        // console.log("这是",elm);
        const points: number[] = []; //保存每一个板块区域的点数据

        if (lineType == "Line2") {
          elm.forEach((e: any) => {
            for (let i = 0; i < e.length; i++) {
              points.push(e[i][0], e[i][1], 0);
            }
          });

          // 创建一个区域的线条

          const line = createLine(points, material, lineType);
        

          group.add(line);
        } else {
          elm.forEach((e: any) => {
            for (let i = 0; i < e.length; i++) {
              points.push(new THREE.Vector3(e[0], e[1], 0));
            }
          });

          // 根据每一块的点数据创建线条
          let line = createLine(points, material, lineType);
          // 将线条插入到组中
          group.add(line);
        }
      });
    });

    return group;
  };

  /**
   * 根据点数据创建闭合的线条
   * @param {*} points 点数据
   * @param {*} material 材质
   * @param {*} lineType 生成的线条类型 Line 线 | LineLoop 环线 | LineSegments 线段 | Line2
   * @returns
   */
  const createLine = (
    points: number[],
    material: any,
    lineType = "LineLoop"
  ) => {
    let line = null;
    if (lineType == "Line2") {
      const geometry = new LineGeometry();
      //   console.log("哈哈哈",geometry.setPositions);
      geometry.name = "countryLine";

      geometry.setPositions(points);
      line = new Line2(geometry, material);
      line.name = "countryLine2";
      line.computeLineDistances();
    } else {
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints(points);
      line = new THREE[lineType](geometry, material);
      line.name = "countryLine";
      line._meshName="model"
    }

    return line;
  };

  return { createCountryFlatLine };
};
