import Shader from './Shader';
import Camera from './Camera';

interface RenderFrameConstructorParams {
  gl: WebGLRenderingContext;
  shader: Shader;
  camera: Camera;
  renderToTexture?: boolean;
  useRenderBuffer?: boolean;
}

export default class RenderFrame {
  private renderToTexture: boolean;
  private useRenderBuffer: boolean;
  private gl: WebGLRenderingContext;
  private shader: Shader;
  private camera: Camera;
  private frameBuffer: WebGLFramebuffer;
  private texture: WebGLTexture;
  private renderBuffer: WebGLRenderbuffer;

  constructor({
    gl,
    shader,
    camera,
    renderToTexture = false,
    useRenderBuffer = false,
  }: RenderFrameConstructorParams) {
    this.renderToTexture = renderToTexture;
    this.useRenderBuffer = useRenderBuffer;
    this.gl = gl;
    this.shader = shader;
    this.camera = camera;
    this.frameBuffer = renderToTexture ?
      this.gl.createFramebuffer() : null;
    this.initTexture();
    this.initRenderBuffer();
  }

  private initRenderBuffer() {
    if (!this.useRenderBuffer) {
      this.renderBuffer = null;
      return;
    }
    this.renderBuffer = this.gl.createRenderbuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderBuffer);
    this.gl.renderbufferStorage(
      this.gl.RENDERBUFFER,
      this.gl.DEPTH_COMPONENT16,
      this.camera.getSceneWidth(),
      this.camera.getSceneHeight(),
    );
    this.gl.framebufferRenderbuffer(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.RENDERBUFFER,
      this.renderBuffer,
    );
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
  }

  private initTexture() {
    if (!this.renderToTexture) {
      this.texture = null;
      return;
    }
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.camera.getSceneWidth(),
      this.camera.getSceneHeight(),
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.texture,
      0,
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
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
