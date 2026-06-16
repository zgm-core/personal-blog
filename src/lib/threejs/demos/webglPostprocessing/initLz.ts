import { random } from "../instance/toolFn";
import { useSequenceFrameAnimate } from "./hooks/useSequenceFrameAnimate";

const { createSequenceFrame } = useSequenceFrameAnimate();
let particleArr:any = [];
// 初始化粒子
export const initParticle = (scene: any, bound: any) => {
  // 获取中心点和中间地图大小
  let { center, size } = bound;
  // 构建范围，中间地图的2倍
  let minX = center.x - size.x;
  let maxX = center.x + size.x;
  let minY = center.y - size.y;
  let maxY = center.y + size.y;
  let minZ = -6;
  let maxZ = 6;


  for (let i = 0; i < 16; i++) {
    const particle = createSequenceFrame({
      image: "/threejs/map/lz.png",
      width: 180,
      height: 189,
      frame: 9,
      column: 9,
      row: 1,
      speed: 0.5,
    });
    let particleScale = random(5, 10) / 1000;
    particle.scale.set(particleScale, particleScale, particleScale);
    particle.rotation.x = Math.PI / 2;
    let x = random(minX, maxX);
    let y = random(minY, maxY);
    let z = random(minZ, maxZ);
    particle.position.set(x, y, z);
    particleArr.push(particle);
  }
  scene.add(...particleArr);
  return particleArr;
};

export const lzMove=()=>{
     // 粒子上升
     if (particleArr.length) {
        for (let i = 0; i < particleArr.length; i++) {
          particleArr[i].updateSequenceFrame();
          particleArr[i].position.z += 0.01;
          if (particleArr[i].position.z >= 6) {
            particleArr[i].position.z = -6;
          }
        }
      }
}
