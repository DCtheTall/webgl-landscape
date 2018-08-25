precision mediump float;

const vec3 FOG_COLOR = vec3(.75, .87, .9);

uniform vec3 u_CameraPosition;

uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLightColor;
uniform vec3 u_DiffuseLightColor;
uniform vec3 u_SpecularLightColor;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;
varying float v_Time;

#pragma glslify: fragColor = require('../../lib/frag-color.glsl');
#pragma glslify: fog = require('../../lib/fog.glsl');

void main() {
  vec3 lightDirection = normalize(u_LightPosition - v_PlaneVertex);
  vec3 viewDirection = normalize(u_CameraPosition - v_PlaneVertex);
  vec3 halfwayVector = normalize(lightDirection + viewDirection);

  float calculatedLambertian = clamp(dot(lightDirection, v_PlaneNormal), 0., 1.);
  float lambertian = 0.;
  float minDist = 1.;
  for (int i = 0; i < 10; i += 1) {
    float testValue = float(i) / 10.;
    float dist = abs(calculatedLambertian - testValue);
    if (dist < minDist) {
      lambertian = testValue;
    }
  }
  lambertian = pow(lambertian, .7);
  float specular = clamp(dot(halfwayVector, v_PlaneNormal), 0., 1.);
  specular = pow(specular, 100.);
  specular *= .4;

  vec3 lightColor = u_AmbientLightColor;
  lightColor += (lambertian * u_DiffuseLightColor);
  // lightColor += (specular * u_SpecularLightColor);

  vec3 color = lightColor * fragColor(v_PlaneVertex, v_PlaneNormal, 10., v_Time);

  float fogWeight = fog(u_CameraPosition, v_PlaneVertex);
  color = ((1. - fogWeight) * color) + (fogWeight * FOG_COLOR);

  gl_FragColor = vec4(color, 1.);
}
