/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-07 09:38:11
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-19 17:43:33
 */

import * as THREE from "three";
import { createEarth } from "./ball";
import R from "../instance/config";
import { countryBorder } from "./countryLine";
import { oneLine } from "./spaceOneLine";
import { getPointArc } from "./analyseData";
/**
 * 把所有的模型都在这里进行加载
 */
const group = new THREE.Group();
export const createModel = () => {
  group.add(createEarth(R.R));
  // countryBorder(R.R)
  group.add(countryBorder(R.R * 1.001));
  group.add(oneLine()); //一条三维曲线
  // getPointArc(R.R)
  group.add(getPointArc(R.R));

  return group;
};

 

