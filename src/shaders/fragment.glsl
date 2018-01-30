precision mediump float;

const vec3 LIGHT_POSITION = vec3(0., 20., -50.);
const vec3 DIFFUSE_LIGHT_COLOR = vec3(.65, .65, .5);
const vec3 AMBIENT_COLOR = vec3(.2, .2, .3);
const vec3 SPECULAR_COLOR = vec3(.8, .8, .5);

uniform vec3 u_CameraPosition;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;

#pragma glslify: fragColor = require('./frag-color.glsl');

void main() {
  vec3 lightDirection = normalize(LIGHT_POSITION - v_PlaneVertex);
  vec3 viewDirection = normalize(u_CameraPosition - v_PlaneVertex);
  vec3 halfwayVector = normalize(lightDirection + viewDirection);

  float lambertian = clamp(dot(lightDirection, v_PlaneNormal), 0., 1.);
  float specular = clamp(dot(halfwayVector, v_PlaneNormal), 0., 1.);
  specular = pow(specular, 40.);
  specular *= .4;

  vec3 lightColor = AMBIENT_COLOR;
  lightColor += (lambertian * DIFFUSE_LIGHT_COLOR);
  lightColor += (specular * SPECULAR_COLOR);

  gl_FragColor = vec4(lightColor * fragColor(v_PlaneVertex, v_PlaneNormal, 20.), 1.);
}
