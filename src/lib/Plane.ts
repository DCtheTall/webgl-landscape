const MAX_PLANE_POSITION = 80;
const DEFAULT_RESOLUTION = 512;

const SIN_60_DEG = (3 ** .5) / 2;
const COS_60_DEG = .5;

export default class Plane {
  private vertices: number[];

  constructor() {
    const step = MAX_PLANE_POSITION / DEFAULT_RESOLUTION;
    const points = Array<number>(0);
    for (let x = -MAX_PLANE_POSITION; x < MAX_PLANE_POSITION; x += step * COS_60_DEG)
      for (let y = -MAX_PLANE_POSITION; y <= 0; y += step * SIN_60_DEG) {
        if (Math.round(x / step / COS_60_DEG) % 2) {
          points.push(x, -MAX_PLANE_POSITION - y);
          points.push(x + step, -MAX_PLANE_POSITION - y);
        } else {
          points.push(x, y);
          points.push(x + step, y);
        }
      }
    this.vertices = points;
  }

  public getVertices(): number[] {
    return this.vertices;
  }
}
