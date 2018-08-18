import getSceneRenderFrames, { RenderFrames } from './frames';

const FRAME_RATE = 30;

export default class Scene {
  private gl: WebGLRenderingContext;
  private renderFrames: RenderFrames;

  private lastRender: number;
  private firstRender: number;
  private rendering: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.gl =
      canvas.getContext('webgl')
      || canvas.getContext('experimental-webgl');
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.renderFrames = getSceneRenderFrames(this.gl, canvas);
  }

  public render(animate = false) {
    const now = Date.now();
    if (!this.lastRender) this.firstRender = now;
    if (
      this.rendering
      || (
        this.lastRender
        && ((now - this.lastRender) < (1000 / FRAME_RATE))
      )
    ) {
      if (animate) window.requestAnimationFrame(() => this.render(true));
      return;
    }
    this.rendering = true;
    const time = animate ? -(now - this.firstRender) / 100 : 0;

    this.renderFrames.smoothShadedLandscape.shader.setUniformData('uTime', time);
    this.renderFrames.celShadedLandscape.shader.setUniformData('uTime', time);
    this.renderFrames.smoothShadedLandscape.render(!this.lastRender);
    this.renderFrames.celShadedLandscape.render(!this.lastRender);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(
      this.gl.TEXTURE_2D, this.renderFrames.smoothShadedLandscape.texture);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(
      this.gl.TEXTURE_2D, this.renderFrames.celShadedLandscape.texture);
    this.renderFrames.textureFilter.render(!this.lastRender);

    this.rendering = false;
    this.lastRender = now;
    if (animate) window.requestAnimationFrame(() => this.render(true));
  }
}
