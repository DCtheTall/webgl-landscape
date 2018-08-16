precision highp float;

varying vec2 v_TextureCoord;

uniform sampler2D u_TextureSampler;

void main() {
  gl_FragColor = texture2D(u_TextureSampler, v_TextureCoord);
}
