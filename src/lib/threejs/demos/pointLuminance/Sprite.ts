// 给地球创建一个光圈效果

import * as THREE from "three";

export const createSprite = (R: number) => {
  // 精灵是一个总是面朝着摄像机的平面，通常含有使用一个半透明的纹理。
  const map = new THREE.TextureLoader().load(
    "/threejs/earthAperture.png"
  );
  const material = new THREE.SpriteMaterial({
    map: map, //设置精灵纹理贴图
    transparent: true, //开启透明
    // opacity: 0.5,//可以通过透明度整体调节光圈
  });
  // 创建表示地球光圈的精灵模型
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(R * 2.5, R * 2.5, 1); //适当缩放精灵
//   sprite.scale.set(R*4.0, R*4.0, 1);//光圈相比较地球偏大
  return sprite;
};
