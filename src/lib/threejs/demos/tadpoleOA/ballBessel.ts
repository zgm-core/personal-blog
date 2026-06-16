/**
 * 画圆弧
 */

import * as THREE from "three";
export const groupMesh = new THREE.Group();
export const createBallArc = () => {

  //参数：0, 0圆弧坐标原点x，y  50：圆弧半径    0, 2 * Math.PI：圆弧起始角度
  const curve = new THREE.ArcCurve(0, 0, 50, Math.PI*3/2, 2 * Math.PI, true, 0);

  const points = curve.getPoints(30);//数字越大越圆  越消耗性能
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0x00ffff });

  const ellipse = new THREE.Line(geometry, material);

  groupMesh.add(ellipse);
  
  return groupMesh;
};
