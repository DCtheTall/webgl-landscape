![alt text](/screenshot.png)
# WebGL Landscape

[Live Demo](https://dcthetall-webgl-landscape.herokuapp.com)

This project is a procedurally generated
landscape using WebGL. It uses fractal noise
created by superimposing Simplex noise
of increasing frequency and decreasing amplitude.

The fragments are colored in the shader using
some Perlin noise for variation.

It also added a little fog effect to emphasize
the illusion of depth.

---

## Back end
This app just runs a simple Go server which serves the
public directory as static files.

This project uses godep to manage server side dependencies.
To run the server, run `start.sh`.

## Front end
The client side source code is made up of TypeScript
and shader modules which are compiled with [glslify](https://www.npmjs.com/package/glslify)
and Webpack.

To build the front end, install node
modules and run Webpack.

