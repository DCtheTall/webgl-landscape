const MAX_PLANE_POSITION = 1e3;
const DEFAULT_RESOLUTION = 1e3;

enum PlaneResolution {
  low = 1e3,
  medium = 1e4,
  high = 1e6,
}

export class Plane {
  private resolution: number;
  private points: Float32Array;

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
    this.points = new Float32Array(points);
  }

  public setResolution(res: 'low' | 'medium' | 'high') {
    this.resolution = PlaneResolution[res];
    this.generatePoints();
  }

  public getPlaneAsTriangleStrip(): Float32Array {
    return this.points;
  }

  // TODO procedurally generate plane of triangle strips
}
