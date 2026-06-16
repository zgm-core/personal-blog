import { lon2xyz } from "../smallCodeThree/math";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 解析数据
 */

import * as THREE from "three";
// import { buildCountryMesh } from "./countryMesh";
import R from "../instance/config";
import { createLine } from "../instance/lineMesh";

//创建文件加载器
const loader = new THREE.FileLoader();
//设置解析出来的数据格式
loader.setResponseType("json");

//创建一个组，装说有的mesh
const group = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/threejs/earth.png");

export const buildModel = () => {

  group.add(createLine(R.R*1.001))

  const geometry = new THREE.SphereGeometry(R.R, 40, 40);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
  // 加载全球国家的边界模型
  loader.load("/threejs/instance/people.json", (data: any) => {
    //  console.log("data",data.population);
    const coord = data.population; //所有经纬度坐标和对应需要可视化的数值
    const Max: number = maxFun(coord) * 0.05; //设置一个基准值,以要可视化的数据最大值为准即可 如果极大值过大 也可以根据需要降低 以视觉效果呈现为准
    const geoArr: any = []; //所有几何体集合
    const color1 = new THREE.Color(0x00aa88);
    const color2 = new THREE.Color(0x00ff88); //最大数值对应柱子颜色
    coord.forEach((element: number[]) => {
      const populationDensity = element[2]; //对应数值  人口密度
      // 创建一根柱子高度
      const height: number = populationDensity / 50;
      //创建一个几何体
      const geometry = new THREE.BoxGeometry(0.5, 0.5, height); //柱子长宽0.5 0.5 尺寸最好不要过大或过小
      //定义一个颜色
      const color: any = color1
        .clone()
        .lerp(color2.clone(), populationDensity / Max);

      //给几何体上的点设置不同颜色
      const points = geometry.attributes.position; //获取几何体上的位置属性
      // console.log("points",points);
      //定义一个颜色数组，装到点的颜色
      const colorArr:any = [];
      for (let i = 0; i < points.count; i++) {
        // pos.count表示几何体geometry顶点数量
        if (points.getZ(i) < 0) {
          //柱子几何体底部顶点对应颜色
          colorArr.push(color.r * 0.0, color.g * 0.1, color.b * 0.1);
        } else {
          //柱子几何体顶部顶点对应颜色
          colorArr.push(color.r * 0.0, color.g * 1.0, color.b * 1.0);
        }
      }
      //设置几何体的顶点颜色
      geometry.setAttribute("color",new THREE.BufferAttribute(new Float32Array(colorArr), 3));
      const SphereCoord = lon2xyz(R.R, element[0], element[1]); //SphereCoord球面坐标
      // 沿着z轴也就是柱子高度方向平移R+height / 2
      geometry.translate(0, 0, R.R + height / 2);
      // 通过lookAt调整几何体姿态角度
      geometry.lookAt(
        new THREE.Vector3(SphereCoord.x, SphereCoord.y, SphereCoord.z)
      );
      //把几何体放入到一个组里面后面做统一渲染，提高渲染性能
      geoArr.push(geometry);
    });

    //把所有的几何体都合体成一个渲染
    const sigalGeo = BufferGeometryUtils.mergeGeometries(geoArr);
    // console.log('柱子顶点数量接近百万',BfferGeometry.attributes.position.count)
    // console.log('柱子三角形索引量约140万',BfferGeometry.index.count)
    //定义柱子的材质
 
 
    const material = new THREE.MeshLambertMaterial({
      vertexColors: true,//使用顶点颜色着色
    });

    //创建网格模型
    const mesh = new THREE.Mesh(sigalGeo, material);

    group.add(mesh);
  });
  group.add(sphere);

  return group;
};

// 所有人口密度值提取到一个数组中，然后对数组进行排序，获得最大密度值
function maxFun(coord: number[][]) {
  const array = [];
  for (let i = 0; i < coord.length; i++) {
    array.push(coord[i][2]);
  }
  array.sort(compareNum);
  return array[array.length - 1];
  // 数组排序规则
  function compareNum(num1: number, num2: number) {
    if (num1 < num2) {
      return -1;
    } else if (num1 > num2) {
      return 1;
    } else {
      return 0;
    }
  }
}
