import { lon2xyz } from '../smallCodeThree/math';
import * as THREE from 'three';
import { createFlyLine } from './flyLine';

/**
 * 
 * @param lon1 起始点经度
 * @param lat1 起始点纬度
 * @param lon2 终点经度
 * @param lat2 终点纬度
 * @param R 球面半径
 */
export const flyArc=(lon1:number, lat1:number, lon2:number, lat2:number,R:number)=>{
//把起始点的经纬度坐标转换成球面坐标
const startPoint=lon2xyz(R,lon1,lat1)
const endSPoint=lon2xyz(R,lon2,lat2)
//轨迹起始点的三维向量坐标
const startSphereCoord=new THREE.Vector3(startPoint.x,startPoint.y,startPoint.z)
const endSphereCoord=new THREE.Vector3(endSPoint.x,endSPoint.y,endSPoint.z)

// 根据起始点算出在XOY平面关于Y轴对称的起始点，并计算出旋转的四元素。（相当于是在球面圆弧已经画好的前提下，把圆弧旋转到XOY平面，在旋转关于Y轴对称）
// XOY平面内关于Y轴对称的点可以算出他的弧度大小，可以给个层次感。
const startEndQua=_3Dto2D(startSphereCoord,endSphereCoord)

//下面所需要的操作就是：从startEndQua中取出在XOY平面关于Y轴对称的两个点，然后画出他们之间的弧线模型，最后把弧线模型旋转startEndQua中的四元素，就到球面上了
// 调用arcXOY函数绘制一条圆弧飞线轨迹
const arcline=arcXOY(startEndQua.startPoint, startEndQua.endPoint,R)

arcline.quaternion.multiply(startEndQua.quaternion)
// console.log("拿到没有哦",arcline);

return arcline;


}

 /**
  * 
  * @param startSphereCoord 球面上的起点三维坐标
  * @param endSphereCoord 球面上的终点三维坐标
  * @returns 返回球面起止点坐标旋转到XOY平面内关于Y轴对称的起止点和旋转所需要的四元素
  */
function _3Dto2D(startSphereCoord:any,endSphereCoord:any){
    
    //创建一个原点的三维坐标
    const origin=new THREE.Vector3(0,0,0)

    //计算出球面上的起止点和球心构成的三维向量
    const startDir=startSphereCoord.clone().sub(origin)
    const endtDir=endSphereCoord.clone().sub(origin)
     
    //利用起止点两条向量进行叉乘算出原点和起止点构成的三角形平面的法向量 .normalize () 把向量变成单位向量，方便后面的计算
    const normal=startDir.clone().cross(endtDir).normalize() 

    //设置XOY平面的法向量，说白了就是Z轴嘛。这样得到两个法向量，就可以算出从球面旋转到XOY平面的四元素
    const xoyNormal=new THREE.Vector3(0,0,1)

    /*计算第一次旋转的四元数*/
    //利用两个法向量算出从球面旋转到XOY平面的四元素
    const quaternion3D_XOY=new THREE.Quaternion().setFromUnitVectors(normal,xoyNormal)

    //利用旋转需要的四元素，计算出向量从三维空间旋转到XOY平面 。因为向量的起点是原点，所以三维向量的值其实就是起止点在XOY平面的点坐标
    const startSphereXOY=startSphereCoord.clone().applyQuaternion(quaternion3D_XOY)//applyQuaternion将四元素应用到该向量的意思
    const endSphereXOY=endSphereCoord.clone().applyQuaternion(quaternion3D_XOY)//applyQuaternion将四元素应用到该向量的意思
    
    /*计算第二次旋转的四元数*/
    // 向量的加法，箭头从第一加数向量的起点指向最末向量的终点
    // 向量的减法，箭头从减数向量的起点指向被减向量的终点。

    //middleV3：计算出startSphereXOY，endSphereXOY两个点连线的中点
    const middleV3=startSphereXOY.clone().add(endSphereXOY).multiplyScalar(0.5)//将原向量扩大多少倍

    //算出中点(middleV3)和原点(origin)构成的方向向量
    const midDir=middleV3.clone().sub(origin).normalize() 

    //要想把起止点旋转到关于Y轴对称，那么就需要中点（middleV3）在Y轴上，所以还需要旋转，midDir和Y轴之间的夹角
    const yDir=new THREE.Vector3(0,1,0)//设置Y轴坐标

    //计算从midDir到Y轴所需要的旋转四元素
    const quaternionXOY_Y=new THREE.Quaternion().setFromUnitVectors(midDir,yDir)

    //利用四元素算出起止点在XOY平面关于Y轴对撑的点
    const startSpherXOY_Y=startSphereXOY.clone().applyQuaternion(quaternionXOY_Y)
    const endSphereXOY_Y=endSphereXOY.clone().applyQuaternion(quaternionXOY_Y)

  /**一个四元数表示一个旋转过程
  *.invert()方法表示四元数的逆，简单说就是把旋转过程倒过来
  * 两次旋转的四元数执行.invert()求逆，然后执行.multiply()相乘
  *新版本.invert()对应旧版本.invert()
  */

  //quaternionInverse 表示从XOY平面旋转到球面上所需要的四元素
  const  quaternionInverse = quaternion3D_XOY.clone().invert().multiply(quaternionXOY_Y.clone().invert())
    return {
    // 返回两次旋转四元数的逆四元数
    quaternion: quaternionInverse,
    // 范围两次旋转后在XOY平面上关于y轴对称的圆弧起点和结束点坐标
    startPoint: startSpherXOY_Y,
    endPoint: endSphereXOY_Y,
    }
}

