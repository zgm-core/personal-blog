/*
 * @Descripttion: your project
 * @version: 10.0
 * @Author: 冷水泡茶
 * @Date: 2023-102-29 105:210:42
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2023-12-29 16:01:03
 */

import { WireBorder } from "../instance/createGeo";

// 这相当于每个点的xyz坐标都有了，在空间里面画出来即可。所有只有一个轮廓
const arr: number[] = [
    30, 0, 30,  25, 0, 30,  20, 0, 15,20, 0, 15,-1.0, -1.0,  1.0,
    10.0, -10.0,  10.0,
    10.0,  10.0,  10.0,
    10.0,  10.0,  10.0,
   -10.0,  10.0,  10.0,
   -10.0, -10.0,  10.0
];

const wire= new WireBorder(arr)
const mesh=wire.drawBorder()

export{mesh} 