#pragma glslify: simplex = require('glsl-noise/simplex/2d');

const int OCTAVES = 8;
const float PERSISTANCE = .5;

float octaveSimplex(vec2 vertex) {
  float total = 0.;
  float frequency = 1.;
  float amplitude = 1.;
  float maxValue = 0.;
  for (int i = 0; i < OCTAVES; i++) {
    total += amplitude * simplex(frequency * vertex / 50.);
    maxValue += amplitude;
    amplitude *= PERSISTANCE;
    frequency *= 2.;
  }
  return total / maxValue;
}

#pragma glslify: export(octaveSimplex);
