const vec3 BASE_GREEN = vec3(118., 130., 104.) / 255.;
const vec3 GREEN = vec3(138., 160., 124.) / 255.;
const vec3 GREY = vec3(167., 170., 160.) / 255.;
const vec3 LIGHT_GREY = vec3(178., 182., 187.) / 255.;
const vec3 LIGHTER_GREY = vec3(191., 195., 200.) / 255.;

#pragma glslify: simplex = require('glsl-noise/simplex/2d');

/*
Source: https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
*/
float rand(vec2 v){
    return fract(sin(dot(v, vec2(12.9898,78.233))) * 43758.5453);
}

vec3 fragColor(vec3 vertex, vec3 normal, float amp, float time) {
  vec2 dz = vec2(0., time);
  float y = vertex.y + (simplex(vertex.xz + dz) * vertex.y / 5.);

  if (y < -amp / 2. && dot(normal, vec3(0., 1., 0.)) > .3) return BASE_GREEN;
  if (y < -amp / 5. && dot(normal, vec3(0., 1., 0.)) > .3) return GREEN;
  if (y < 0. || dot(normal, vec3(0., 1., 0.)) < .3) return GREY;
  if (y < amp / 5.) return LIGHT_GREY;
  if (y < amp / 3.) return LIGHTER_GREY;
  return vec3(1.);
}


#pragma glslify: export(fragColor);