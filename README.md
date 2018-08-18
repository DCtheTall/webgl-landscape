![alt text](/screenshot.png)
# WebGL Landscape

[Live Demo](https://dcthetall-webgl-landscape.herokuapp.com)

This project is a procedurally generated
landscape using WebGL. It uses fractal noise
created by superimposing Simplex noise
of increasing frequency and decreasing amplitude.

The fragments are colored in the shader using
some Simplex noise for variation.

It also added a little fog effect to emphasize
the illusion of depth.

A 3x3 Sobel filter is applied to the smooth-shaded
scene and then overlayed on top of a cel-shaded
render of the scene. This gives it a more dynamic,
graphic look.

---

## Back end
This app just runs a simple Go server which serves the
public directory as static files. It also logs incoming
requests using a small logging middleware I wrote.

To run the server, run `start.sh`.

## Front end
The client side source code is made up of TypeScript
and shader modules which are compiled with [glslify](https://www.npmjs.com/package/glslify)
and Webpack.

To build the front end, install node
modules and run Webpack.

