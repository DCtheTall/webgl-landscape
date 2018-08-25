import { CLEAR_COLOR } from './constants';
import Shader from './Shader';

interface RenderFrameConstructorParams {
  gl: WebGLRenderingContext;
  shader: Shader;
  width: number;
  height: number;
  nVertices: number;
  renderToTexture?: boolean;
  useRenderBuffer?: boolean;
  clearBeforeRender?: boolean;
}

export default class RenderFrame {
  private renderToTexture: boolean;
  private useRenderBuffer: boolean;
  private gl: WebGLRenderingContext;
  private frameBuffer: WebGLFramebuffer;
  private renderBuffer: WebGLRenderbuffer;
  private height: number;
  private width: number;
  private nVertices: number;
  private clearBeforeRender: boolean;

  public shader: Shader;
  public texture: WebGLTexture;

  constructor({
    gl,
    shader,
    width,
    height,
    nVertices,
    renderToTexture = false,
    useRenderBuffer = false,
    clearBeforeRender = true,
  }: RenderFrameConstructorParams) {
    this.renderToTexture = renderToTexture;
    this.useRenderBuffer = useRenderBuffer;
    this.gl = gl;
    this.shader = shader;
    this.width = width;
    this.height = height;
    this.nVertices = nVertices;
    this.frameBuffer = renderToTexture ?
      this.gl.createFramebuffer() : null;
    this.clearBeforeRender = clearBeforeRender;
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
      this.width,
      this.height,
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
      this.width,
      this.height,
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

  public render(firstRender = true) {
    this.shader.useProgram();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderBuffer);
    if (this.clearBeforeRender) {
      this.gl.clearColor.apply(this.gl, CLEAR_COLOR);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    this.gl.viewport(0, 0, this.width, this.height);
    this.shader.sendAttributes(firstRender);
    this.shader.sendUniforms();
    this.gl.drawArrays(
      this.gl.TRIANGLE_STRIP, 0, this.nVertices);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
  }
}
