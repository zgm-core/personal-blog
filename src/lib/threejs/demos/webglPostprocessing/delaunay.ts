import pointInPolygon from "point-in-polygon";
import Delaunator from "delaunator";
/**
 *
 * @param arrPoints 边界点和边界内部的点阵
 * @param boundaryPoint 边界点
 * @returns 返回符合三角刮分后所有三角形索引值
 */
export const triangulation = (
  arrPoints: number[][],
  boundaryPoint: number[]
) => {
    // console.log("看看参数",boundaryPoint);
    
  //.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
  const indexArr: number[] = Delaunator.from(arrPoints).triangles; //indexArr三角形的顶点索引值
    //  console.log("三角形的顶点索引值",indexArr);

  //定义一个数组接收满足要求的三角形索引
  const usefulIndexArr: number[] = []; //二次处理后三角形索引，也就是保留多边形polygon内部三角形对应的索引
  // 删除多边形polygon外面三角形，判断方法非常简单，判断一个三角形的质心是否在多边形轮廓内部
  for (let i = 0; i < indexArr.length; i += 3) {
    const p1: number[] = arrPoints[indexArr[i]];
    const p2: number[] = arrPoints[indexArr[i + 1]];
    const p3: number[] = arrPoints[indexArr[i + 2]];

    //判断三角形在框线外还是在框线内,办法：得到三角形内部的一个点，判断他是在框线外还是在框线内即可，这里我们以三角形的重心为例
    const coord: number[] = [
      (p1[0] + p2[0] + p3[0]) / 3,
      (p1[1] + p2[1] + p3[1]) / 3,
    ];
    // console.log("7878",pointInPolygon(coord, boundaryPoint));



    if (pointInPolygon(coord, boundaryPoint)) {
      //有一点需要注意，一个三角形索引逆时针和顺时针顺序对应three.js三角形法线方向相反，或者说Mesh正面、背面方向不同
      usefulIndexArr.push(indexArr[i + 2], indexArr[i + 1], indexArr[i]);
    }
 
    
  }

  return usefulIndexArr;
};
