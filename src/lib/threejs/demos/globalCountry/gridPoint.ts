 
import  pointInPolygon  from 'point-in-polygon';
 
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-01-25 10:49:58
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-01-25 15:49:10
 */

export const getAllPoint = (polygon: number[]) => {
  //目标：利用框线上的点结合第三方插件找出框线内的点阵坐标
  //循环数据，把传过来的数据经纬度分开，分别找出他们的最小最大值，然后得出点阵的取值范围
  const lonArr: number[] = []; //经度数组
  const latArr: number[] = []; //纬度数组
  polygon.forEach((item: any) => {
    lonArr.push(item[0]);
    latArr.push(item[1]);
  });

  //将经纬度拿来排序，然后取出最大最小值
  const [lonMin, lonMax] = minMax(lonArr);
  const [latMin, latMax] = minMax(latArr);

  const gap: number = 1; //点阵点之间的间隔
  //计算出点阵的行列数
  const rows:number=Math.ceil((lonMax-lonMin)/gap)
  const columns:number=Math.ceil((latMax-latMin)/gap)

  //利用行数和列数计算出点阵全部点的经纬度
  const rectPointsArr:number[][] = [];//polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr
  for(let i=0;i<rows+1;i++){
    for(let j=0;j<columns+1;j++){
        rectPointsArr.push([lonMin+i*gap,latMin+j*gap])
    }
  }

  //得到点阵后要去除框线外部的点，我们利用第三方插件点是否在框线内来判断
  //定义一个数组接收框线内部的点
  const interiorPoint:number[][]=[]
//   console.log('666',polygon);
  rectPointsArr.forEach((item:number[])=>{
    if(pointInPolygon(item,polygon)){
        interiorPoint.push(item)
    }
  })

  return [...interiorPoint,...polygon]; //返回框线内的点和框线点
};

function minMax(arr: number[]) {
  arr.sort(computed);
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])];
}

function computed(num1: number, num2: number) {
  if (num1 < num2) {
    return -1;
  } else if (num1 > num2) {
    return 1;
  } else {
    return 0;
  }
}
