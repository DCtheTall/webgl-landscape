#pragma glslify: perlin = require('glsl-noise/simplex/2d');

const vec3 BASE_GREEN = vec3(118., 160., 104.) / 255.;
const vec3 GREEN = vec3(156., 193., 143.) / 255.;
const vec3 LIGHT_GREY = vec3(183., 187., 192.) / 255.;
const vec3 GREY = vec3(167., 170., 160.) / 255.;

/*
Source: https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
*/
float rand(vec2 v){
    return fract(sin(dot(v, vec2(12.9898,78.233))) * 43758.5453);
}

vec3 fragColor(vec3 vertex, float amp) {
  float y = vertex.y + (perlin(vertex.xz / 2.) * vertex.y / 3.);
  if (y < -amp / 2.) return BASE_GREEN;
  if (y < -amp / 5.) return GREEN;
  if (y < 0.) return LIGHT_GREY;
  if (y < amp / 5.) return GREY;
  return vec3(1.);
}


#pragma glslify: export(fragColor);
