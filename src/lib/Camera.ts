import { vec3, mat4 } from 'gl-matrix';

const UP = vec3.fromValues(0, 1, 0);

export class Camera {
  private up: vec3 = UP;
  private position: vec3 = vec3.fromValues(0, 25, 10);
  private at: vec3 = vec3.fromValues(0, 24, -1);

  public getLookAt(): mat4 {
    return mat4.lookAt(
      mat4.create(),
      this.position,
      this.at,
      this.up
    );
  }

  public getPerspective(canvas: HTMLCanvasElement): mat4 {
    return mat4.perspective(
      mat4.create(),
      Math.atan(2 * (canvas.height / canvas.width)),
      canvas.width / canvas.height,
      0.01,
      1e6
    );
  }
}
