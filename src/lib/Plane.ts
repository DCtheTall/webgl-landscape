export class Plane {
  private resolution: number;
  private points: Float32Array;

  constructor() {
    this.points = new Float32Array([
      -1,  1,
      -1, -1,
       1,  1,
       1, -1,
    ]);
  }

  public setResolution(res: number) {
    this.resolution = res;
  }

  public getPlaneAsTriangleStrip(): Float32Array {
    return this.points;
  }

  // TODO procedurally generate plane of triangle strips
}
