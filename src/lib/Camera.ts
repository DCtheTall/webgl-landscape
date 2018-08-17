import { vec3, mat4 } from 'gl-matrix';

const UP = vec3.fromValues(0, 1, 0);
const POSITION = vec3.fromValues(0, 24, 10);
const LOOK_AT = vec3.fromValues(0, 10, -20);

interface CameraConstructorParams {
  width: number;
  height: number;
  at?: vec3;
  position?: vec3;
  up?: vec3;
}

export default class Camera {
  private aspect: number;
  private at: vec3;
  private position: vec3;
  private up: vec3;

  private height: number;
  private width: number;

  constructor({
    height,
    width,
    at = LOOK_AT,
    position = POSITION,
    up = UP,
  }: CameraConstructorParams) {
    this.height = height;
    this.width = width;
    this.aspect = width / height;
    this.at = at;
    this.position = position;
    this.up = up;
  }

  public getLookAt(): mat4 {
    return mat4.lookAt(
      mat4.create(),
      this.position,
      this.at,
      this.up
    );
  }

  public getPerspective(): mat4 {
    return mat4.perspective(
      mat4.create(),
      Math.atan(2 * this.aspect),
      this.aspect,
      0.1,
      1e6
    );
  }

  public getPosition(): vec3 {
    return this.position;
  }

  public getSceneHeight(): number {
    return this.height;
  }

  public getSceneWidth(): number {
    return this.width;
  }
}
