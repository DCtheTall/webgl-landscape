precision highp float;

varying vec2 v_TextureCoord;

uniform sampler2D u_TextureSampler0;
uniform sampler2D u_TextureSampler1;
uniform vec2 u_Resolution;

#pragma glslify: sobelFilter = require(glsl-canny-edge-detection/lib/intensity-gradient);

void main() {
  float grad = length(sobelFilter(
    u_TextureSampler0, v_TextureCoord, u_Resolution));
  vec3 color = texture2D(u_TextureSampler1, v_TextureCoord).xyz;
  color -= .25 * vec3(pow(grad, 1.5));
  gl_FragColor = vec4(color, 1.);
}
