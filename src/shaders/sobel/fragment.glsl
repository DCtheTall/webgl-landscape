precision highp float;

varying vec2 v_TextureCoord;

uniform sampler2D u_TextureSampler;
uniform vec2 u_Resolution;

#pragma glslify: cannyEdgeDetection = require(glsl-canny-edge-detection);
#pragma glslify: sobelFilter = require(glsl-canny-edge-detection/lib/intensity-gradient);

void main() {
  float grad = length(sobelFilter(
    u_TextureSampler, v_TextureCoord, u_Resolution));
  vec3 color = texture2D(u_TextureSampler, v_TextureCoord).xyz;
  color -= (.6 * (1. - grad) * vec3(grad));
  color -= .1 * vec3(cannyEdgeDetection(
    u_TextureSampler, v_TextureCoord, u_Resolution, .2, .1));
  gl_FragColor = vec4(color, 1.);
}
