precision highp float;

#pragma glslify: perlin = require('./noise/perlin', dotGridGradient=dotGridGradient);

attribute vec2 a_PlaneVertex;
attribute vec2 a_PlaneGradient;

uniform mat4 u_ViewMatrix;
uniform mat4 u_PerspectiveMatrix;

void main() {
  vec4 worldPosition = vec4(a_PlaneVertex.x, 0., a_PlaneVertex.y, 1.);
  gl_Position = u_PerspectiveMatrix * u_ViewMatrix * worldPosition;
}
