/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-22 14:56:18
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-22 14:59:42
 */

import { sendData } from "./earth";

 
function createAnimation() {
  if (sendData().length) {
    sendData().forEach((mesh: any) => {
        mesh._s += 0.007;
        mesh.scale.set(mesh.size*mesh._s,mesh.size*mesh._s,mesh.size*mesh._s);
        if (mesh._s <= 1.5) {
          mesh.material.opacity = (mesh._s-1) * 2;//2等于1/(1.5-1.0)，保证透明度在0~1之间变化
        } else if (mesh._s > 1.5 && mesh._s <= 2) {
          mesh.material.opacity =  1 - (mesh._s - 1.5)*2;//2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
        } else {
          mesh._s = 1.0;
        }
    });
  }
}

export { createAnimation };
