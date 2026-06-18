import { deepMerge } from "../../instance/toolFn";
import * as THREE from "three";
let textureLoader = new THREE.TextureLoader(); //纹理贴图加载器
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-03-01 17:24:06
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-01 17:59:26
 */
export const useSequenceFrameAnimate=()=>{

  /**
   * 创建序列帧动画
   * @param {*} opt
   * @returns
   */
  const createSequenceFrame = (opt:any) => {
    // 默认参数
    let options = deepMerge(
      {
        image: '',
        width: 200, // 显示的宽度
        height: 200, // 显示的高度
        frame: 60, //总共的帧数
        column: 10, // 序列图的列
        row: 6, // 序列图的行
        speed: 0.5, // 速度
      },
      opt
    );
    let geometry = new THREE.PlaneGeometry(options.width, options.height); //矩形平面
    let texture = textureLoader.load(options.image); // 加载图片
    texture.repeat.set(1 / options.column, 1 / options.row); // 从图像上截图第一帧,repeat:Vector2,决定纹理在表面的重复次数
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true, 
      
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: false, //是否对深度缓冲区有任何的影响
    });
    let mesh = new THREE.Mesh(geometry, material);

    let r = 0; // 当前行
    let c = 0; // 当前列
    let t = 0; // 时间
    const updateSequenceFrame = (time:any) => {
      t += options.speed;
      if (t > options.frame) t = 0;
      c = options.column - Math.floor(t % options.column) - 1;
      r = Math.floor((t / options.column) % options.row);
      texture.offset.x = c / options.column; // 动态更新纹理偏移 播放关键帧动画
      texture.offset.y = r / options.row; // 动态更新纹理偏移 播放关键帧动画
    };

    return Object.assign(mesh, { updateSequenceFrame });
  };

  return {
    createSequenceFrame,
  };
}