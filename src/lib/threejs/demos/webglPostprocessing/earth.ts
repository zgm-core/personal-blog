/**
 * 把边界线解析出来画出框线
 */

import * as THREE from "three";
import { scene } from "../instance/scene";
import { initBorderLine } from "./countryLine";
import { initLabel } from "./createLabel";
import { triangulation } from "./delaunay";
import { getAllPoints } from "./gridePoints";
import { useCoord } from "./hooks/useCoord";
import { useCountryLine } from "./hooks/useCountry";
import { useCSS2DRender } from "./hooks/useCSS2DRender";
import { useFileLoader } from "./hooks/useFileLoader";
import { useSequenceFrameAnimate } from "./hooks/useSequenceFrameAnimate";
import { useStandardData } from "./hooks/useStandardData";
import { initAreaBorder } from "./initAreaLine";
import { initRotatingAperture, initRotatingPoint, initSceneBg } from "./initBg";
import { initCirclePoint } from "./initCirlePoint";
import { initLightPoint } from "./initIightPoint";
import { initParticle } from "./initLz";

const { createCountryFlatLine } = useCountryLine();
//创建一个纹理加载器
const texture = new THREE.TextureLoader();
const textureMap = texture.load("/threejs/map/gz-map.jpg");

const topFaceMaterial = new THREE.MeshPhongMaterial({
  map: textureMap,
  color: 0xb4eeea,
  //选项为THREE.MultiplyOperation（默认值），THREE.MixOperation，
  //THREE.AddOperation。如果选择多个，则使用.reflectivity在两种颜色之间进行混合。
  combine: THREE.MultiplyOperation, //combine:如何将表面颜色的结果与环境贴图（如果有）结合起来
  transparent: true,
  opacity: 1,
});
const sideMaterial = new THREE.MeshLambertMaterial({
  color: 0x123024,
  transparent: true,
  opacity: 0.9,
});

const group = Object.assign(new THREE.Group(), { meshArr: [] as THREE.Mesh[] }); //自定义一个属性包含所有国家mesh，用于鼠标射线拾取
export const loaderLine = async () => {
  //调用请求数据的方法
  const { http, progress } = useFileLoader();
  //请求远程的数据
  const data = await http("/threejs/map/四川省.json")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error('四川省.json 加载失败', err);
    });

  // 如果数据加载失败则提前返回空 Group
  if (!data) {
    console.error("四川省.json 数据加载失败");
    return group;
  }

  // 把所有的数据处理成统一格式，（一个多边形轮廓的处理成多个多边形轮廓的数据格式）
  const { transfromGeoJSON } = useStandardData();
  // 转换后的数据
  const formatData = transfromGeoJSON(data);
  let dom = document.getElementsByClassName("container")[0];
  const { initCSS2DRender } = useCSS2DRender();

  initCSS2DRender({ width: innerWidth, height: innerHeight }, dom);
  formatData.forEach((elem: any) => {
    //  console.log("饿了么，elm",elem);

    // 定一个省份对象
    const province = new THREE.Object3D();
    // 坐标
    const coordinates = elem.geometry.coordinates;
    // city 属性
    const properties = elem.properties;

    // 循环坐标

    coordinates.forEach((multiPolygon: any, index: number) => {
      multiPolygon.forEach((polygon: any) => {
        const shape = new THREE.Shape();

        const lineMesh = initAreaBorder(polygon[0]);

        // 绘制shape
        for (let i = 0; i < polygon.length; i++) {
          // console.log("456",polygon[i]);
          for (let j = 0; j < polygon[i].length; j++) {
            let [x, y] = polygon[i][j];
            if (i == 0) {
              shape.moveTo(x, y);
            }
            shape.lineTo(x, y);
          }
        }
        // 拉伸设置
        const extrudeSettings = {
          depth: 0.2, //挤出的形状的深度，默认值为1  （就是拉伸的高度）
          bevelEnabled: true, //对挤出的形状应用是否斜角，默认值为true。
          bevelSegments: 1, //斜角的分段层数，默认值为3
          bevelThickness: 0.1, //设置原始形状上斜角的厚度。默认值为0.2
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    

        const mesh = Object.assign(
          new THREE.Mesh(geometry, [
            topFaceMaterial.clone(),
            sideMaterial.clone(),
          ]),
          { name: properties["name"], _meshName: "model" }
        );
        // mesh.add(lineMesh)
        group.meshArr.push(mesh);
        province.add(mesh);
      });
    });
    group.add(province);

    // 创建标点和标签
    initLightPoint(properties, group);
    initLabel(properties, scene); //创建标签
  });

  /**
   * 创建上下面国家边界线
   */
  initBorderLine(formatData, group);

  // 给模型创建提个背景样式
  //因为整个模型使用了个3D盒子装着的，所以要获取模型参数，可以拿到3D盒子
  const { getBoundingBox } = useCoord();
  const box_3d = getBoundingBox(group);
  const { size, center } = box_3d;
  // console.log("000",box_3d);
  const width: number = size.x < size.y ? size.y + 1 : size.x + 1;
  const centerArr = [center.x, center.y];
  initSceneBg(scene, width, centerArr);
  // 添加背景，修饰元素
  initRotatingAperture(scene, width, centerArr);
  initRotatingPoint(scene, width - 2, centerArr);

  // 粒子
  initParticle(scene, box_3d);
  //点圆圈
  initCirclePoint(scene, width, centerArr);

  return group;
};
