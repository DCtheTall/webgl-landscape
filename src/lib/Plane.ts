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
  private gradients: Float32Array;

  constructor() {
    this.resolution = DEFAULT_RESOLUTION;
    this.generatePoints();
    this.generateGradientsMap();
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

  private generateGradientsMap() {
    const step = MAX_PLANE_POSITION / this.resolution;
    const gradients = Array<number>(0);
    const cache = <NumberMap<NumberMap<vec2>>>{};
    const rand = () => ((2 * Math.random()) - 1);
    for (let x = -MAX_PLANE_POSITION; x < MAX_PLANE_POSITION; x += step) {
      const ix = Math.floor(x);
      if (!cache[ix]) cache[ix] = {};
      if (!cache[ix + 1]) cache[ix + 1] = {};
      for (let y = -MAX_PLANE_POSITION; y <= MAX_PLANE_POSITION; y += step) {
        const iy = Math.floor(y);
        if (!cache[ix][iy]) cache[ix][iy] = vec2.fromValues(rand(), rand());
        if (!cache[ix + 1][iy]) cache[ix + 1][iy] = vec2.fromValues(rand(), rand());
        gradients.push(cache[ix][iy][0], cache[ix][iy][1]);
        gradients.push(cache[ix + 1][iy][0], cache[ix + 1][iy][1]);
      }
    }
    this.gradients = new Float32Array(gradients);
  }

  public setResolution(res: 'low' | 'medium' | 'high') {
    this.resolution = PlaneResolutions[res];
    this.generatePoints();
    this.generateGradientsMap();
  }

  public getVerticesAsTriangleStrip(): Float32Array {
    return this.vertices;
  }

  public getGradientsForTriangleStrip(): Float32Array {
    return this.gradients;
  }
}
