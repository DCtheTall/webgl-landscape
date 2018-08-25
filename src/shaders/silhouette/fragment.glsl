precision mediump float;

const vec3 FOG_COLOR = vec3(1., 1., 1.);

uniform vec3 u_CameraPosition;
uniform float u_SilhouetteEpsilon;
uniform sampler2D u_TextureSampler;
uniform mat4 u_ViewInverseTranspose;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;

#pragma glslify: interpolateFog = require(../lib/fog.glsl);

void main() {
  vec3 viewDirection = normalize(u_CameraPosition - v_PlaneVertex);
  vec3 transformedNormal = (u_ViewInverseTranspose * vec4(v_PlaneNormal, 1.)).xyz;
  vec3 refl = (2. * dot(transformedNormal, viewDirection) * transformedNormal) - viewDirection;
  float m = 2. * pow((pow(refl.x, 2.) + pow(refl.y, 2.) + pow(refl.z + 1., 2.)), .5);
  vec2 texCoord = (refl.xy / m) + vec2(.5);
  vec3 texColor = texture2D(u_TextureSampler, texCoord).xyz;
  vec3 colorAfterFog = interpolateFog(
    u_CameraPosition,
    v_PlaneVertex,
    FOG_COLOR,
    texColor
  );
  gl_FragColor = vec4(colorAfterFog, 1.);
}
