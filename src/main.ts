import { mat4 } from 'gl-matrix';

import {
  SILHOUETTE_VERTEX_SHADER,
  SILHOUETTE_FRAGMENT_SHADER,
} from './lib/shaders';

import Scene from './lib/Scene';
import Camera from './lib/Camera';
import RenderFrame from './lib/RenderFrame';
import Shader from './lib/Shader';
import Plane from './lib/Plane';

const plane = new Plane();

function initSilhouetterFrame(
  camera: Camera,
  gl: WebGLRenderingContext,
) {
  return new RenderFrame({
    gl,
    shader: new Shader({
      gl,
      vertexShader: SILHOUETTE_VERTEX_SHADER,
      fragmentShader: SILHOUETTE_FRAGMENT_SHADER,
      attributes: {
        aPlaneVertex: {
          locationName: 'a_PlaneVertex',
          data: plane.getVertices(),
          type: Shader.Types.VECTOR2,
        },
      },
      uniforms: {
        uViewMatrix: {
          locationName: 'u_ViewMatrix',
          data: camera.getLookAt(),
          type: Shader.Types.MATRIX4,
        },
        uViewInverseTranspose: {
          locationName: 'u_ViewInverseTranspose',
          data: mat4.transpose(
            mat4.create(),
            mat4.invert(mat4.create(), camera.getLookAt())),
          type: Shader.Types.MATRIX4,
        },
        uPerspectiveMatrix: {
          locationName: 'u_PerspectiveMatrix',
          data: camera.getPerspective(),
          type: Shader.Types.MATRIX4,
        },
        uTime: {
          locationName: 'u_Time',
          data: 0,
          type: Shader.Types.FLOAT,
        },
        uCameraPosition: {
          locationName: 'u_CameraPosition',
          data: camera.getPosition(),
          type: Shader.Types.VECTOR3,
        },
        uSilhouetteEpsilon: {
          locationName: 'u_SilhouetteEpsilon',
          data: .6,
          type: Shader.Types.FLOAT,
        },
        uTextureSampler: {
          locationName: 'u_TextureSampler',
          data: 0,
          type: Shader.Types.INTEGER,
        },
      },
    }),
    width: camera.getSceneWidth(),
    height: camera.getSceneHeight(),
    nVertices: plane.getVertices().length / 2,
  });
}

(function main() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const camera = new Camera({
    width: canvas.width,
    height: canvas.height,
  });

  const scene = new Scene(canvas);
  const image =
    <HTMLImageElement>document.getElementById('brush-texture');
  scene.setImageTexture('brush', image);
  scene.setRenderFrame(
    'silhouette', initSilhouetterFrame.bind(null, camera));

  scene.render(false, (firstRender: boolean) => {
    const silhouette = scene.getRenderFrame('silhouette');
    const brushTexture = scene.getImageTexture('brush');
    scene.gl.activeTexture(scene.gl.TEXTURE0);
    scene.gl.bindTexture(
      scene.gl.TEXTURE_2D, brushTexture);
    silhouette.render(firstRender);
  });
})();
