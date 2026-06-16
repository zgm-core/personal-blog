import * as THREE from "three";

export const createBall=(radius:number,widthSegments:number,heightSegments:number)=>{
    // console.log("创建球");
    
    const geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
    const material = new THREE.MeshLambertMaterial( { color: 0x000909 } );//0x000909黑色球体
    const sphere = new THREE.Mesh( geometry, material );

    return sphere
}