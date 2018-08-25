/*
Simple fog weight function
*/
float fog(vec3 eyePosition, vec3 vertex) {
  float distance = length(eyePosition - vertex);
  return clamp(pow(distance, 1.25) / 200., 0., 1.);
}

/*
Interpolate fog color and color for fog effect
*/
vec3 interpolateFog(
  vec3 eyePosition,
  vec3 vertex,
  vec3 fogColor,
  vec3 color
) {
  float fogWeight = fog(eyePosition, vertex);
  return ((1. - fogWeight) * color) + (fogWeight * fogColor);
}

#pragma glslify: export(interpolateFog);
