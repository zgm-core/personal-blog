/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-03-04 15:29:03
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-03-05 09:27:15
 */

import pointInPolygon from "point-in-polygon";
// 利用传过来的这个区域边框的数据，生成一个矩形点阵，包含整个区域

export const getAllPoints = (plogin: number[][]) => {
  //目标：利用框线上的点结合第三方插件找出框线内的点阵坐标
  //循环数据，把传过来的数据经纬度分开，分别找出他们的最小最大值，然后得出点阵的取值范围
  const lonArr: number[] = []; //经度数组
  const latArr: number[] = []; //纬度数组
  plogin.forEach((item: number[]) => {
    lonArr.push(item[0]);
    latArr.push(item[1]);
  });

  // 将数组中的数据拿来排序，取出最大最小经纬度
  //将经纬度拿来排序，然后取出最大最小值
  const [lonMin, lonMax] = minMax(lonArr);
  const [latMin, latMax] = minMax(latArr);

  //定义点之间的间距
  const gap: number = 0.2;

  //计算出这个区域有多少行、列
  //计算出点阵的行列数
  const rows: number = Math.ceil((lonMax - lonMin) / gap);
  const columns: number = Math.ceil((latMax - latMin) / gap);

  //利用行数和列数计算出点阵全部点的经纬度
  const rectPointsArr: number[][] = []; //polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      rectPointsArr.push([lonMin + i * gap, latMin + j * gap]);
    }
  }

  //矩形点阵的所有点后，需要利用第三方插件把框线区域外面的点去除
  // 重新定义一个数组保存去除框线外后的所有矩形点
  let interiorPoint: number[][] = [];

  rectPointsArr.forEach((e: number[]) => {
    //判断当前这个点e在没在框线内部，没在的话就不保存
    if (pointInPolygon(e, plogin)) {
      // console.log("pointInPolygon(e, plogin)",pointInPolygon(e, plogin),e);
      interiorPoint.push(e);
    }
  });
  interiorPoint.filter((v) => {
    return v.length;
  });
  //   返回在框线内部的点和框线点
  return [...interiorPoint, ...plogin];
};

function minMax(params: number[]) {
  params.sort(computed);
  return [Math.floor(params[0]), Math.ceil(params[params.length - 1])];
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
