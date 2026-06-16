/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-26 16:05:41
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-29 10:35:34
 */

import * as THREE from "three";

export const getCountryGdpColor = (gdp: any) => {
  const countryGdpColor:any = new Object();
    // GDP最高对应红色，GDP最低对应白色
    const color1 = new THREE.Color(0x00ffcc);
    const color2 = new THREE.Color(0xccff00);//最大数值对应柱子颜色
    const maxval=18219297584000//设置一个基准值,以最高的美国gdp为准
  //循环取出指定年限的gdp,gdp是所有国家的数据
  gdp.Root.data.record.forEach((obj: any) => {
  
    if (obj["field"][2]['text'] == 2018) {
        // console.log("嘎嘎嘎", obj); 
      const name: string = obj["field"][0]["text"];
      const gdp: number = obj["field"][3]["text"];
      if (gdp) {
        countryGdpColor[`${name}`]={
                    // 颜色插值计算
        // var color = color1.clone().lerp(color2.clone(), gdp / gdpMax);
        // 国家gdp差距太大，可以使用平方根比值进行颜色插值
            color:color1.clone().lerp(color2.clone(),Math.sqrt(gdp / maxval)),//.lerp ( color : Color, alpha : Float ) color - 用于收敛的颜色,alpha - 介于0到1的数字。
            gdp:gdp
        }
      }
    }
  });

  return countryGdpColor
};
