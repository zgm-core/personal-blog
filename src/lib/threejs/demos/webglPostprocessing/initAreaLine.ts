import * as THREE from "three";

export const initAreaBorder = (ploygon: number[][]) => {
  const vector3Arr: number[] = [];
  const geometry = new THREE.BufferGeometry();
  ploygon.forEach((v: number[]) => {
    vector3Arr.push(v[0], v[1], 0);
  });

  const vertices = new Float32Array(vector3Arr);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 3,
    linecap: "round", //ignored by WebGLRenderer
    linejoin: "round", //ignored by WebGLRenderer
  });

  const line = new THREE.Line(geometry, material);
  line.position.z=0.4
 

  return line;
};
