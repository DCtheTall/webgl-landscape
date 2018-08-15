import Shader from './Shader';
import Camera from './Camera';
import Plane from './Plane';
import RenderFrame from './RenderFrame';

export default class Scene {
  private gl: WebGLRenderingContext;
  private camera: Camera;
  private plane: Plane;
  private shader: Shader;
  private renderFrame: RenderFrame;

  constructor(canvas: HTMLCanvasElement) {
    this.gl =
      canvas.getContext('webgl')
      || canvas.getContext('experimental-webgl');
    this.gl.clearColor(.75, .87, .9, 1);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.camera = new Camera({
      width: canvas.width,
      height: canvas.height,
    });
    this.plane = new Plane();
    this.shader = new Shader({
      gl: this.gl,
      vertexShader: require('../shaders/landscape/vertex.glsl'),
      fragmentShader: require('../shaders/landscape/fragment.glsl'),
      attributes: {
        aPlaneVertex: {
          locationName: 'a_PlaneVertex',
          data: this.plane.getVertices(),
          type: Shader.Types.VECTOR2,
        },
      },
      uniforms: {
        uViewMatrix: {
          locationName: 'u_ViewMatrix',
          data: <Float32Array>this.camera.getLookAt(),
          type: Shader.Types.MATRIX4,
        },
        uPerspectiveMatrix: {
          locationName: 'u_PerspectiveMatrix',
          data: <Float32Array>this.camera.getPerspective(),
          type: Shader.Types.MATRIX4,
        },
        uCameraPosition: {
          locationName: 'u_CameraPosition',
          data: this.camera.getPosition(),
          type: Shader.Types.VECTOR3,
        },
        uTime: {
          locationName: 'u_Time',
          data: 0,
          type: Shader.Types.FLOAT,
        },
      },
    });
    this.renderFrame = new RenderFrame({
      gl: this.gl,
      camera: this.camera,
      shader: this.shader,
    });
  }

  public render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.renderFrame.render(this.plane.getVertices().length / 2);
  }
}
