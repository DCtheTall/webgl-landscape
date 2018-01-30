const float E = 2.718281828459;

float fog(vec3 eyePosition, vec3 vertex) {
  float distance = length(eyePosition - vertex);
  return clamp(pow(distance, 1.25) / 400., 0., 1.);
}

#pragma glslify: export(fog);
