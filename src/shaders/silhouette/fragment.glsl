precision mediump float;

uniform vec3 u_CameraPosition;
uniform float u_SilhouetteEpsilon;

varying vec3 v_PlaneVertex;
varying vec3 v_PlaneNormal;

void main() {
  vec3 viewDirection = normalize(u_CameraPosition - v_PlaneVertex);
  float innerProd = dot(v_PlaneNormal, viewDirection);
  if (0. <= innerProd && innerProd <= u_SilhouetteEpsilon) {
    gl_FragColor = vec4(vec3(0.), 1.);
  } else {
    gl_FragColor = vec4(1.);
  }
}
