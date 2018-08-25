import { vec4, vec3 } from 'gl-matrix';

export const CLEAR_COLOR = vec4.fromValues(1, 1, 1, 1);
export const FRAME_RATE = 30;

export const CAMERA_UP = vec3.fromValues(0, 1, 0);
export const CAMERA_POSITION = vec3.fromValues(0, 15, 0);
export const CAMERA_LOOK_AT = vec3.fromValues(0, 10, -10);
