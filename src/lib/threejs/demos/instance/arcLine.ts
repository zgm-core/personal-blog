/**
 * 画出弧线函数（共享模块）
 * 用于 3DFly, 3DOA, 3DOAMove, ballArcCurve, tadpoleOA
 */

import * as THREE from "three"
import R from "./config"
 /**
  * 
  * @param startPoint 开始点
  * @param endPoint   结束点
  * @returns  返回画好的弧线
  */
export  const arcXOY=(startPoint:any,endPoint:any):any=>{
    // console.log(startPoint,endPoint);

//1.利用开始点，结束点计算开始点和结束点的中间点
const middleV3 = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);

//计算出middleV3点连接圆心的单位向量
const dir=middleV3.clone().normalize()
//计算出AOB的夹角
const earthRadianAngle=  radianAOB(startPoint,endPoint,new THREE.Vector3(0,0,0))

//设置飞线轨迹中点坐标
const arcTopCoord=dir.clone().multiplyScalar(R.R+earthRadianAngle*R.R*0.2)

//利用三个点确定外接圆的圆心
const flyArcCenter=threePointCenter(startPoint, endPoint, arcTopCoord)

//根据坐标算出半径
const flyArcR=Math.abs(flyArcCenter.y-arcTopCoord.y)

//坐标原点和飞线起点构成直线和y轴负半轴夹角弧度值,参数分别是：飞线圆弧起点、y轴负半轴上一点、飞线圆弧圆心
const flyRadianAngle= radianAOB(startPoint,new THREE.Vector3(0,-1,0),flyArcCenter)

 const startAngle = -Math.PI / 2 + flyRadianAngle;//飞线圆弧开始角度
 const endAngle = Math.PI - startAngle;//飞线圆弧结束角度

 //调用圆弧线模型的绘制函数
//  console.log("看看参数",flyArcCenter.x, flyArcCenter.y, flyArcR, startAngle, endAngle);
 
 const arcline = Object.assign(
  circleLine(flyArcCenter.x, flyArcCenter.y, flyArcR, startAngle, endAngle),
  { center: flyArcCenter, topCoord: arcTopCoord }
 );
 // center: 飞线圆弧的圆心, topCoord: 飞线圆弧中间也就是顶部坐标
 return arcline
}

function radianAOB(startPoint:any,endPoint:any,center:any){
    //利用单位向量点成就可以得到余弦值
    const dir1=startPoint.clone().sub(center).normalize()//单位向量
    const dir2=endPoint.clone().sub(center).normalize()//单位向量

    const cosAngle=dir1.clone().dot(dir2)//余弦值
    const radianAngle=Math.acos(Math.max(-1, Math.min(1, cosAngle)))//算出角度值，钳位防止浮点误差

    return radianAngle
}

function threePointCenter(startPoint:any,endPoint:any,arcTopCoord:any){
    const L1 = startPoint.lengthSq();//startPoint到坐标原点距离的平方
    const L2 = endPoint.lengthSq();
    const L3 = arcTopCoord.lengthSq();
    const x1 = startPoint.x,y1 = startPoint.y,x2 = endPoint.x,y2 = endPoint.y,x3 = arcTopCoord.x,y3 = arcTopCoord.y;
    const S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
    // 防三点共线导致除以零产生NaN
    if (Math.abs(S) < 1e-10) {
        const fallbackX = (x1 + x2 + x3) / 3;
        const fallbackY = (y1 + y2 + y3) / 3;
        return new THREE.Vector3(fallbackX, fallbackY, 0);
    }
    const x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2;
    const y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2;
    // 三点外接圆圆心坐标
    const center = new THREE.Vector3(x, y, 0);
    return center
}

/*绘制一条圆弧曲线模型Line
5个参数含义：(圆心横坐标, 圆心纵坐标, 飞线圆弧轨迹半径, 开始角度, 结束角度)*/
function circleLine(x:any, y:any, r:any, startAngle:any, endAngle:any) {
    // 防止 NaN 值传入导致 BufferGeometry 报错
    if (isNaN(r) || isNaN(startAngle) || isNaN(endAngle) || isNaN(x) || isNaN(y)) {
        return new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0x00ffff })
        );
    }
    const geometry = new THREE.BufferGeometry(); //声明一个几何体对象BufferGeometry
    // THREE.ArcCurve创建圆弧曲线
    
    const arc = new THREE.ArcCurve(x, y, r, startAngle, endAngle, false);
    //getSpacedPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
    const points = arc.getSpacedPoints(50); //分段数50，返回51个顶点
    geometry.setFromPoints(points);// setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    const material = new THREE.LineBasicMaterial({color: 0x00ffff,});//线条材质
    const line = new THREE.Line(geometry, material);//线条模型对象
    return line;
  }
