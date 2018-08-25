import { FRAME_RATE } from './constants';
import RenderFrame from './RenderFrame';

export default class Scene {
  private lastRender: number;
  private firstRender: number;
  private rendering: boolean;

  private renderFrames: { [index: string]: RenderFrame };
  private textures: { [index: string]: WebGLTexture };

  public readonly gl: WebGLRenderingContext;

  static isPowerOfTwo(n: number): boolean {
    return (n & (n - 1)) === 0;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.gl =
      canvas.getContext('webgl', { preserveDrawingBuffer: true })
      || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.renderFrames = {};
    this.textures = {};
  }

  public getImageTexture(key: string): WebGLTexture {
    return this.textures[key];
  }

  public getRenderFrame(key: string): RenderFrame {
    return this.renderFrames[key];
  }

  public setImageTexture(
    key: string,
    image: HTMLImageElement,
  ) {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    if (Scene.isPowerOfTwo(image.width)) {
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    } else {
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    }
    this.textures[key] = texture;
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  public setRenderFrame(
    key: string,
    callback: (gl: WebGLRenderingContext) => RenderFrame,
  ) {
    this.renderFrames[key] = callback(this.gl);
  }

  public render(animate = false, renderCallback: (firstRender: boolean) => void) {
    const now = Date.now();
    if (!this.lastRender) this.firstRender = now;
    if (
      this.rendering
      || (
        this.lastRender
        && ((now - this.lastRender) < (1000 / FRAME_RATE))
      )
    ) {
      if (animate)
        window.requestAnimationFrame(
          () => this.render(true, renderCallback));
      return;
    }
    this.rendering = true;
    const time = animate ? -(now - this.firstRender) / 100 : 0;
    renderCallback(!this.lastRender);
    this.rendering = false;
    this.lastRender = now;
    if (animate)
      window.requestAnimationFrame(
        () => this.render(true, renderCallback));
  }
}