/**
 * 
 * @param startPoint XOY平面关于Y轴对称的起点
 * @param endPoint XOY平面关于Y轴对称的终点
 * @returns  返回弧线模型
 */
function arcXOY(startPoint:number, endPoint:number,R:number){

// 计算两个点的中点。.addVectors ( a : Vector3, b : Vector3 ) : this：将该向量设置为a + b。
const middleV3=new THREE.Vector3().addVectors(startPoint,endPoint).multiplyScalar(0.5)

//计算出圆心和中点middleV3的方向向量
const dir=middleV3.clone().sub(new THREE.Vector3(0,0,0)).normalize()


//计算出球面的起点、圆心、终点构成的夹角 就是向量OA和OB的夹角
const earthRadianAngle= radianAOB(startPoint, endPoint, new THREE.Vector3(0, 0, 0))

 /*设置飞线轨迹圆弧的中间点坐标
  弧度值 * R * 0.2：表示飞线轨迹圆弧顶部距离地球球面的距离
  起点、结束点相聚越远，构成的弧线顶部距离球面越高*/
  const arcTopCoord = dir.multiplyScalar(R + earthRadianAngle * R * 0.2)

  //求出三个点（startPoint，endPoint，arcTopCoord）的外接圆的圆心
  const flyArcCenter = threePointCenter(startPoint, endPoint, arcTopCoord)

  //算出外接圆的半径大小
  const  flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y);

  /*坐标原点和飞线起点构成直线和y轴负半轴夹角弧度值
  参数分别是：飞线圆弧起点、y轴负半轴上一点、飞线圆弧圆心*/
  const flyRadianAngle = radianAOB(startPoint, new THREE.Vector3(0, -1, 0), flyArcCenter);

//算出飞线的开始角度和结束角度
const startAngle= -Math.PI / 2 + flyRadianAngle;//飞线圆弧开始角度（因为两点关于Y轴对撑，所以起止点在一二象限）
const endAngle = Math.PI - startAngle;//飞线圆弧结束角度


// 调用函数生成飞线模型
const arcline = circleLine(flyArcCenter.x, flyArcCenter.y, flyArcR, startAngle, endAngle)
arcline.center = flyArcCenter;//飞线圆弧自定一个属性表示飞线圆弧的圆心  外接圆圆心
arcline.topCoord = arcTopCoord;//飞线圆弧自定一个属性表示飞线圆弧中间也就是顶部坐标

