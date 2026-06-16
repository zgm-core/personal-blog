import { random } from "../instance/toolFn";
import { useMapMarkedLightPillar } from "./hooks/useMapMarkedLightPillar";
const {createLightPillar}=useMapMarkedLightPillar()
// 创建光柱
export const initLightPoint = (properties: any, group: any) => {
  if (!properties.centroid && !properties.center) return;

  //光柱的高度
//   console.log("45", properties, group);
  const height=0.4 + random(1, 5) / 5
  //光柱到坐标点
  const position:number[]=properties.centroid ||properties.center;
  //生成光柱模型
const light=createLightPillar(position,height)
  //设置模型的z方向位置
  light.position.z=0.31
  //加载进组里面
  group.add(light)
};

 
