import { mat4 } from 'gl-matrix';

import {
  LANDSCAPE_VERTEX_SHADER,
  LANDSCAPE_FRAGMENT_SHADER,
  PAPER_VERTEX_SHADER,
  PAPER_FRAGMENT_SHADER,
} from './lib/shaders';
import {
  CLEAR_COLOR,
  FULL_VIEW_PLANE_VERTICES,
  FULL_PLANE_VIEW_TEX_COORDS,
} from './lib/constants';

import Scene from './lib/Scene';
import Camera from './lib/Camera';
import RenderFrame from './lib/RenderFrame';
import Shader from './lib/Shader';
import Plane from './lib/Plane';

const plane = new Plane();

function initLandscapeFrame(
  camera: Camera,
  gl: WebGLRenderingContext,
): RenderFrame {
  return new RenderFrame({
    gl,
    width: camera.getSceneWidth(),
    height: camera.getSceneHeight(),
    nVertices: plane.getVertices().length / 2,
    useRenderBuffer: true,
    renderToTexture: true,
    shader: new Shader({
      gl,
      vertexShader: LANDSCAPE_VERTEX_SHADER,
      fragmentShader: LANDSCAPE_FRAGMENT_SHADER,
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
        uBrushTextureSampler: {
          locationName: 'u_BrushTextureSampler',
          data: 0,
          type: Shader.Types.INTEGER,
        },
        uShadingTextureSampler: {
          locationName: 'u_ShadingTextureSampler',
          data: 1,
          type: Shader.Types.INTEGER,
        },
        uLightPosition: {
          locationName: 'u_LightPosition',
          data: [0, 50, -20],
          type: Shader.Types.VECTOR3,
        },
        uFogColor: {
          locationName: 'u_FogColor',
          data: CLEAR_COLOR,
          type: Shader.Types.VECTOR4,
        },
      },
    }),
  });
}

function initPaperLayer(
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext,
) {
  return new RenderFrame({
    gl,
    width: canvas.width,
    height: canvas.height,
    nVertices: 4,
    clearBeforeRender: false,
    shader: new Shader({
      gl,
      vertexShader: PAPER_VERTEX_SHADER,
      fragmentShader: PAPER_FRAGMENT_SHADER,
      attributes: {
        aTextureCoord: {
          locationName: 'a_TextureCoord',
          type: Shader.Types.VECTOR2,
          data: FULL_PLANE_VIEW_TEX_COORDS,
        },
        aVertexPosition: {
          locationName: 'a_VertexPosition',
          type: Shader.Types.VECTOR2,
          data: FULL_VIEW_PLANE_VERTICES,
        },
      },
      uniforms: {
        uResolution: {
          locationName: 'u_Resolution',
          type: Shader.Types.VECTOR2,
          data: [canvas.width, canvas.height],
        },
        uLandscapeSampler: {
          locationName: 'u_LandscapeSampler',
          type: Shader.Types.INTEGER,
          data: 0,
        },
        uPaperTextureSampler: {
          locationName: 'u_PaperTextureSampler',
          type: Shader.Types.INTEGER,
          data: 1,
        },
      },
    }),
  });
}

(function main() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const brushTexImg =
    <HTMLImageElement>document.getElementById('brush-texture');
  const shadingTexImg =
    <HTMLImageElement>document.getElementById('shading-texture');
  const paperTexImg =
    <HTMLImageElement>document.getElementById('paper-texture');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const camera = new Camera({
    width: canvas.width,
    height: canvas.height,
  });

  const scene = new Scene(canvas);

  scene.setImageTexture('brush', brushTexImg);
  scene.setImageTexture('shading', shadingTexImg);
  scene.setImageTexture('paper', paperTexImg);
  scene.setRenderFrame(
    'landscape', initLandscapeFrame.bind(null, camera));
  scene.setRenderFrame(
    'paper', initPaperLayer.bind(null, canvas));
  scene.render({
    animate: true,
    draw({ animate, firstRender }) {
      const time = scene.getTimeSinceFirstRender(animate);
      const brushTexture = scene.getImageTexture('brush');
      const shadingTexture = scene.getImageTexture('shading');
      const paperTexture = scene.getImageTexture('paper');
      const landscape = scene.getRenderFrame('landscape');
      const paper = scene.getRenderFrame('paper');
      landscape.shader.setUniformData('uTime', time);
      scene.gl.activeTexture(scene.gl.TEXTURE0);
      scene.gl.bindTexture(
        scene.gl.TEXTURE_2D, brushTexture);
      scene.gl.activeTexture(scene.gl.TEXTURE1);
      scene.gl.bindTexture(
        scene.gl.TEXTURE_2D, shadingTexture);
      landscape.render(firstRender);
      scene.gl.activeTexture(scene.gl.TEXTURE0);
      scene.gl.bindTexture(
        scene.gl.TEXTURE_2D, landscape.texture);
      scene.gl.activeTexture(scene.gl.TEXTURE1);
      scene.gl.bindTexture(
        scene.gl.TEXTURE_2D, paperTexture);
      paper.render(firstRender);
    }
  });
})();
