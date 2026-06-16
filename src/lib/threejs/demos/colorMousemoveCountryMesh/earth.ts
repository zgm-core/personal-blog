/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-25 09:25:34
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-29 10:37:32
 */

import * as THREE from "three";
import R from "../instance/config";
import { createBall } from "./ball";
import { chooseCountry } from "./chooseCountry";
import { getCountryGdpColor } from "./countryGdpColor";
import { createCountryMesh } from "./countryMesh";
import { FourPillar } from "./fourWheel";
import { borderLine } from "./line";

//解析全球国家边界线
const group = new THREE.Group(); //创建组
group.meshArr = []; //自顶一个属性包含所有国家mesh，用于鼠标射线拾取
const loader = new THREE.FileLoader(); //创建文件加载器
loader.setResponseType("json"); //设置解析出来的数据格式

export const resolveData = () => {
  group.add(createBall(R.R, 60, 60));
 

  // 这里是两个文件，先处理一下要吃一个文件就nice
  loader.load("/threejs/instance/gdp.json", (gdp: any) => {
    const countryGdpColor = getCountryGdpColor(gdp);
    loader.load("/threejs/instance/capital.json", (capital: any) => {
      // 加载文件
      loader.load("/threejs/instance/worldZh.json", (elm: any) => {
        //解析出来的数据
        // console.log("解析出来的数据",elm);//elm.features是数组
        //循环拿到的数组数据
        elm.features.forEach((e: any) => {
          //判断一个国家是有多个多边形还是只有一个
          //Polygon:表示一个国家只有一个轮廓
          //MultiPolygon:表示一个国家有多个轮廓
          //这里我们就把一个轮廓的处理和多个轮廓的数据格式一致
          if (e.geometry.type == "Polygon") {
            e.geometry.coordinates = [e.geometry.coordinates];
          }

          //console.log("数据当前格式",e.geometry.coordinates);//是个三维数组
          //拿出数组里面的经纬度数据，转换成球面坐标，进行国家mesh，和国家边界线的生成
          // R * 1.001比地球R稍大，以免深度冲突
          const mesh = createCountryMesh(R.R * 1.001, e.geometry.coordinates);
          const line = borderLine(R.R * 1.002, e.geometry.coordinates);

          //把国家mesh和国家边界线mesh放入组里面统一渲染，优化性能
          group.add(mesh);
          group.add(line);
          group.meshArr.push(mesh);
          // mesh.name = e.properties.name;//设置每个国家mesh对应的国家名称
          //给mesh带个名字
          mesh.name = e.properties.nameZh;
         
          //判断，如果返回来的对象里面有响应的名字，说明2019年有这个国家的GDP数据,给mesh定义颜色
          if (countryGdpColor[mesh.name]&&capital[ mesh.name]) {
            // mesh.material.color.copy(countryGdpColor[mesh.name]["color"]); //改变材质颜色
            mesh.color = countryGdpColor[mesh.name].color; //自定义颜色属性 用于射线拾取交互
            mesh.gdp = countryGdpColor[mesh.name]["gdp"]; //自定义颜色属性 用于射线拾取HTML标签显示

            //柱子相关
            group.add(FourPillar(2,2,mesh.gdp/100000000000,R.R,capital[ mesh.name][0],capital[ mesh.name][1], mesh.color));
          } else {
            mesh.material.color.set(0x004040);
            mesh.color = mesh.material.color.clone(); //自定义颜色属性 用于射线拾取交互
          }
        });
      });
    });
  });

  addEventListener("mousemove", (event: any) => {
    const { label } = chooseCountry(event, group);
    group.add(label);
  }); // 监听窗口鼠标单击事件,鼠标单击选中某个国家Mesh

  return group;
};

function sendMeshes() {
  if (!group.meshArr.length) return;
  return group;
}

export { sendMeshes };
