precision highp float;

attribute vec2 a_PlaneVertex;

uniform mat4 u_ViewMatrix;
uniform mat4 u_PerspectiveMatrix;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;

#pragma glslify: perlin = require('glsl-noise/classic/2d');

void main() {
  vec2 dx = vec2(.01, 0.);
  vec2 dz = vec2(0., .01);
  vec3 vx = vec3(a_PlaneVertex.x + .01, perlin(a_PlaneVertex + dx), a_PlaneVertex.y);
  vec3 vz = vec3(a_PlaneVertex.x, perlin(a_PlaneVertex + dz), a_PlaneVertex.y + .01);

  v_PlaneVertex = vec3(a_PlaneVertex.x, perlin(a_PlaneVertex), a_PlaneVertex.y);
  v_PlaneNormal = normalize(cross(normalize(vx - v_PlaneVertex), -1. * normalize(vz - v_PlaneVertex)));
  gl_Position = u_PerspectiveMatrix * u_ViewMatrix * vec4(v_PlaneVertex, 1.);
}
