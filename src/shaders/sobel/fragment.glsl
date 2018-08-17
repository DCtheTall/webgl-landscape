precision highp float;

varying vec2 v_TextureCoord;

uniform sampler2D u_TextureSampler0;
uniform sampler2D u_TextureSampler1;
uniform vec2 u_Resolution;

#pragma glslify: cannyEdgeDetection = require(glsl-canny-edge-detection);
#pragma glslify: sobelFilter = require(glsl-canny-edge-detection/lib/intensity-gradient);

void main() {
  float grad = length(sobelFilter(
    u_TextureSampler0, v_TextureCoord, u_Resolution));
  vec3 color = texture2D(u_TextureSampler1, v_TextureCoord).xyz;
  float edge = cannyEdgeDetection(
    u_TextureSampler0, v_TextureCoord, u_Resolution, .2, .1);
  color -= (.4 * (1. - grad) * vec3(grad));
  color -= .15 * vec3(edge);
  gl_FragColor = vec4(color, 1.);
}