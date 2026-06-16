/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 方法区域-------------------------------------------------------------------------------
// 初始化three.js场景

import { lon2xyz } from "../../smallCodeThree/math";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SphGeo } from "./createGeo";
let scene: any,
  camera: any,
  render: any,
  ambient: any,
  axesHelper: any,
  controls: any;
// eslint-disable-next-line react-hooks/exhaustive-deps
const initScene = () => {
  // 1.创建场景
  scene = new THREE.Scene();

  // 2.创建透视相机添加到场景中（摄像机视锥体垂直视野角度，摄像机视锥体长宽比，摄像机视锥体近端面，摄像机视锥体远端面）
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    300
  );
  camera.position.set(100, 100, 100); //利用OrbitControls重新设置相机参数 调整视角
  camera.lookAt(0, 0, 0);

  // 3.创建渲染器--设置渲染画布的尺寸--设置设备的像素比--添加渲染器到场景中
  render = new THREE.WebGLRenderer({ antialias: true }); //antialias:抗锯齿
  render.setSize(window.innerWidth, window.innerHeight); //渲染区域尺寸
  render.setPixelRatio(window.devicePixelRatio);
  render.setClearColor(0x001111, 1); //设置背景颜色（canvas画布背景）
  render.render(scene, camera);
  addLight();
  setCoordinateHelper();
};

// 添加光源
const addLight = () => {
  //环境光 (十六进制颜色，强度)
  ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  // 平行光
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight1.position.set(400, 300, 200);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight1.position.set(-400, -300, -200);
  scene.add(directionalLight2);

  // const { x, y, z } = lon2xyz(40, 110.35, 20.02);
  const geo = new SphGeo(40, 0,0,0);
  const mesh = geo.DrawSphereGeo();
  scene.add(mesh);
};

// 设置辅助坐标
const setCoordinateHelper = () => {
  // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
  axesHelper = new THREE.AxesHelper(50);
  axesHelper.position.set(0, 0, 0);
  scene.add(axesHelper);
};

// 添加一个轨道控制器
const setControl = () => {
  controls = new OrbitControls(camera, render.domElement);
  controls.enableDamping = false; //是否用阻尼效果
  controls.target.set(0, 0, 0);
  controls.update(); //update()函数内会执行camera.lookAt(controls.targe)
};

// 创建帧级别的循环渲染
const myRender = () => {
  // earthMesh.rotateY(0.01);//地球绕y轴旋转动画
  controls?.update();
  render.render(scene, camera);
  requestAnimationFrame(myRender);
};
// 创建时钟
const creatClock = () => {
  const clock = new THREE.Clock();
  console.log(clock);
};

// 监听窗口尺寸变化--重新调整场景尺寸
const listenWindowChange = () => {
  // 监听窗口变化
  window.addEventListener("resize", () => {
    // 1.设置相机拍摄椎体的长宽比--更新相机的投影矩阵
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // 2.设置画布尺寸--设置像素比
    render.setSize(window.innerWidth, window.innerHeight);
    render.setPixelRatio(window.devicePixelRatio);
  });
};

// // 创建一个立方体
// const createBox = () => {
//     const geometry = new THREE.BoxGeometry(10, 10, 10);
//     const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);
// }

// // 创建一个球体
// const createSphereGeo = () => {
//     const geometry = new THREE.SphereGeometry(7, 32, 16);
//     const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.position.set(0, 0, 40)
//     scene.add(sphere);
// }

// // 创建一个地球 R:地球半径
// const createSphereMesh = (R: number) => {
//     // TextureLoader 创建一个纹理加载器  加载图片作为纹理贴图
//     const textureLoader = new THREE.TextureLoader();
//     const texture = textureLoader.load(new URL(`./earth-1.jpg`, import.meta.url).href)//加载纹理贴图
//     const geometry = new THREE.SphereGeometry(R, 100, 100)//创建一个球体集合对象
//     const material = new THREE.MeshLambertMaterial({
//          map: texture,
//         //    transparent:true,
//         color:0xffffff
//         });//网格材质
//     const mesh = new THREE.Mesh(geometry, material);//网格模型对象

//     return mesh

// }

// 判断是是不是已经有canvas如果有就删除
const clearChild = (threeRef: any) => {
  if (threeRef.current.hasChildNodes())
    threeRef.current.removeChild(threeRef.current.children[0]);
};
// 方法区域-------------------------------------------------------------------------------

export {
  initScene,
  addLight,
  setCoordinateHelper,
  creatClock,
  setControl,
  listenWindowChange,
  clearChild,
  myRender,
  render
};
