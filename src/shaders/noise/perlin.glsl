/*
Computes the dot product of a points position relative to a grid
point and to a randomly generated gradient map
*/
float dotGridGradient(vec2 gradient, int ix, int iy, vec2 vertex) {
  float dx = vertex.x - float(ix);
  float dy = vertex.y - float(iy);
  return dot(vec2(dx, dy), gradient);
}

/*
GLSL implementation of Perlin noise
source: https://en.wikipedia.org/wiki/Perlin_noise
*/
float perlin(vec2 vertex, vec2 gradient) {
  int x0 = int(floor(vertex.x));
  int x1 = x0 + 1;
  int y0 = int(floor(vertex.y));
  int y1 = y0 + 1;
  vec2 s = fract(vertex);
  float n0, n1, ix0, ix1;

  n0 = dotGridGradient(gradient, x0, y0, vertex);
  n1 = dotGridGradient(gradient, x1, y0, vertex);
  ix0 = smoothstep(n0, n1, s.x);
  n0 = dotGridGradient(gradient, x0, y1, vertex);
  n1 = dotGridGradient(gradient, x1, y1, vertex);
  ix1 = smoothstep(n0, n1, s.x);

  return smoothstep(ix0, ix1, s.y);
}

#pragma glslify: export(perlin);
