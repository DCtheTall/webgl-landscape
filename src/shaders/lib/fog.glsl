/*
Simple fog weight function
*/
float fog(vec3 eyePosition, vec3 vertex) {
  float distance = length(eyePosition - vertex);
  return clamp(pow(distance, 1.25) / 200., 0., 1.);
}

#pragma glslify: export(fog);
