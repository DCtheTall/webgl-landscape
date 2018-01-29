#pragma glslify: perlin = require('glsl-noise/simplex/2d');

const int OCTAVES = 8;
const float PERSISTANCE = .5;

float octavePerlin(vec2 vertex) {
  float total = 0.;
  float frequency = 1.;
  float amplitude = 1.;
  float maxValue = 0.;
  for (int i = 0; i < OCTAVES; i++) {
    total += amplitude * perlin(frequency * vertex / 50.);
    maxValue += amplitude;
    amplitude *= PERSISTANCE;
    frequency *= 2.;
  }
  return total / maxValue;
}

#pragma glslify: export(octavePerlin);
