precision highp float;

attribute vec2 a_PlaneVertex;

uniform mat4 u_ViewMatrix;
uniform mat4 u_PerspectiveMatrix;
uniform float u_Time;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;
varying float v_Time;

#pragma glslify: noise = require('../lib/octave-simplex.glsl');

void main() {
  float amp = 15.;
  vec2 dx = vec2(.01, 0.);
  vec2 dz = vec2(0., .01);
  vec3 vx = vec3(a_PlaneVertex.x + .1, amp * noise(a_PlaneVertex + dx, u_Time), a_PlaneVertex.y);
  vec3 vz = vec3(a_PlaneVertex.x, amp * noise(a_PlaneVertex + dz, u_Time), a_PlaneVertex.y + .1);
  v_PlaneVertex = vec3(a_PlaneVertex.x, amp * noise(a_PlaneVertex, u_Time), a_PlaneVertex.y);
  v_PlaneNormal = normalize(cross(normalize(vx - v_PlaneVertex), -1. * normalize(vz - v_PlaneVertex)));
  v_Time = u_Time;
  gl_Position = u_PerspectiveMatrix * u_ViewMatrix * vec4(v_PlaneVertex, 1.);
}
