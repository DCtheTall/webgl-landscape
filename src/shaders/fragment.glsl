precision mediump float;

const vec3 LIGHT_POSITION = vec3(0., 20., -50.);
const vec3 LIGHT_COLOR = vec3(.7, .7, .4);
const vec3 AMBIENT_COLOR = vec3(.2, .2, .3);

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;

#pragma glslify: fragColor = require('./frag-color.glsl');

void main() {
  vec3 lightDirection = normalize(LIGHT_POSITION - v_PlaneVertex);
  float lambertian = clamp(dot(lightDirection, v_PlaneNormal), 0., 1.);
  vec3 lightColor = (lambertian * LIGHT_COLOR) + AMBIENT_COLOR;
  gl_FragColor = vec4(lightColor * fragColor(v_PlaneVertex, 20.), 1.);
}
