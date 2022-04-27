![alt text](/screenshot.png)
# Sumi-e WebGL Landscape

This project is a procedurally generated
landscape using WebGL. It uses fractal noise
created by superimposing Simplex noise
of increasing frequency and decreasing amplitude.

The generated mountain range is then rendered using
a method developed to mimick the style of Japanese
Sumi-e paintings. The method is an implementation
of the model discussed in [this paper](http://www.myeglab.com/Content/sumi_e_painting.pdf).

It also added a little fog effect to emphasize
the illusion of depth.

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

