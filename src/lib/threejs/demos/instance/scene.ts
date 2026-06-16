/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 方法区域-------------------------------------------------------------------------------
// 初始化three.js场景
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { oaMove } from "../3DOAMove/earth";
import { labelRenderer } from "../globalCountry/tag";
import { allLineMove, waveGQ } from "../projectPractice/analyseData";
import { moveLine } from "../projectPractice/spaceOneLine";
import { createAnimation } from "../streamer/animation";
import { oaMoveKD } from "../tadpoleOA/earth";
import { tween } from "../webglPostprocessing/hooks/useMapMarkedLightPillar";
import { rotateBg } from "../webglPostprocessing/initBg";
import { lzMove } from "../webglPostprocessing/initLz";
 

// import { rotateBall } from "../streamer/earth";


let scene: any,
  camera: any,
  render: any,
  ambient: any,
  axesHelper: any,
  controls: any,
  rafId: number | null = null;


// eslint-disable-next-line react-hooks/exhaustive-deps
const initScene = (
  position: number[] = [0, 0, 800],
  lookPosition: number[],
  s: number = 180,
  route?:string
) => {
  // 1.创建场景
  scene = new THREE.Scene();

  // 2.创建透视相机添加到场景中（摄像机视锥体垂直视野角度，摄像机视锥体长宽比，摄像机视锥体近端面，摄像机视锥体远端面）
  const width = window.innerWidth; //窗口宽度
  const height = window.innerHeight; //窗口高度
  const k = width / height; //窗口宽高比
  // const s = s; //三维场景显示范围控制系数，系数越大，显示的范围越大
  //创建相机对象
  if(route=="/threeDemo25"){
    camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1500);
    camera.position.set(...position); //利用OrbitControls重新设置相机参数 调整视角
    camera.lookAt(lookPosition[0],lookPosition[1],lookPosition[2]);
  }else{
    camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(...position); //利用OrbitControls重新设置相机参数 调整视角
    camera.lookAt(scene.position );
  }

 

  // 3.创建渲染器--设置渲染画布的尺寸--设置设备的像素比--添加渲染器到场景中
  render = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
  }); //antialias:抗锯齿,// 如果想保存three.js canvas画布上的信息，注意设置preserveDrawingBuffer
  render.setSize(window.innerWidth, window.innerHeight); //渲染区域尺寸
  render.setPixelRatio(window.devicePixelRatio);
  render.setClearColor(0x001111, 1); //设置背景颜色（canvas画布背景）
  render.render(scene, camera);
  addLight();
  // setCoordinateHelper();
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
};

// 设置辅助坐标
const setCoordinateHelper = (x:number=0,y:number=0,z:number=0,route?:string) => {
 
  // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
  axesHelper = new THREE.AxesHelper(250);
  axesHelper.position.set(x, y, z);
  scene.add(axesHelper);
};

// 添加一个轨道控制器
const setControl = () => {
  controls = new OrbitControls(camera, render.domElement);
  controls.enableDamping = false; //是否用阻尼效果
  controls.target.set(0, 0, 0);//这个操作是把相机调了看向远点
  controls.update(); //update()函数内会执行camera.lookAt(controls.targe)
 
};


// console.log("666",location);
// 创建帧级别的循环渲染
const myRender = (callback?: any) => {
  if (typeof callback === "function") {
    callback();
  }
// console.log("哈哈哈",camera.position);

  // oaMove()
  oaMoveKD();
  createAnimation();
  if(callback=="threeDemo24"){
    moveLine();
  }
  allLineMove()
  waveGQ()
  
  tween()

  rotateBg()

  lzMove()

  // labelRenderer 可能在离开页面时被隐藏，这里恢复显示
  if (labelRenderer) {
    labelRenderer.domElement.style.display = "";
  }
  labelRenderer.render(scene, camera);

  // if (rotateMesh()) {
  //   rotateMesh().rotateY(0.005);
  // }
  // 鼠标旋转地球表面热点Mesh，停止自转

  // if(!chooseMesh){}

  // earthGroup.rotateY(0.01);//地球绕y轴旋转动画
  controls?.update();
  render.render(scene, camera);
  rafId = requestAnimationFrame(myRender);
};
// 创建时钟
const creatClock = () => {
  const clock = new THREE.Clock();
  // console.log(clock);
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

// 清理容器内所有子元素（canvas + CSS2DRenderer DOM 等）
const clearChild = (threeRef: any) => {
  if (threeRef.current) {
    while (threeRef.current.firstChild) {
      threeRef.current.removeChild(threeRef.current.firstChild);
    }
  }
};

// 停止渲染循环并清理全局 CSS2D 标签 DOM
const stopRender = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  // 隐藏挂在 document.body 上的全局 labelRenderer
  if (labelRenderer) {
    labelRenderer.domElement.style.display = "none";
  }
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
  stopRender,
  myRender,
  render,
  scene,
  camera,
  controls
};
