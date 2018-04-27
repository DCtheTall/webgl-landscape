import { vec2 } from 'gl-matrix';

const MAX_PLANE_POSITION = 100;
const DEFAULT_RESOLUTION = 500;

export enum VertexAlgorithms {
  Lines,
  TriangleStrip,
}

export class Plane {
  public vertices: Float32Array;

  constructor(algorithm: VertexAlgorithms = VertexAlgorithms.TriangleStrip) {
    const step = MAX_PLANE_POSITION / DEFAULT_RESOLUTION;
    const points = Array<number>(0);
    for (let x = -MAX_PLANE_POSITION; x < MAX_PLANE_POSITION; x += step)
      for (let y = -MAX_PLANE_POSITION; y <= 0; y += step) {
        if (Math.round(x / step) % 2) {
          points.push(x, -MAX_PLANE_POSITION - y);
          points.push(x + step, -MAX_PLANE_POSITION - y);
        } else {
          points.push(x, y);
          points.push(x + step, y);
        }
      }
    this.vertices = new Float32Array(points);
  }

  private generatePointsAsLines() { // fix me!

  }

  private generatePointsAsTriangeStrip() {

  }
}
