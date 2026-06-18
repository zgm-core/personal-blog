/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-25 09:25:34
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-26 15:50:12
 */

import * as THREE from "three";
import R from "../instance/config";
import { createBall } from "./ball";
import { chooseCountry } from "./chooseCountry";
import { createCountryMesh } from "./countryMesh";
import { borderLine } from "./line";
 
//解析全球国家边界线
type CountryMesh = THREE.Mesh & { color?: THREE.Color; gdp?: number }
const group = Object.assign(new THREE.Group(), { meshArr: [] as CountryMesh[] }); //创建组，自顶一个属性包含所有国家mesh，用于鼠标射线拾取
const loader = new THREE.FileLoader(); //创建文件加载器
loader.setResponseType("json"); //设置解析出来的数据格式
 
 
export const resolveData = () => {
  group.add(createBall(R.R, 60, 60));
  
  // 加载文件
  loader.load("/threejs/instance/world.json", (elm: any) => {
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
      mesh.name = e.properties.name;//设置每个国家mesh对应的国家名称
    });
    
  });

  addEventListener("click", (event:any)=>{
   const label= chooseCountry(event,group)
   group.add(label)
  }); // 监听窗口鼠标单击事件,鼠标单击选中某个国家Mesh

  return group;
};

function sendMeshes() {
  if (!group.meshArr.length) return;
  return group;
}

 

export { sendMeshes };
