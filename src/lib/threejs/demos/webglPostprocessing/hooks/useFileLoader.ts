import { useRef } from "react";
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-27 13:55:52
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-27 14:45:46
 */

import * as THREE from "three";

export const useFileLoader = () => {
  //创建一个保存进度的变量
  let progress = 0;
  const http = async (url: string) => {
    // console.log("传过来的url",url);
    
    try {
      // 创建一个文件加载器
      const loader = new THREE.FileLoader();
      //请求数据,.loadAsync ( url : String, onProgress : Function ) : Promise
      let data = await loader.loadAsync(url, (event: any) => {
        // console.log("process", event);
        let { total, loaded } = event;
        progress = Number(((loaded / total) * 100).toFixed(0));
      });

      // 将拿到的数据转换成json
      data = JSON.parse(data);
      return data;

    } catch (error) {
      throw new Error("远程数据文件请求出错" + error);
    }
  };

  return { http, progress };
};
