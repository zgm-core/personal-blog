/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2023-12-27 09:30:21
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2023-12-27 11:37:21
 */
interface xyz {
  x: number;
  y: number;
  z: number;
}
/**
 *
 * @param R 球体半径
 * @param longitude 经度
 * @param latitude 纬度
 * @returns 返回转换后的经纬度
 */
function lon2xyz(R: number, longitude: number, latitude: number): xyz {
  // 接触过高中数学的我们都知道球体上坐标点的计算。我们通常拿到的经纬度都为度值（如：东经120°，北纬45°）
  // 要通过度值和球体的半径通过三角函数计算出点在球体上的坐标如下：
  // 1. x=R*cos∂;y=R*sin∂
  let lon = (longitude * Math.PI) / 180; //转弧度值
  const lat = (latitude * Math.PI) / 180; //转弧度值
  lon = -lon; // three.js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);
  // 返回球面坐标
  return {
    x: x,
    y: y,
    z: z,
  };
}

export { lon2xyz };
