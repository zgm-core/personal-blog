import { random } from "../../instance/toolFn";
import TWEEN from "@tweenjs/tween.js";
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-28 17:31:45
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-29 09:41:58
 */

import * as THREE from "three";

//创建一个纹理加载器
const texture = new THREE.TextureLoader();
export const useMapMarkedLightPillar = (options?: number) => {
  /**
   *
   * @param coordinates 金纬度
   * @param heightScaleFactor 高度
   * @returns 返回光柱
   */
  const createLightPillar = (coordinates: number[], heightScaleFactor = 1) => {
    //创建一个组来装光柱
    const group = new THREE.Group();
    //创建几何体
    const geometry = new THREE.PlaneGeometry(
      heightScaleFactor / 6.219,
      heightScaleFactor
    );

    //旋转几何体使得它站立
    geometry.rotateX(Math.PI / 2);
    // 顺着站立方向移动几何体，使得它在模型表面
    geometry.translate(0, 0, heightScaleFactor / 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture.load("/threejs/map/gz.png"),
      color: 0x00ffff,
      transparent: true,
      depthWrite: false, //渲染此材质是否对深度缓冲区有任何影响。默认为true。
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.name = "GZ_01";
    // 在创建一个和上面这个一样的光柱模型 然后多旋转90度
    const plane_1 = plane.clone();
    plane_1.rotateZ(Math.PI / 2);
    plane_1.name = "GZ_02";
    //底部的光标
    const bottomGB = createPointMesh();

    //动画光圈
    const animationGQ = createLightHalo();

    group.add(plane, plane_1, bottomGB, animationGQ);

    group.position.set(coordinates[0], coordinates[1], 0);
    return group;
  };

  /**
   * 创建模型表面的一个光点
   */

  const createPointMesh = () => {
    //创建一个几何体
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false, //禁止写入深度缓冲区数据
      map: texture.load("/threejs/map/gb.png"),
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.name = "GD";

    // 缩放
    const scale = 0.3;
    plane.scale.set(scale, scale, scale);

    return plane;
  };

  //创建光圈
  function createLightHalo() {
    //创建一个几何体
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,
      depthWrite: false, //禁止写入深度缓冲区数据
      map: texture.load("/threejs/map/gq.png"),
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.name = "GQ";

    // 缩放光圈，做动画
    const scale = 0.3;
    plane.scale.set(scale, scale, scale);

    // 延迟动画的时间
    const delay = random(0, 1000);
    const tween_1 = new TWEEN.Tween({ scale: scale, opacity: 0 })
      .to({ scale: scale * 0.15, opacity: 1 }, 1000)
      .delay(delay)
      .onUpdate((params) => {
        let { scale, opacity } = params;
        plane.scale.set(scale, scale, scale);
        plane.material.opacity = opacity;
      });

    const tween_2 = new TWEEN.Tween({ scale: scale * 1.5, opacity: 1 })
      .to({ scale: scale * 2, opacity: 0 }, 1000)
      .onUpdate((params) => {
        let { scale, opacity } = params;
        plane.scale.set(scale, scale, scale);
        plane.material.opacity = opacity;
      });

    //使 tweenB 在 tweenA 完成后开始:tweenA.chain(tweenB)
    //创造一个无限的链式，tweenA 完成时开始 tweenB，tweenB 完成时开始 tweenA：tweenA.chain(tweenB),tweenB.chain(tweenA)
    tween_1.chain(tween_2);
    tween_2.chain(tween_1);

    //启动动画
    tween_1.start();

    //想要成功的完成动画效果，你需要在主函数中(循环渲染函数)调用 TWEEN.update()

    return Object.assign(plane, { tween_1, tween_2 });
  }

  return { createLightPillar };
};

export const tween = () => {
  TWEEN.update();
};
