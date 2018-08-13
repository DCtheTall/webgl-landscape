import Shader from './Shader';
import Camera from './Camera';

interface RenderFrameConstructorParams {
  gl: WebGLRenderingContext;
  shader: Shader;
  camera: Camera;
  main?: boolean;
}

export default class RenderFrame {
  private main: boolean;

  private gl: WebGLRenderingContext;
  private shader: Shader;
  private camera: Camera;
  private frameBuffer: WebGLFramebuffer;
  private texture: WebGLTexture;

  constructor({
    main = false,
    gl,
    shader,
    camera,
  }: RenderFrameConstructorParams) {
    this.gl = gl;
    this.frameBuffer = main ?
      null
      : this.gl.createFramebuffer();
    this.shader = shader;
    this.camera = camera;

    this.initTexture(main);
  }

  private initTexture(main: boolean) {
    if (!main) {
      this.texture = null;
      return;
    }
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    // TODO
  }

  public render(nVertices: number) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.shader.useProgram();
    this.shader.sendAttributes();
    this.shader.sendUniforms();
    this.gl.drawArrays(
      this.gl.TRIANGLE_STRIP, 0, nVertices);
  }
}
