/**
 * 画出球面上的弧线（共享模块）
 * 用于 3DFly, 3DOA, 3DOAMove, tadpoleOA
 */

import * as THREE from "three";
import { arcXOY } from "./arcLine";

/**
 *
 * @param startSphere 开始点的三维坐标
 * @param endSphere 结束点的三维坐标
 * @returns 返回画好的弧线模型
 */

 
 let group = new THREE.Group();
export const flyArc = (startSphere: any, endSphere: any) => {

//   group.add(drawBall(startSphere));
//   group.add(drawBall(endSphere));

  //利用起始点算出绘制弧线需要的关于Y轴对撑的起始点、结束点以及旋转需要的四元素。关于Y轴对撑的点前面学过
  const startEndQua = _3Dto2D(startSphere, endSphere);
  //调用arcXOY函数绘制一条圆弧飞线轨迹
  const arcline = arcXOY(startEndQua.startPoint, startEndQua.endPoint);
  arcline.quaternion.multiply(startEndQua.quaternion);
  group.add(arcline);
  return group;
};

function drawBall(params: any, color: number = 0xffff00) {
  const geometry = new THREE.SphereGeometry(6, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(params.x, params.y, params.z);
  return sphere;
}
/**
 *
 * @param startSphere 起始点 A点
 * @param endSphere 结束点   B点
 */
function _3Dto2D(startSphere: any, endSphere: any) {
  //假设平面旋转到XOY面，那么Z轴就是平面的法线，在三维空间的话OA、OB的叉乘就能算出来平面AOB的法线，从三维空间把法线旋转了和Z轴
  //平行，这中间的旋转因素就是四元素
  const origin = new THREE.Vector3(0, 0, 0);//球心坐标
  //1.计算出三维空间AOB平面的法向量
  const startDir = startSphere.clone().sub(origin);
  const endDir = endSphere.clone().sub(origin);
  const normal = startDir.clone().cross(endDir).normalize(); //将AOB法向量转换为单位向量
  const xoyNormal = new THREE.Vector3(0, 0, 1); //XOY平面的法向量Z轴
  const quaternion3D_XOY = new THREE.Quaternion().setFromUnitVectors(normal,xoyNormal); //第一次旋转需要的四元素

  //第一次旋转：把三维空间内的AOB平面向量OA、OB旋转到XOY二维平面
  const startSphereXOY = startSphere.clone().applyQuaternion(quaternion3D_XOY);
  const endSphereXOY = endSphere.clone().applyQuaternion(quaternion3D_XOY);

  //向量需要进行第二次旋转，使得A、B两个点早XOY平面内关于Y轴对撑，那么就需要计算出第二次旋转的四元素，所白了就是要把
  //AB中点和圆心构成的方向向量旋转了和Y轴重合

  //计算出A、B点在XOY平面内构成的向量AB的中点
  const middleV3 = startSphereXOY.clone().add(endSphereXOY).multiplyScalar(0.5);
  const midDir = middleV3.clone().sub(origin).normalize(); // 旋转前向量midDir，中点middleV3和球心构成的方向向量
  const yDir = new THREE.Vector3(0, 1, 0); //定义Y轴上的方向向量
  const quaternionXOY_Y = new THREE.Quaternion().setFromUnitVectors(midDir,yDir); //从midDir旋转到yDir的四元素

  //旋转了关于Y轴对撑
  const startSpherXOY_Y = startSphereXOY.clone().applyQuaternion(quaternionXOY_Y);
  const endSphereXOY_Y = endSphereXOY.clone().applyQuaternion(quaternionXOY_Y);

  /**一个四元数表示一个旋转过程
   *.invert ()方法表示四元数的逆，简单说就是把旋转过程倒过来
   * 两次旋转的四元数执行.invert()求逆，然后执行.multiply()相乘
   *新版本.invert ()对应旧版本.invert()
   */

  //说白了就是相当于一开始两个点构成的平面就在XOY平面内，然后旋转到三维空间

  const quaternionInverse = quaternion3D_XOY
    .clone()
    .invert()
    .multiply(quaternionXOY_Y.clone().invert());

  return {
    // 返回两次旋转四元数的逆四元数
    quaternion: quaternionInverse,
    // 范围两次旋转后在XOY平面上关于y轴对称的圆弧起点和结束点坐标
    startPoint: startSpherXOY_Y,
    endPoint: endSphereXOY_Y,
  };
}
