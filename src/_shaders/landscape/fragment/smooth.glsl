precision mediump float;

uniform vec3 u_CameraPosition;

uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLightColor;
uniform vec3 u_DiffuseLightColor;
uniform vec3 u_SpecularLightColor;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;
varying float v_Time;

#pragma glslify: fog = require('../../lib/fog.glsl');

void main() {
  vec3 lightDirection = normalize(u_LightPosition - v_PlaneVertex);
  vec3 viewDirection = normalize(u_CameraPosition - v_PlaneVertex);
  vec3 halfwayVector = normalize(lightDirection + viewDirection);

  float lambertian = clamp(dot(lightDirection, v_PlaneNormal), 0., 1.);
  float specular = clamp(dot(halfwayVector, v_PlaneNormal), 0., 1.);
  lambertian = pow(lambertian, .5);
  specular = pow(specular, 100.);
  specular *= .4;

  vec3 lightColor = u_AmbientLightColor;
  lightColor += (lambertian * u_DiffuseLightColor);
  lightColor += (specular * u_SpecularLightColor);

  vec3 color = lightColor * vec3(1.);

  float fogWeight = fog(u_CameraPosition, v_PlaneVertex);
  color = ((1. - fogWeight) * color) + (fogWeight * FOG_COLOR);

  gl_FragColor = vec4(color, 1.);
}
