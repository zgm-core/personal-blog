import * as THREE from "three";
// 创建一个纹理加载器
const texture = new THREE.TextureLoader();

let mesh_1: any = null;
let mesh_2: any = null;
export const initSceneBg = (scene: any, width: number, center: number[]) => {
  // 创建平面缓冲几何体
  const geometry = new THREE.PlaneGeometry(width * 4, width * 4);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: texture.load("/threejs/map/scene-bg2.png"),
    transparent: true,
    opciaty: 1,
    depthTest: false, //是否在渲染此材质时启用深度测试。默认为 true
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(...center, -0.2 - 0.02);
  plane.position.z = -0.3;
  scene.add(plane);
};

// 初始化旋转光圈
export const initRotatingAperture = (
  scene: any,
  width: number,
  center: number[]
) => {
  let plane = new THREE.PlaneGeometry(width, width);
  let material = new THREE.MeshBasicMaterial({
    map: texture.load("/threejs/map/rotatingAperture.png"),
    transparent: true,
    opacity: 1,
    depthTest: true,
  });
  mesh_1 = new THREE.Mesh(plane, material);
  mesh_1.position.set(...center, 0);
  mesh_1.position.z = -0.2;
  mesh_1.scale.set(1.1, 1.1, 1.1);
  scene.add(mesh_1);
  return mesh_1;
};

export const initRotatingPoint = (
  scene: any,
  width: number,
  center: number[]
) => {
  let plane = new THREE.PlaneGeometry(width, width);
  let material = new THREE.MeshBasicMaterial({
    map: texture.load("/threejs/map/rotating-point2.png"),
    transparent: true,
    opacity: 1,
    depthTest: true,
  });
  mesh_2 = new THREE.Mesh(plane, material);
  mesh_2.position.set(...center, -0.3);
  mesh_2.scale.set(1.1, 1.1, 1.1);
  mesh_2.position.z = -0.3;
  scene.add(mesh_2);
  return mesh_2;
};

export const rotateBg = () => {
  if (mesh_1) {
    mesh_1.rotation.z += 0.0005;
  }
  if (mesh_2) {
    mesh_2.rotation.z -= 0.0005;
  }
};
