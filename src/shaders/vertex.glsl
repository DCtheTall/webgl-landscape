precision mediump float;

attribute vec2 a_PlanePosition;

void main() {
  gl_Position = vec4(a_PlanePosition, -.01, 1.);
}
