/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-03-04 13:25:21
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-11 09:19:09
 */

import * as THREE from "three";
import { camera, scene } from "../instance/scene";

//鼠标单击射线拾取meshArr中的某个国家Mesh
let chooseMesh: any;

// 创建一个光纤投射器,光线投射Raycaster:这个类用于进行raycasting（光线投射）。 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
const raycaster = new THREE.Raycaster();
//创建一个二维的坐标系
const pointer = new THREE.Vector2(); //默认x=0,y=0

// 能用光线投射器方法的前提是，每个mesh模块都需要是单独的。也就是要通过三角剖分计算出来
export const chooseModelMesh = (event: any, group: any) => {
  //如果上次选中了国家mesh,把他恢复成以前的颜色
  if (chooseMesh) {
    if (chooseMesh.geometry.name == "countryLine") {
      // chooseMesh.position.z +=-0.2; // 增加高度
    } else {
      chooseMesh.position.z = 0; // 增加高度
      // 把上次选中的mesh设置为原来的颜色
      chooseMesh.material[0].color.set(0xb4eeea);
      chooseMesh.material[1].color.set(0x123024);
    }

    // console.log("999",label);
    // label.element.style.visibility='hidden'
  }

  //获取鼠标经过点的屏幕坐标
  const { clientX, clientY } = event;
  // 将屏幕坐标转换成WebGL设备坐标
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;

  //根据鼠标坐在的设备坐标位置和相机参数计算投射器
  raycaster.setFromCamera(pointer, camera);

  //计算物体和射线的焦点，返回.intersectObjects()参数中射线选中的网格模型对象
  //未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
  const intersects: any[] = raycaster.intersectObjects(scene.children,true);

  //判断涉嫌焦点有没有返回对象。
  // console.log("射线器返回的对象", intersects);
  // console.log("射线投射器返回的对象 点point", intersects[0].point);
  // console.log("射线投射器的对象 几何体",intersects[0].object.geometry.vertices)
  // intersects.length大于0说明，说明选中了模型
  if (intersects && intersects.length) {

// intersects.forEach((item:any)=>{
 
//   if(item.object._meshName&&item.object._meshName=="model"){
//     console.log("99",item);  
//   }
  
// })
 
    // console.log("456",intersects);
    const name = intersects[0].object.geometry.name;
    if (!(name == "model" || name == "countryLine")) return;
    chooseMesh = intersects[0].object;
    if (intersects[0].object.geometry.name == "countryLine") {
  
    
      // chooseMesh.position.z += 0.2;
    } else if (intersects[0].object.geometry.name == "model") {
      chooseMesh.material[0].color.set(0xff0000); //选中改变颜色
      // console.log("123", chooseMesh);
      chooseMesh = intersects[0].object;
      chooseMesh.position.z = 0.2;
    }

    // console.log("66",intersects[0]['point']);
    // label.position.copy(intersects[0]["point"]);

    // label.element.innerHTML=chooseMesh.name
    // //chooseMesh:就是一个国家的轮廓，在earth文件里面我们给他付了值
    // if (chooseMesh.gdp) {
    //   label.element.innerHTML =
    //     chooseMesh.name +
    //     "GDP：" +
    //     (chooseMesh.gdp / 1000000000000).toFixed(3) +
    //     "万亿美元";
    // } else {
    //   label.element.innerHTML =
    //     chooseMesh.name + ":" + "2019年" + "GDP缺失数据";
    // }
    // label.element.style.visibility = "visible";
  }

  // console.log("888", pointer);
};
