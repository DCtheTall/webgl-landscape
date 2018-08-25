import { FRAME_RATE } from './constants';
import RenderFrame from './RenderFrame';

export default class Scene {
  private gl: WebGLRenderingContext;

  private lastRender: number;
  private firstRender: number;
  private rendering: boolean;

  private renderFrames: { [index: string]: RenderFrame };

  constructor(canvas: HTMLCanvasElement) {
    this.gl =
      canvas.getContext('webgl', { preserveDrawingBuffer: true })
      || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.renderFrames = {};
  }

  public setRenderFrame(
    key: string,
    callback: (gl: WebGLRenderingContext) => RenderFrame,
  ) {
    this.renderFrames[key] = callback(this.gl);
  }

  public getRenderFrame(key: string): RenderFrame {
    return this.renderFrames[key];
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
