//解析点数据

import * as THREE from "three";
import { flyArc } from "./arc";
import { createPointMesh } from "./pointMesh";
import { createPyramid } from "./pyramid";
import { createWaveMesh } from "./WaveMesh";

//创建一个组,装所有的线模型，后面一次性渲染
const group = new THREE.Group();

//创建文件加载器
const loader = new THREE.FileLoader();
//设置解析的数据类型
loader.setResponseType("json");
//创建一个数组装所有的线模型，用来创建飞线段
const flyLineArr:any[]=[]
const waveMeshArr:any[]=[]//装光圈模型

export const getPointArc = (R:number) => {
  loader.load("/threejs/instance/pointDatas.json", (data: any) => {
    // console.log("data", data);

     for (let i = 0; i < data['endArr'].length; i++) {
        //起始点生成线模型
        const lineMesh=flyArc(data['start']["N"],data['start']["E"],data['endArr'][i]["N"],data['endArr'][i]["E"],R)
        group.add(lineMesh)
        flyLineArr.push(lineMesh)

        //光标
        const gb=createPointMesh(R,data['endArr'][i]["N"],data['endArr'][i]["E"])
        group.add(gb)

        //光圈
       const gq=createWaveMesh(R,data['endArr'][i]["N"],data['endArr'][i]["E"])
       group.add(gq)
       waveMeshArr.push(gq)
     }

    //  添加棱锥
    const LZ=createPyramid(R,data['start']["N"],data['start']["E"])
    group.add(LZ)
  });

  return group
};

function allLineMove(){

    // // 批量设置所有飞线的运动动画
    flyLineArr?.forEach((fly:any) => {
      fly.flyLine.rotation.z += 0.02; //调节飞线速度
      if (  fly.flyLine.rotation.z >= fly.flyLine.flyEndAngle)   fly.flyLine.rotation.z = fly.flyLine.startAngle;
    });
}


function waveGQ(){
  if (waveMeshArr?.length) {
    waveMeshArr?.forEach(function (mesh:any) {
      mesh._s += 0.007;
      mesh.scale.set(mesh.size*mesh._s,mesh.size*mesh._s,mesh.size*mesh._s);
      if (mesh._s <= 1.5) {
        mesh.material.opacity = (mesh._s-1) * 2;//2等于1/(1.5-1.0)，保证透明度在0~1之间变化
      } else if (mesh._s > 1.5 && mesh._s <= 2) {
        mesh.material.opacity =  1 - (mesh._s - 1.5)*2;//2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
      } else {
        mesh._s = 1.0;
      }
    })
  }
}

export {allLineMove,waveGQ}
