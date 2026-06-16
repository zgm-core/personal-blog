/**
 * 返回计算函数
 * @returns
 */

import * as THREE from "three";

export const useCoord = () => {
  /**
   *
   * @param group 模型
   * @returns 返回包围盒参数
   */
  const getBoundingBox = (group: any) => {
    //用一个盒子把模型包围起来
    const box3 = new THREE.Box3(); //Box3:表示三维空间中的一个轴对齐包围盒
    box3.expandByObject(group); //group - 包裹在包围盒中的3d对象 Object3D。

    //计算包围盒的尺寸
    const size = new THREE.Vector3();
    box3.getSize(size);
    // console.log("查看返回的包围盒尺寸", size);

    //计算出盒子模型的集合中心，.getCenter ( target : Vector3 ) : Vector3  。
    // target — 如果指定了target ，结果将会被拷贝到target。 说白了就是box3这个盒子的中心点将会指定给center这个参数
    const center = new THREE.Vector3();
    box3.getCenter(center); // 计算一个层级模型对应包围盒的几何体中心坐标

    return {
      box3,
      center,
      size,
    };
  };

  return { getBoundingBox };
};
