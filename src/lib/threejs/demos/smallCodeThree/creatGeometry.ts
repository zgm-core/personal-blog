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
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // 创建承载几何体的物体的类--网格
    const mesh = new THREE.Mesh(geo, material);

    // 集合体的位置
    mesh.position.set(this.x, this.y, this.z);

    // 返回一个物体的类
    return mesh;
  }
}

 

export { SphGeo };
