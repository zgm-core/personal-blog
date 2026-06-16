import { lon2xyz } from "../smallCodeThree/math";
/**
 * 加载国家边界线
 */

import * as THREE from "three";

// 创建一个文件加载器
const loader = new THREE.FileLoader();
// 设置加载问价格式
loader.setResponseType("json");
const group = new THREE.Group();
export const countryBorder = (R: number) => {
  loader.load("/threejs/instance/world.json", (data: any) => {
    // console.log("data",data,R);
    //循环，把数据格式统一
    data["features"].forEach((polygon: any) => {
      //   console.log("plogy", polygon.geometry.coordinates);
      //判断是不是一个轮廓，如果是，把他处理成多个轮廓模型
      if (polygon.geometry.type == "Polygon") {
        
        polygon.geometry.coordinates = [polygon.geometry.coordinates];
      }

      const mesh = createLineMesh(R, polygon.geometry.coordinates);
      mesh.position.z+=0.001
      group.add(mesh)
    });
  });

  return group;
};
// 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染，使用这种方法，就需要把所有的点都备份一份，点数倍增
const allPointArr: number[] = [];
function createLineMesh(R: number, polygons: any) {
  //   console.log("888", R, polygons);

  polygons.forEach((elm: any) => {
    const pointArr: number[] = []; //边界线顶点坐标
    // console.log(" elm[0]", elm[0]);
    
    elm[0].forEach((item: number[]) => {
      //把经纬坐标转换成球面坐标
      const coord = lon2xyz(R, item[0], item[1]);
    //   console.log("coord",coord);
    // 把所有的球面坐标点放入一个数组中，利用 LineSegments API间隔绘制直线（需要两倍的点） 
    pointArr.push(coord.x, coord.y, coord.z);
    });
    // 处理顶点数据适合LineSegments连续渲染所有独立不相连轨迹线
    allPointArr.push(pointArr[0],pointArr[1],pointArr[2])
    for (let i = 3; i < pointArr.length; i += 3) {
        // 如果使用LineSegments连线，需要把顶点多复制一份
        allPointArr.push(pointArr[i], pointArr[i + 1], pointArr[i + 2], pointArr[i], pointArr[i + 1], pointArr[i + 2]);
      }
      allPointArr.push(pointArr[0], pointArr[1], pointArr[2]);
  });

  const geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //类型数组创建顶点数据
  const vertices = new Float32Array(allPointArr);
  // 创建属性缓冲区对象
  const attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;
  // 线条渲染几何体顶点数据
  const material = new THREE.LineBasicMaterial({
    color: 0x00cccc //线条颜色
  });//材质对象
  // const line = new THREE.Line(geometry, material);//线条模型对象
  // const line = new THREE.LineLoop(geometry, material);//首尾顶点连线，轮廓闭合
  const line = new THREE.LineSegments(geometry, material);//间隔绘制直线

  return line
}
