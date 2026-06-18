/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2023-12-27 11:38:13
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2023-12-29 15:44:59
 */
import * as THREE from "three";

/**
 * 创建一个类来创建几何体
 */

// 创建球体
class SphGeo {
  R = 0;
  x = 0;
  y = 0;
  z = 0;

  constructor(R: number, x: number, y: number, z: number) {
    this.R = R;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  DrawSphereGeo() {
    // 创建几何体
    const geo = new THREE.SphereGeometry(this.R, 100, 100);

    // 规定几何体是什么材质
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 创建承载几何体的物体的类--网格
    const mesh = new THREE.Mesh(geo, material);

    // 集合体的位置
    mesh.position.set(this.x, this.y, this.z);

    // 返回一个物体的类
    return mesh;
  }
  createSphereMesh(imgURL: string) {
    // TextureLoader 创建一个纹理加载器  加载图片作为纹理贴图
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL(`${imgURL}`, import.meta.url).href
    ); //加载纹理贴图
    const geometry = new THREE.SphereGeometry(this.R, 100, 100); //创建一个球体集合对象
    const material = new THREE.MeshLambertMaterial({
      map: texture,
      //    transparent:true,
      color: 0xffffff,
    }); //网格材质
    const mesh = new THREE.Mesh(geometry, material); //网格模型对象
    mesh.position.set(this.x, this.y, this.z);

    return mesh;
  }
}

// 创建线框
class WireBorder {
  victorArr: number[];
  constructor(victorArr: number[]) {
    this.victorArr = victorArr;
  }
  drawBorder() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(this.victorArr); //Float32Array 类型数组代表的是平台字节顺序为 32 位的浮点数型数组
    const dot = new THREE.BufferAttribute(vertices, 3); //每三个数字作为一个元组
    geometry.setAttribute("position", dot); //设置点在空间中的位置（换句话说，利用x,y,z三维空间里面确定一个点）
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }); //确定点的材质和颜色
    const mesh = new THREE.LineLoop(geometry, material); //创建网格模型
    return mesh;
  }
}

// 多个轮廓线

export { SphGeo, WireBorder };
