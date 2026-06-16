/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-12 17:34:28
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-22 16:33:49
 */

import * as THREE from "three";
import R from "../instance/config";
import newsData from "../instance/HotNewsData";
import { createLightPillar } from "./lightPillar";
import { createPointTexture } from "./pointMesh";
import { createWaveMesh } from "./waveMesh";
let apertureMesh: any = [];
const chooseMesh:any=[]
export const createMesh = () => {
  const group = new THREE.Group();
  apertureMesh = [];
  newsData.forEach((v: any, i: number) => {
    // 圆标记
    const mesh = createPointTexture(R.R * 1.001, v.E, v.N);
    group.add(mesh);

    /**
     * 给mesh模型添加属性
     */

    mesh.name = v.name;//mesh对应新闻name属性 表示新闻发生地点
    mesh.title = v.title;//新闻标题
    mesh.herf = v.herf;//新闻超链接地址
    chooseMesh.push(mesh);

    // 光柱
    const height=5 + R.R*0.3 * (newsData.length-1 - i) / (newsData.length-1);// 热度越高，光柱高度越高
    const light = createLightPillar(R.R, v.E, v.N,0x44ffaa,height);//height是让光柱呈现不同高度
    group.add(light);

    // 光圈
    const aperture = createWaveMesh(R.R, v.E, v.N);
    group.add(aperture);
    apertureMesh.push(aperture);

    /**
     * 根据新闻热度的不同展示不同光柱高度，和不同的颜色
     */

    if (i == 0) {
      changeColor(mesh, light, aperture, 0xff6666); ////设置热点Mesh颜色
    } else if (i > 0 && i < 6) {
      // 设置光柱和光柱底座颜色
      changeColor(mesh, light, aperture, 0xffff66); //设置热点Mesh颜色
    }
  });

  return { apertureMesh, group,chooseMesh };
};

function changeColor(mesh: any, light: any, aperture: any, color: number) {
  // 光柱底座颜色设置
  mesh.material.color.set(color);

  // 光柱颜色设置
  light.children[0].material.color.set(color);

  // 波动光圈颜色设置
  aperture.material.color.set(color);
}
