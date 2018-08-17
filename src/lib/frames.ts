import Camera from './Camera';
import Shader from './Shader';
import Plane from './Plane';
import RenderFrame from './RenderFrame';

function initSmoothShadingLandscapeFrame(
  gl: WebGLRenderingContext,
  camera: Camera,
): RenderFrame {
  const plane = new Plane();
  const shader = new Shader({
    gl,
    vertexShader: require('../shaders/landscape/vertex.glsl'),
    fragmentShader: require('../shaders/landscape/fragment.glsl'),
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
  });
  return new RenderFrame({
    gl,
    shader,
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
      uTextureSampler2D: {
        locationName: 'u_TextureSampler',
        sampler: true,
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
    smoothShadedLandscape: initSmoothShadingLandscapeFrame(gl, camera),
  };
}
