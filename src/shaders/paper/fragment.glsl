precision mediump float;

uniform vec2 u_Resolution;
uniform sampler2D u_LandscapeSampler;
uniform sampler2D u_PaperTextureSampler;

varying vec2 v_TextureCoord;

void main() {
  vec4 landscapeColor = texture2D(u_LandscapeSampler, v_TextureCoord);
  vec4 paperColor = texture2D(u_PaperTextureSampler, v_TextureCoord);
  gl_FragColor = landscapeColor * paperColor;
}
