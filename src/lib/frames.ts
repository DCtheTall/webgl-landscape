import Camera from './Camera';
import Shader from './Shader';
import Plane from './Plane';
import RenderFrame from './RenderFrame';

const plane = new Plane();
const smoothShader = require('../shaders/landscape/fragment/smooth.glsl');
const celShader = require('../shaders/landscape/fragment/cel.glsl');

function initLandscapeFrame(
  gl: WebGLRenderingContext,
  camera: Camera,
  fragmentShader: string,
  samplerValue: number,
): RenderFrame {
  return new RenderFrame({
    gl,
    shader: new Shader({
      gl,
      vertexShader: require('../shaders/landscape/vertex.glsl'),
      fragmentShader,
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
          data: <Float32Array>camera.getLookAt(),
          type: Shader.Types.MATRIX4,
        },
        uPerspectiveMatrix: {
          locationName: 'u_PerspectiveMatrix',
          data: <Float32Array>camera.getPerspective(),
          type: Shader.Types.MATRIX4,
        },
        uCameraPosition: {
          locationName: 'u_CameraPosition',
          data: camera.getPosition(),
          type: Shader.Types.VECTOR3,
        },
        uTime: {
          locationName: 'u_Time',
          data: 0,
          type: Shader.Types.FLOAT,
        },
      },
    }),
    width: camera.getSceneWidth(),
    height: camera.getSceneHeight(),
    renderToTexture: true,
    useRenderBuffer: true,
    nVertices: plane.getVertices().length / 2,
  });
}

function initEdgeFilter(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
): RenderFrame {
  const shader = new Shader({
    gl,
    vertexShader: require('../shaders/sobel/vertex.glsl'),
    fragmentShader: require('../shaders/sobel/fragment.glsl'),
    attributes: {
      aTextureCoord: {
        locationName: 'a_TextureCoord',
        type: Shader.Types.VECTOR2,
        data: [0, 1, 0, 0, 1, 1, 1, 0],
      },
      aVertexPosition: {
        locationName: 'a_VertexPosition',
        type: Shader.Types.VECTOR2,
        data: [-1, 1, -1, -1, 1, 1, 1, -1],
      },
    },
    uniforms: {
      uTextureSampler0: {
        locationName: 'u_TextureSampler0',
        type: Shader.Types.INTEGER,
        data: 0,
      },
      uTextureSampler1: {
        locationName: 'u_TextureSampler1',
        type: Shader.Types.INTEGER,
        data: 1,
      },
      uResolution: {
        locationName: 'u_Resolution',
        type: Shader.Types.VECTOR2,
        data: [canvas.width, canvas.height],
      },
    },
  });
  return new RenderFrame({
    gl,
    shader,
    width: canvas.width,
    height: canvas.height,
    nVertices: 4,
    clearBeforeRender: false,
  });
}

export interface RenderFrames {
  smoothShadedLandscape: RenderFrame;
  celShadedLandscape: RenderFrame;
  textureFilter: RenderFrame;
}

export default function getSceneRenderFrames(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
): RenderFrames {
  const camera = new Camera({
    width: canvas.width,
    height: canvas.height,
  });
  return {
    textureFilter: initEdgeFilter(gl, canvas),
    smoothShadedLandscape: initLandscapeFrame(gl, camera, smoothShader, 0),
    celShadedLandscape: initLandscapeFrame(gl, camera, celShader, 1),
  };
}
