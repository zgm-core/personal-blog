declare module 'three/examples/jsm/utils/BufferGeometryUtils' {
  import { BufferGeometry } from 'three'
  export function mergeGeometries(geometries: BufferGeometry[], useGroups?: boolean): BufferGeometry
}

declare module 'three/examples/jsm/renderers/CSS2DRenderer' {
  import { Object3D, Scene, Camera } from 'three'
  export class CSS2DObject extends Object3D {
    element: HTMLElement
    isCSS2DObject: boolean
    constructor(element?: HTMLElement)
  }
  export class CSS2DRenderer {
    domElement: HTMLElement
    setSize(width: number, height: number): void
    render(scene: Scene, camera: Camera): void
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher } from 'three'
  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement)
    enableDamping: boolean
    update(): void
    target: THREE.Vector3
  }
}
declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export * from 'three/examples/jsm/controls/OrbitControls'
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export class GLTFLoader {
    load(url: string, onLoad?: (gltf: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (error: Error) => void): void
  }
}

declare module 'three/examples/jsm/lines/Line2.js' {
  import { Mesh, BufferGeometry, Material } from 'three'
  export class Line2 extends Mesh {
    constructor(geometry: BufferGeometry, material: Material)
    computeLineDistances(): void
  }
}

declare module 'three/examples/jsm/lines/LineMaterial.js' {
  import { ShaderMaterial, ColorRepresentation } from 'three'
  export class LineMaterial extends ShaderMaterial {
    constructor(parameters?: {
      color?: ColorRepresentation
      linewidth?: number
      dashed?: boolean
      [key: string]: any
    })
  }
}

declare module 'three/examples/jsm/lines/LineGeometry.js' {
  import { BufferGeometry } from 'three'
  export class LineGeometry extends BufferGeometry {
    setPositions(array: number[] | Float32Array): this
  }
}

declare module 'point-in-polygon' {
  function inside(point: [number, number], polygon: [number, number][]): boolean
  export = inside
}
