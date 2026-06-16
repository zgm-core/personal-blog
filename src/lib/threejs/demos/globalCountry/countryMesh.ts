import { lon2xyz } from '../smallCodeThree/math';
import * as THREE from 'three';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { triangulation } from "./delaunay";
import { getAllPoint } from "./gridPoint";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export const createCountryMesh = (R: number, data: [][][]) => {
  //   console.log(R,data);//data是个四位数组，我们最后只需保留二维
  const geometryArr:any=[]
  data.forEach((e: number[][]) => {
    // console.log(e);
    const polygon = e[0]; //获取多边形轮廓数据polygon,polygon是个二维数组
    //gridPoint(polygon):多边形轮廓polygon内填充等间距点
    //pointsArr表示polygon边界上顶点坐标和polygon内填充的顶点坐标
    const pointsArr: any = getAllPoint(polygon);
    // console.log("123",pointsArr);

    //但是光是得到框线内的点还不行，学了全面的知识我们就知道，要使得每个国家都是个单独的mesh,那么就要用到三角刮分发，
    //三角刮分法就是框线及框线内部的点都要用线连接成一个个的三角形，并且框线外部不能出现连线的三角形，所以我们要利用
    //第三方插件，三角刮分法把三角形连线在框线外部的点(框线内部的点)舍去
    const targetArr: number[] = triangulation(pointsArr, polygon); //有用的三角形的索引值

    // 将框线及框线内部的的点全部转换成球面坐标
    const spherePointsArr:number[] = [];//所有三角形球面坐标
    pointsArr.forEach((item:number[]) => {
        const coord=lon2xyz(R*1.001,item[0],item[1])
        spherePointsArr.push(coord.x,coord.y,coord.z)
    });

    //创建几何体
    const geometry=new THREE.BufferGeometry()

    //设置几何体的顶点索引
    geometry.index=new THREE.BufferAttribute(new Uint16Array(targetArr),1)

    //设置几何顶点位置坐标
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(spherePointsArr), 3 ) );
    
    geometryArr.push(geometry)//一个国家的轮廓不管他是一个还是多个geo组成，都把他放在一个数组中统一处理，最后一次性渲染
  });

  //合并几何体
  let newGeometry:any
  if(geometryArr.length==1){
    //说明该国家由一个轮廓组成
    newGeometry = geometryArr[0];//如果一个国家只有一个多边形轮廓，不用进行几何体合并操作
  }else{
    // 走这里的说明一个国家有多个轮廓，比如说中国，那么我们就把所有的轮廓合并在一起，提高性能
    newGeometry=BufferGeometryUtils.mergeGeometries(geometryArr)
  }

  newGeometry.computeVertexNormals ();//如果使用受光照影响材质，需要计算生成法线
  //规定几何体的材质
  const material=new THREE.MeshLambertMaterial({
     color:0x002222,
     side: THREE.DoubleSide
  })

  //创建网格模型
  const mesh=new THREE.Mesh(newGeometry,material)

  return mesh//mesh是一个国家全部轮廓
};
