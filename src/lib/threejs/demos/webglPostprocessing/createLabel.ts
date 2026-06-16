import * as THREE from "three";
import { useCSS2DRender } from "./hooks/useCSS2DRender";

const { create2DTag } = useCSS2DRender();
export const initLabel = (properties: any, scene: any) => {
  if (!properties.centroid && !properties.center) {
    return false;
  }
  // 设置标签的显示内容和位置
  var label = create2DTag("标签", "map-32-label");
  scene.add(label);
  let labelCenter = properties.center; //centroid || properties.center
  label.show(properties.name, new THREE.Vector3(...labelCenter, 0.31));
};
