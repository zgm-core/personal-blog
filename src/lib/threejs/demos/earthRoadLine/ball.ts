/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as THREE from "three";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-09 17:03:51
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-09 17:34:55
 */
export const shapeMesh = (pointsArrs: any) => {
  //形状缓冲几何体: ShapeGeometry Shape，他可以把集合框线填充

  const shapeArr: any[] = []; //轮廓形状Shape集合

  pointsArrs.forEach((pointsArr: any[]) => {
    const vector2Arr: any[] = []; // 转化为Vector2构成的顶点数组
    pointsArr[0].forEach((elem: number[]) => {
      vector2Arr.push(new THREE.Vector2(elem[0], elem[1]));
    });

    const shap = new THREE.Shape(vector2Arr); //创建一个轮廓

    shapeArr.push(shap);
  });
  const geometry = new THREE.ShapeGeometry( shapeArr );
  //   创建轮廓的材质
  const material = new THREE.MeshBasicMaterial({
    color: 0x004444,
    side: THREE.DoubleSide,
  });

//   创建模型
const mesh=new THREE.Mesh(geometry,material)

return mesh
};
