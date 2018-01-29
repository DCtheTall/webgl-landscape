import { vec2 } from 'gl-matrix';

const MAX_PLANE_POSITION = 100;
const DEFAULT_RESOLUTION = 1e3;

export class Plane {
  private resolution: number;
  private vertices: Float32Array;

  constructor() {
    this.resolution = DEFAULT_RESOLUTION;
    this.generatePointsAsTriangeStrip();
  }

  private generatePointsAsLines() { // fix me!
    const step = MAX_PLANE_POSITION / this.resolution;
    const points = Array<number>(0);
    for (let x = -MAX_PLANE_POSITION; x < MAX_PLANE_POSITION; x += step)
    for (let y = -MAX_PLANE_POSITION; y <= MAX_PLANE_POSITION; y += step) {
      points.push(x + step, y, x, y);
    }
    this.vertices = new Float32Array(points);
  }

  private generatePointsAsTriangeStrip() {
    const step = MAX_PLANE_POSITION / this.resolution;
    const points = Array<number>(0);

    for (let x = -MAX_PLANE_POSITION; x < MAX_PLANE_POSITION; x += step)
    for (let y = -MAX_PLANE_POSITION; y < MAX_PLANE_POSITION; y += step) {
      if (Math.round(x / step) % 2) {
        y *= -1;
        points.push(x, y);
        points.push(x + step, y);
        y *= -1;
      } else {
        points.push(x, y);
        points.push(x + step, y);
      }
    }
    this.vertices = new Float32Array(points);
  }

  public getVerticesAsLines(): Float32Array {
    return this.vertices;
  }

  public getVerticesAsTriangleStrip(): Float32Array {
    return this.vertices;
  }
}
