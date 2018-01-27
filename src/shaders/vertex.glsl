precision mediump float;

attribute vec2 a_PlanePosition;

uniform mat4 u_ViewMatrix;
uniform mat4 u_PerspectiveMatrix;

void main() {
  vec4 worldPosition = vec4(a_PlanePosition.x, 0., a_PlanePosition.y, 1.);
  gl_Position = u_PerspectiveMatrix * u_ViewMatrix * worldPosition;
}
