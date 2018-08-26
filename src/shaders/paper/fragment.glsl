precision mediump float;

const mat3 GAUSSIAN_KERNEL = mat3(
  .0625, .125, .0625,
   .125,  .25,  .125,
  .0625, .125, .0625
);

uniform vec2 u_Resolution;
uniform sampler2D u_LandscapeSampler;
uniform sampler2D u_PaperTextureSampler;

varying vec2 v_TextureCoord;

vec4 disperseInk() {
  vec2 texStep = vec2(1.) / u_Resolution;
  vec3 color = vec3(0.);
  float k = 2.;
  float alpha = 1.25;
  for (int x = -1; x < 2; x++) {
    for (int y = -1; y < 2; y++) {
      vec2 ds = k * vec2(x, y) * texStep;
      color += GAUSSIAN_KERNEL[x + 1][y + 1] * texture2D(
        u_LandscapeSampler,
        v_TextureCoord + ds
      ).xyz;
    }
  }
  color.x = pow(color.x, alpha);
  color.y = pow(color.y, alpha);
  color.z = pow(color.z, alpha);
  return vec4(color, 1.);
}

void main() {
  vec4 paintingColor = texture2D(u_LandscapeSampler, v_TextureCoord);
  vec4 dispersedColor = disperseInk();
  vec4 paperColor = texture2D(u_PaperTextureSampler, v_TextureCoord);
  gl_FragColor = paintingColor * dispersedColor * paperColor;
}
