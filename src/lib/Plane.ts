import { vec2 } from 'gl-matrix';

const MAX_PLANE_POSITION = 100;
const DEFAULT_RESOLUTION = 1e3;

enum PlaneResolutions {
  low = 1e3,
  medium = 1e4,
  high = 1e6,
}

interface NumberMap<T>{
  [index: number]: T;
}

export class Plane {
  private resolution: number;
  private vertices: Float32Array;

  constructor() {
    this.resolution = DEFAULT_RESOLUTION;
    this.generatePoints();
  }

  private generatePoints() {
    const step = MAX_PLANE_POSITION / this.resolution;
    const points = Array<number>(0);
    for (let x = -MAX_PLANE_POSITION; x < MAX_PLANE_POSITION; x += step) {
      for (let y = -MAX_PLANE_POSITION; y <= MAX_PLANE_POSITION; y += step) {
        points.push(x, y);
        points.push(x + step, y);
      }
    }
    this.vertices = new Float32Array(points);
  }

  public setResolution(res: 'low' | 'medium' | 'high') {
    this.resolution = PlaneResolutions[res];
    this.generatePoints();
  }

  public getVerticesAsTriangleStrip(): Float32Array {
    return this.vertices;
  }
}
