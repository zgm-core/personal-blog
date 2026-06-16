import { lon2xyz } from '../smallCodeThree/math';
/**
 * 在球面上创建一个四轮柱
 */

import * as THREE from "three";

export const FourPillar=(x:number=10,y:number=10,height:number=100,R:number,lon:number,lat:number,color:number)=>{
    const geometry = new THREE.BoxGeometry( x, y, height );
    geometry.translate(0,0,height/2)//把柱子的一端移动到原点
    const material = new THREE.MeshBasicMaterial( {color: color} );
    const cube = new THREE.Mesh( geometry, material );

    //把经纬度坐标转换成球面坐标，把柱子放到球面上去
    const coord=lon2xyz(R,lon,lat)
    cube.position.set(coord.x,coord.y,coord.z)
    //计算夹角。 mesh姿态设置
    // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)，.normalize：将该向量转换为单位向量
    const vector3=new THREE.Vector3(coord.x,coord.y,coord.z).normalize ()//可以理解为旋转后的方向
    // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    const meshNormal = new THREE.Vector3(0, 0, 1);//默认方向
      // 四元数属性.quaternion表示mesh的角度状态，四元数在three.js中用于表示 rotation （旋转）
    //.setFromUnitVectors();计算两个向量之间构成的四元数值，.setFromUnitVectors ( vFrom : Vector3, vTo : Vector3 ) 将该四元数设置为从方向向量 vFrom 旋转到方向向量 vTo 所需的旋转。
    cube.quaternion.setFromUnitVectors(meshNormal, vector3);//利用四元素计算旋转的夹角，并进行旋转修正
    return cube
}