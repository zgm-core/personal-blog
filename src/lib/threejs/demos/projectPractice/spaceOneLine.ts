import * as THREE from "three";

let index: number = 10; //点开始的位置
let num: number = 10; //从线上获取的点数
let points: any[] = [];
let points2: any[];
let geometry2 = new THREE.BufferGeometry();
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(100, 0, -100),
  new THREE.Vector3(0, 60, 0),
  new THREE.Vector3(-100, 0, 100),
]);
const group = new THREE.Group();

const color1 = new THREE.Color(0x006666); //轨迹线颜色 青色
const color2 = new THREE.Color(0xffff00); //黄色

export const oneLine = () => {
  points = curve.getPoints(200);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x006666 });
  const curveObject = new THREE.Line(geometry, material);
  group.add(curveObject);
  // 飞线中的一小段，取出组成这条线段的一小部分点进行绘制一条不同颜色的线。points是组成整条线的点
  //   console.log("points", points);
  points2 = points.slice(index, num + index);
  //利用points2上的点画出一断曲线
  const curve1 = new THREE.CatmullRomCurve3(points2);
  //从曲线curve1上取出10个点
  let newPoints2 = curve1.getSpacedPoints(100);
  //利用这一百个点画出一条曲线
  geometry2.setFromPoints(newPoints2);

  //直接创建的点材质点全部是5.0大小，这样不美观，我们想要他从一头到另一头逐渐变小，成蝌蚪状。
  const percentArr = [];
  for (let i = 0; i < newPoints2.length; i++) {
    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    percentArr.push(i / newPoints2.length);
  }

  //   console.log("999",  geometry2.attributes);
  //   这一段是给 geometry2的attributes属性添加一个percent的百分比属性，再配合下面的着色器代码修改就能让点呈现从大到小的蝌蚪状
  geometry2.setAttribute(
    "percent",
    new THREE.BufferAttribute(new Float32Array(percentArr), 1)
  );

  //这一段是给 geometry2的attributes属性添加一个color数组的属性，再配合下面的着色器代码修改就能让点呈现从大到小的蝌蚪状

  //---------蝌蚪在不同断会会显示不同颜色------------------
  //   let posNum: number = points2.length - 2; //分界点黄色，两端和轨迹线一个颜色青色
  //   let colorArr = [];
  //   for (let j = 0; j < points2.length; j++) {
  //     let color = null;
  //     //飞线段里面颜色设置为黄色，两侧设置为青色，也就是说中间某个位置向两侧颜色渐变

  //     if (j < posNum) {
  //       color = color1.lerp(color2, j / posNum);
  //     } else {
  //       color = color2.lerp(color1, (j - posNum) / (points2.length - posNum));
  //     }
  //     colorArr.push(color.r, color.g, color.b);
  //   }
  //---------蝌蚪在不同断会会显示不同颜色------------------

  //---------给蝌蚪设置不同颜色------------
  let colorArr: any[] = [];
  for (let j = 0; j < newPoints2.length; j++) {
    const color = color1.lerp(color2, j / newPoints2.length);
    colorArr.push(color.r, color.g, color.b);
  }
  //---------给蝌蚪设置不同颜色------------

  // 设置几何体顶点颜色数据
  //这一段是给 geometry2的attributes属性添加一个color数组的属性，再配合下面的着色器代码修改就能让点呈现从大到小的蝌蚪状
  geometry2.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colorArr), 3) //3:r,g,b
  );

  //创建飞线材质
  const pointsMaterial = new THREE.PointsMaterial({
    // color: 0xffff00,
    vertexColors: true, //使用顶点颜色，不用设置color
    size: 5.0,
  });

  // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
  pointsMaterial.onBeforeCompile = function (shader: any) {
    // 顶点着色器中声明一个attribute变量:百分比
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      [
        "attribute float percent;", //顶点大小百分比变量，控制点渲染大小
        "void main() {",
      ].join("\n") // .join()把数组元素合成字符串
    );
    // 调整点渲染大小计算方式
    shader.vertexShader = shader.vertexShader.replace(
      "gl_PointSize = size;",
      ["gl_PointSize = percent * size;"].join("\n") // .join()把数组元素合成字符串
    );
  };

  //创建点模型
  const flyPoints = new THREE.Points(geometry2, pointsMaterial);
  group.add(flyPoints);

  return group;
};

function moveLine() {
  if (points.length) {
    //线判断一手
    if (index > points.length - num) index = 10;
    index += 1;
    //循环改变数组points2
    points2 = points.slice(index, index + num); //从曲线上获取一段

    // 至少需要2个点才能构建曲线，防止NaN
    if (points2.length < 2) return;

    // 这样的点就10个点放大一看其实会发现点和点之间有间隙，所以我们从这10个点组成的线上再取
    //点太少停下来放大看会有间隙，我们可以取很多个点画点这样就点挨着点就不容易看出来了
    //思路：利用point2中的点生成一条曲线，再从曲线上去除n个点，去画，这样就可以达到目的了
    const curve = new THREE.CatmullRomCurve3(points2);
    const newPoints2 = curve.getSpacedPoints(100); //获取更多的点数
    geometry2.setFromPoints(newPoints2);
  }
}

export { moveLine };
