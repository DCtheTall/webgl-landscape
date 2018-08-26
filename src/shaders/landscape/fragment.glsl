precision mediump float;

uniform float u_SilhouetteEpsilon;
uniform vec3 u_CameraPosition;
uniform vec3 u_LightPosition;
uniform vec4 u_FogColor;
uniform mat4 u_ViewInverseTranspose;
uniform sampler2D u_BrushTextureSampler;
uniform sampler2D u_ShadingTextureSampler;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;
varying mat4 v_ViewMatrix;

#pragma glslify: interpolateFog = require(../lib/fog.glsl);

vec3 applyBrushTexture() {
  vec3 viewDir = normalize(vec4(u_CameraPosition - v_PlaneVertex, 1.).xyz);
  vec3 transformedNormal = (u_ViewInverseTranspose * vec4(v_PlaneNormal, 1.)).xyz;
  vec3 refl = (2. * dot(transformedNormal, viewDir) * transformedNormal) - viewDir;
  float m = 2. * pow((pow(refl.x, 2.) + pow(refl.y, 2.) + pow(refl.z + 1., 2.)), .5);
  vec2 texCoord = (refl.xy / m) + vec2(.5);
  vec3 texColor = vec3(1.) - texture2D(u_BrushTextureSampler, texCoord).xyz;
  return texColor;
}

vec3 applyInteriorShading(vec3 brushTextureColor) {
  vec3 lightDirection = normalize(u_LightPosition - v_PlaneVertex);
  float lambertian = 2. * clamp(dot(lightDirection, v_PlaneNormal), 0.1, .5);
  vec2 texCoord = vec2(
    clamp(
      lambertian * (
        .3 * brushTextureColor.x
        + .59 * brushTextureColor.y
        + .11 * brushTextureColor.z
      ),
      0.,
      1.
    ),
    .5
  );
  return texture2D(u_ShadingTextureSampler, texCoord).xyz;
}

void main() {
  vec3 brushTextureColor = applyBrushTexture();
  vec3 shadingColor = applyInteriorShading(brushTextureColor);
  vec3 pixelColor = brushTextureColor * shadingColor;
  vec4 colorAfterFog = interpolateFog(
    u_CameraPosition,
    v_PlaneVertex,
    u_FogColor,
    vec4(pixelColor, 1.)
  );
  gl_FragColor = colorAfterFog;
}