// const flyAngle = (endAngle - startAngle)/ 7; //飞线圆弧的弧度和轨迹线弧度相关
const flyAngle =0.32408463182013; //飞线圆弧的弧度和轨迹线弧度相关
// console.log("嘎嘎嘎",flyAngle);

 // 绘制一段飞线，圆心做坐标原点
const flyLine = createFlyLine(flyArcR, startAngle, startAngle + flyAngle);
flyLine.position.y = flyArcCenter.y;//平移飞线圆弧和飞线轨迹圆弧重合
//飞线段flyLine作为飞线轨迹arcLine子对象，继承飞线轨迹平移旋转等变换
arcline.add(flyLine);

//飞线段运动范围startAngle~flyEndAngle
flyLine.flyEndAngle = endAngle - startAngle - flyAngle;
flyLine.startAngle = startAngle;
// arcline.flyEndAngle：飞线段当前角度位置，这里设置了一个随机值用于演示
// flyLine.AngleZ = arcline.flyEndAngle * Math.random();
// flyLine.rotation.z = arcline.AngleZ;
// arcline.flyLine指向飞线段,便于设置动画是访问飞线段
arcline.flyLine = flyLine;

return arcline
}


/**
 * 
 * @param A 开始点
 * @param B 结束点
 * @param O 原点
 * @returns 返回向量OA和OB的夹角
 */
function radianAOB(A:any,B:any,O:any){

  //计算出OA、OB的单位向量
  const dir1=A.clone().sub(O).normalize()
  const dir2=B.clone().sub(O).normalize()

  //利用点成算出OA、OB夹角的余弦值
  const cosAOB=dir1.clone().dot(dir2)

  //利用反余弦算出AOB的值
  const AOB=Math.acos(Math.max(-1, Math.min(1, cosAOB)))

  return AOB
}

//求三个点的外接圆圆心，p1, p2, p3表示三个点的坐标Vector3。
function threePointCenter(p1:any, p2:any, p3:any) {
  var L1 = p1.lengthSq();//p1到坐标原点距离的平方
  var L2 = p2.lengthSq();
  var L3 = p3.lengthSq();
  var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;
  var S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
  // 当三点共线时 S=0，除法会得到 Infinity/NaN，此时使用中点作为降级方案
  if (Math.abs(S) < 1e-10) {
    var fallbackX = (x1 + x2 + x3) / 3;
    var fallbackY = (y1 + y2 + y3) / 3;
    return new THREE.Vector3(fallbackX, fallbackY, 0);
  }
  var x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2;
  var y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2;
  // 三点外接圆圆心坐标
  var center = new THREE.Vector3(x, y, 0);
  return center
}

/**
 * 
 * @param x 外接圆圆心x
 * @param y 外接圆圆心y
 * @param r 外接圆半径
 * @param startAngle 圆弧的开始角度    以弧度来表示，从正X轴算起曲线开始的角度
 * @param endAngle 圆弧的结束角度      以弧度来表示，从正X轴算起曲线终止的角度
 * @returns 返回一个线模型
 */
function circleLine(x:any, y:any, r:number, startAngle:any, endAngle:any){
  // 防止 NaN 值传入导致 BufferGeometry 报错
  if (isNaN(r) || isNaN(startAngle) || isNaN(endAngle) || isNaN(x) || isNaN(y)) {
    return new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x006666 })
    );
  }
  const geometry = new THREE.BufferGeometry(); //声明一个几何体对象BufferGeometry
  // THREE.ArcCurve创建圆弧曲线
  const arc = new THREE.ArcCurve(x, y, r, startAngle, endAngle, false);
  //getSpacedPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
  const points = arc.getSpacedPoints(50); //分段数50，返回51个顶点
  geometry.setFromPoints(points);// setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
  const material = new THREE.LineBasicMaterial({ color: 0x009999, });//线条材质
  const line = new THREE.Line(geometry, material);//线条模型对象
  return line;
}