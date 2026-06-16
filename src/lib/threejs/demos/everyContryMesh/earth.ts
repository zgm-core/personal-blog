import * as THREE from "three"
import { createPointMesh } from "./chinaMesh/gridePoint"
import { createOutline } from "./chinaMesh/planeMesh"
import { createTriangleMesh } from "./chinaMesh/triangleMesh"

const group=new THREE.Group()
export const makeUpMesh=()=>{
   //添加点和线模型
   group.add(createOutline())
   //添加点阵模型
   group.add(createPointMesh())
   
   //添加三角模型
   group.add(createTriangleMesh())


    return group
}

 
